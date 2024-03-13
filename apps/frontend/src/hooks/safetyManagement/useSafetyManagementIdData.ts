import { useEffect, useState } from 'react';

import { useDataApi } from 'hooks/common/useDataApi';

export function useSafetyManagementIdData(proposalPk: number) {
  const api = useDataApi();
  const [safetyManagementId, setSafetyManagementId] = useState<
    number | null | undefined
  >(undefined);
  useEffect(() => {
    api()
      .getProposalSafetyManagementId({ proposalPk })
      .then((data) => {
        setSafetyManagementId(data.proposalSafetyManagementId);
      });
  }, [api, proposalPk]);

  return { safetyManagementId, setSafetyManagementId };
}
