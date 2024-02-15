import React from 'react';
import {
  useQueryParams,
  NumberParam,
  StringParam,
  QueryParamConfig,
} from 'use-query-params';

import {
  DefaultQueryParams,
  UrlQueryParamsType,
} from 'components/common/SuperMaterialTable';
import ProposalFilterBar, {
  questionaryFilterFromUrlQuery,
} from 'components/proposal/ProposalFilterBar';
import { ProposalsFilter } from 'generated/sdk';
import { useCallsData } from 'hooks/call/useCallsData';
import { useInstrumentsData } from 'hooks/instrument/useInstrumentsData';
import { useProposalStatusesData } from 'hooks/settings/useProposalStatusesData';
import { StyledContainer, StyledPaper } from 'styles/StyledComponents';

import ProposalTableSafetyManager from './ProposalTableSafetyManager';

export type ProposalUrlQueryParamsType = {
  call: QueryParamConfig<number | null | undefined>;
  instrument: QueryParamConfig<number | null | undefined>;
  proposalStatus: QueryParamConfig<number | null | undefined>;
  reviewModal: QueryParamConfig<number | null | undefined>;
  compareOperator: QueryParamConfig<string | null | undefined>;
  questionId: QueryParamConfig<string | null | undefined>;
  proposalid: QueryParamConfig<string | null | undefined>;
  value: QueryParamConfig<string | null | undefined>;
  dataType: QueryParamConfig<string | null | undefined>;
} & UrlQueryParamsType;

const SafetyManagementPage = () => {
  const [urlQueryParams, setUrlQueryParams] =
    useQueryParams<ProposalUrlQueryParamsType>({
      ...DefaultQueryParams,
      call: NumberParam,
      instrument: NumberParam,
      proposalStatus: NumberParam,
      reviewModal: NumberParam,
      questionId: StringParam,
      proposalid: StringParam,
      compareOperator: StringParam,
      value: StringParam,
      dataType: StringParam,
    });
  const [proposalFilter, setProposalFilter] = React.useState<ProposalsFilter>({
    callId: urlQueryParams.call,
    instrumentId: urlQueryParams.instrument,
    proposalStatusId: urlQueryParams.proposalStatus,
    proposalFinalStatusId: 1,
    referenceNumbers: urlQueryParams.proposalid
      ? [urlQueryParams.proposalid]
      : undefined,
    questionFilter: questionaryFilterFromUrlQuery(urlQueryParams),
  });
  const { calls, loadingCalls } = useCallsData();
  const { instruments, loadingInstruments } = useInstrumentsData();
  const { proposalStatuses, loadingProposalStatuses } =
    useProposalStatusesData();

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
