import { Column } from '@material-table/core';
import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { TFunction } from 'i18next';
import React, { useContext, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { DecodedValueMap, SetQuery } from 'use-query-params';

import CopyToClipboard from 'components/common/CopyToClipboard';
import MaterialTable from 'components/common/DenseMaterialTable';
import ProposalReviewContent, {
  PROPOSAL_MODAL_TAB_NAMES,
} from 'components/review/ProposalReviewContent';
import ProposalReviewModal from 'components/review/ProposalReviewModal';
import { FeatureContext } from 'context/FeatureContextProvider';
import {
  Proposal,
  ProposalsFilter,
  ProposalSelectionInput,
  FeatureId,
} from 'generated/sdk';
import { useLocalStorage } from 'hooks/common/useLocalStorage';
import {
  ProposalViewData,
  useProposalsCoreData,
} from 'hooks/proposal/useProposalsCoreData';
import {
  addColumns,
  fromProposalToProposalView,
  removeColumns,
  setSortDirectionOnSortColumn,
} from 'utils/helperFunctions';
import { tableIcons } from 'utils/materialIcons';
import withConfirm, { WithConfirmType } from 'utils/withConfirm';

import { ProposalUrlQueryParamsType } from './SafetyManagementPage';

type ProposalTableSafetyManagerProps = {
  proposalFilter: ProposalsFilter;
  setProposalFilter: (filter: ProposalsFilter) => void;
  urlQueryParams: DecodedValueMap<ProposalUrlQueryParamsType>;
  setUrlQueryParams: SetQuery<ProposalUrlQueryParamsType>;
  confirm: WithConfirmType;
};

export type ProposalSelectionType = ProposalSelectionInput & {
  title: string;
  proposalId: string;
  instrumentId: number | null;
  fapId: number | null;
  statusId: number;
};

export type QueryParameters = {
  first?: number;
  offset?: number;
  sortField?: string | undefined;
  sortDirection?: string | undefined;
  searchText?: string | undefined;
};

let columns: Column<ProposalViewData>[] = [
  {
    title: 'Actions',
    cellStyle: { padding: 0 },
    sorting: false,
    removable: false,
    field: 'rowActionButtons',
  },
  {
    title: 'Proposal ID',
    field: 'proposalId',
    render: (rawData) => (
      <CopyToClipboard
        text={rawData.proposalId}
        successMessage={`'${rawData.proposalId}' copied to clipboard`}
        position="right"
      >
        {rawData.proposalId || ''}
      </CopyToClipboard>
    ),
  },
  {
    title: 'Title',
    field: 'title',
    ...{ width: 'auto' },
  },
  {
    title: 'Principal Investigator',
    field: 'principalInvestigator',
    sorting: false,
    emptyValue: '-',
    render: (proposalView) => {
      if (
        proposalView.principalInvestigator?.lastname &&
        proposalView.principalInvestigator?.preferredname
      ) {
        return `${proposalView.principalInvestigator.lastname}, ${proposalView.principalInvestigator.preferredname}`;
      } else if (
        proposalView.principalInvestigator?.lastname &&
        proposalView.principalInvestigator?.firstname
      ) {
        return `${proposalView.principalInvestigator.lastname}, ${proposalView.principalInvestigator.firstname}`;
      }

      return '';
    },
  },
  {
    title: 'PI Email',
    field: 'principalInvestigator.email',
    sorting: false,
    emptyValue: '-',
  },
  {
    title: 'Status',
    field: 'statusName',
  },
  {
    title: 'Call',
    field: 'callShortCode',
  },
];

const instrumentManagementColumns = (
  t: TFunction<'translation', undefined, 'translation'>
) => [{ title: t('instrument'), field: 'instrumentName', emptyValue: '-' }];

const PREFETCH_SIZE = 200;

const ProposalTableSafetyManager = ({
  proposalFilter,
  setProposalFilter,
  urlQueryParams,
  setUrlQueryParams,
}: ProposalTableSafetyManagerProps) => {
  const [tableData, setTableData] = useState<ProposalViewData[]>([]);
  const [preselectedProposalsData, setPreselectedProposalsData] = useState<
    ProposalViewData[]
  >([]);

  const { t } = useTranslation();
  const [localStorageValue, setLocalStorageValue] = useLocalStorage<
    Column<ProposalViewData>[] | null
  >('proposalColumnsOfficer', null);
  const featureContext = useContext(FeatureContext);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [query, setQuery] = useState<QueryParameters>({
    first: PREFETCH_SIZE,
    offset: 0,
    sortField: urlQueryParams?.sortField,
    sortDirection: urlQueryParams?.sortDirection ?? undefined,
    searchText: urlQueryParams?.search ?? undefined,
  });

  const { loading, setProposalsData, proposalsData, totalCount } =
    useProposalsCoreData(proposalFilter, query);

  useEffect(() => {
    setPreselectedProposalsData(proposalsData);
  }, [proposalsData, query]);

  useEffect(() => {
    let isMounted = true;
    let endSlice = rowsPerPage * (currentPage + 1);
    endSlice = endSlice == 0 ? PREFETCH_SIZE + 1 : endSlice; // Final page of a loaded section would produce the slice (x, 0) without this
    if (isMounted) {
      setTableData(
        preselectedProposalsData.slice(
          (currentPage * rowsPerPage) % PREFETCH_SIZE,
          endSlice
        )
      );
    }

    return () => {
      isMounted = false;
    };
  }, [currentPage, rowsPerPage, preselectedProposalsData, query]);

  const isInstrumentManagementEnabled = featureContext.featuresMap.get(
    FeatureId.INSTRUMENT_MANAGEMENT
  )?.isEnabled;

  /**
   * NOTE: Custom action buttons are here because when we have them inside actions on the material-table
   * and selection flag is true they are not working properly.
   */
  const RowActionButtons = (rowData: ProposalViewData) => (
    <Tooltip title="View proposal">
      <IconButton
        data-cy="view-proposal"
        onClick={() => {
          setUrlQueryParams({ reviewModal: rowData.primaryKey });
        }}
      >
        <Visibility />
      </IconButton>
    </Tooltip>
  );

  if (isInstrumentManagementEnabled) {
    addColumns(columns, instrumentManagementColumns(t));
  } else {
    removeColumns(columns, instrumentManagementColumns(t));
  }

  columns = columns.map((v: Column<ProposalViewData>) => {
    v.customSort = () => 0; // Disables client side sorting

    return v;
  });

  // NOTE: We are remapping only the hidden field because functions like `render` can not be stringified.
  if (localStorageValue) {
    columns = columns.map((column) => ({
      ...column,
      hidden: localStorageValue?.find(
        (localStorageValueItem) => localStorageValueItem.title === column.title
      )?.hidden,
    }));
  }

  columns = setSortDirectionOnSortColumn(
    columns,
    urlQueryParams.sortColumn,
    urlQueryParams.sortDirection
  );
  const proposalToReview = preselectedProposalsData.find(
    (proposal) =>
      proposal.primaryKey === urlQueryParams.reviewModal ||
      proposal.proposalId === urlQueryParams.proposalid
  );

  const userOfficerProposalReviewTabs = [
    PROPOSAL_MODAL_TAB_NAMES.PROPOSAL_INFORMATION,
    PROPOSAL_MODAL_TAB_NAMES.SAFETY_MANAGEMENT,
    PROPOSAL_MODAL_TAB_NAMES.LOGS,
  ];

  /** NOTE:
   * Including the id property for https://material-table-core.com/docs/breaking-changes#id
   * Including the action buttons as property to avoid the console warning(https://github.com/material-table-core/core/issues/286)
   */
  const preselectedProposalDataWithIdAndRowActions = tableData.map((proposal) =>
    Object.assign(proposal, {
      id: proposal.primaryKey,
      rowActionButtons: RowActionButtons(proposal),
      assignedTechnicalReviewer: proposal.technicalReviewAssigneeFirstName
        ? `${proposal.technicalReviewAssigneeFirstName} ${proposal.technicalReviewAssigneeLastName}`
        : '-',
      technicalTimeAllocationRendered: proposal.technicalTimeAllocation
        ? `${proposal.technicalTimeAllocation}(${proposal.allocationTimeUnit}s)`
        : '-',
      finalTimeAllocationRendered: proposal.managementTimeAllocation
        ? `${proposal.managementTimeAllocation}(${proposal.allocationTimeUnit}s)`
        : '-',
    })
  );

  return (
    <>
      <ProposalReviewModal
        title={`View proposal: ${proposalToReview?.title} (${proposalToReview?.proposalId})`}
        proposalReviewModalOpen={!!proposalToReview}
        setProposalReviewModalOpen={(updatedProposal?: Proposal) => {
          setProposalsData(
            proposalsData.map((proposal) => {
              if (proposal.primaryKey === updatedProposal?.primaryKey) {
                return fromProposalToProposalView(updatedProposal);
              } else {
                return proposal;
              }
            })
          );
          if (urlQueryParams.proposalid) {
            setUrlQueryParams({
              proposalid: undefined,
            });
            setProposalFilter({
              ...proposalFilter,
              referenceNumbers: undefined,
            });
          }
          setUrlQueryParams({ reviewModal: undefined });
        }}
        reviewItemId={proposalToReview?.primaryKey}
      >
        <ProposalReviewContent
          proposalPk={proposalToReview?.primaryKey as number}
          tabNames={userOfficerProposalReviewTabs}
        />
      </ProposalReviewModal>
      <MaterialTable
        icons={tableIcons}
        title={
          <Typography variant="h6" component="h2">
            Proposals
          </Typography>
        }
        columns={columns}
        data={preselectedProposalDataWithIdAndRowActions}
        totalCount={totalCount}
        page={currentPage}
        onPageChange={(page, pageSize) => {
          const newOffset =
            Math.floor((pageSize * page) / PREFETCH_SIZE) * PREFETCH_SIZE;
          if (page !== currentPage && newOffset != query.offset) {
            setQuery({ ...query, offset: newOffset });
          }
          setCurrentPage(page);
        }}
        onRowsPerPageChange={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
        isLoading={loading}
        onSearchChange={(searchText) => {
          setQuery({
            ...query,
            searchText: searchText ? searchText : undefined,
          });
          setUrlQueryParams({ search: searchText ? searchText : undefined });
        }}
        onChangeColumnHidden={(columnChange) => {
          const proposalColumns = columns.map(
            (proposalColumn: Column<ProposalViewData>) => ({
              hidden:
                proposalColumn.title === columnChange.title
                  ? columnChange.hidden
                  : proposalColumn.hidden,
              title: proposalColumn.title,
            })
          );

          setLocalStorageValue(proposalColumns);
        }}
        onOrderChange={(orderedColumnId, orderDirection) => {
          setUrlQueryParams &&
            setUrlQueryParams((params) => ({
              ...params,
              sortColumn: orderedColumnId >= 0 ? orderedColumnId : undefined,
              sortField:
                orderedColumnId >= 0
                  ? columns[orderedColumnId].field?.toString()
                  : undefined,
              sortDirection: orderDirection ? orderDirection : undefined,
            }));
          if (orderDirection && orderedColumnId > 0) {
            setQuery({
              ...query,
              sortField: columns[orderedColumnId].field?.toString(),
              sortDirection: orderDirection,
            });
          } else {
            delete query.sortField;
            delete query.sortDirection;
            setQuery(query);
          }
        }}
      />
    </>
  );
};

export default React.memo(withConfirm(ProposalTableSafetyManager), isEqual);
