import React from 'react';
import {
  useQueryParams,
  NumberParam,
  StringParam,
  QueryParamConfig,
  DelimitedNumericArrayParam,
} from 'use-query-params';

import {
  DefaultQueryParams,
  UrlQueryParamsType,
} from 'components/common/SuperMaterialTable';
import ProposalFilterBar, {
  questionaryFilterFromUrlQuery,
} from 'components/proposal/ProposalFilterBar';
import { ProposalEndStatus, ProposalsFilter } from 'generated/sdk';
import { useCallsData } from 'hooks/call/useCallsData';
import { useInstrumentsData } from 'hooks/instrument/useInstrumentsData';
import { useProposalStatusesData } from 'hooks/settings/useProposalStatusesData';
import { useTagsData } from 'hooks/tag/useTagsData';
import { StyledContainer, StyledPaper } from 'styles/StyledComponents';

import ProposalTableSafetyManager from './ProposalTableSafetyManager';

export type ProposalUrlQueryParamsType = {
  call: QueryParamConfig<number | null | undefined>;
  instrument: QueryParamConfig<number | null | undefined>;
  proposalStatus: QueryParamConfig<number | null | undefined>;
  proposalFinalStatus: QueryParamConfig<string | null | undefined>;
  reviewModal: QueryParamConfig<number | null | undefined>;
  compareOperator: QueryParamConfig<string | null | undefined>;
  questionId: QueryParamConfig<string | null | undefined>;
  proposalid: QueryParamConfig<string | null | undefined>;
  value: QueryParamConfig<string | null | undefined>;
  dataType: QueryParamConfig<string | null | undefined>;
  proposalTagIds: QueryParamConfig<(number | null)[] | null | undefined>;
} & UrlQueryParamsType;

const SafetyManagementPage = () => {
  const [urlQueryParams, setUrlQueryParams] =
    useQueryParams<ProposalUrlQueryParamsType>({
      ...DefaultQueryParams,
      call: NumberParam,
      instrument: NumberParam,
      proposalStatus: NumberParam,
      proposalFinalStatus: StringParam,
      reviewModal: NumberParam,
      questionId: StringParam,
      proposalid: StringParam,
      compareOperator: StringParam,
      value: StringParam,
      dataType: StringParam,
      proposalTagIds: DelimitedNumericArrayParam,
    });
  const [proposalFilter, setProposalFilter] = React.useState<ProposalsFilter>({
    callId: urlQueryParams.call,
    instrumentId: urlQueryParams.instrument,
    proposalStatusId: urlQueryParams.proposalStatus,
    proposalFinalStatus: urlQueryParams.proposalFinalStatus
      ? ProposalEndStatus[
          urlQueryParams.proposalFinalStatus as keyof typeof ProposalEndStatus
        ]
      : undefined,
    referenceNumbers: urlQueryParams.proposalid
      ? [urlQueryParams.proposalid]
      : undefined,
    questionFilter: questionaryFilterFromUrlQuery(urlQueryParams),
    proposalTagIds: urlQueryParams.proposalTagIds,
  });
  const { calls, loadingCalls } = useCallsData();
  const { instruments, loadingInstruments } = useInstrumentsData();
  const { proposalStatuses, loadingProposalStatuses } =
    useProposalStatusesData();
  const { tags, loadingTags } = useTagsData({ category: 'PROPOSAL' });

  return (
    <StyledContainer>
      <StyledPaper>
        <ProposalFilterBar
          calls={{ data: calls, isLoading: loadingCalls }}
          instruments={{
            data: instruments,
            isLoading: loadingInstruments,
          }}
          proposalStatuses={{
            data: proposalStatuses,
            isLoading: loadingProposalStatuses,
          }}
          proposalFinalStatuses={{
            data: [
              ProposalEndStatus.ACCEPTED,
              ProposalEndStatus.REJECTED,
              ProposalEndStatus.RESERVED,
              ProposalEndStatus.UNSET,
            ],
          }}
          proposalTags={{
            data: tags,
            isLoading: loadingTags,
          }}
          setProposalFilter={setProposalFilter}
          filter={proposalFilter}
        />
        <ProposalTableSafetyManager
          proposalFilter={proposalFilter}
          setProposalFilter={setProposalFilter}
          urlQueryParams={urlQueryParams}
          setUrlQueryParams={setUrlQueryParams}
        />
      </StyledPaper>
    </StyledContainer>
  );
};

export default SafetyManagementPage;
