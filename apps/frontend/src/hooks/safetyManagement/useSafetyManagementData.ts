import { useEffect, useState, Dispatch, SetStateAction } from 'react';

import { SafetyManagement } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export function useSafetyManagementData({
  proposalPk,
}: {
  proposalPk: number;
}): {
  loadingSafetyManagement: boolean;
  safetyManagement: SafetyManagement | null;
  setSafetyManagementWithLoading: Dispatch<
    SetStateAction<SafetyManagement | null>
  >;
} {
  const api = useDataApi();
  const [safetyManagement, setTags] = useState<SafetyManagement | null>(null);
  const [loadingSafetyManagement, setLoadingTags] = useState(true);

  const setSafetyManagementWithLoading = (
    data: SetStateAction<SafetyManagement | null>
  ) => {
    setLoadingTags(true);
    setTags(data);
    setLoadingTags(false);
  };

  useEffect(() => {
    let unmounted = false;

    setLoadingTags(true);

    api()
      .getProposalSafetyManagement({ proposalPk })
      .then((data) => {
        if (unmounted) {
          return;
        }

        if (data.proposalSafetyManagement) {
          setTags(data.proposalSafetyManagement);
        }
        setLoadingTags(false);
      });

    return () => {
      unmounted = true;
    };
  }, [proposalPk, api]);

  return {
    loadingSafetyManagement,
    safetyManagement,
    setSafetyManagementWithLoading,
  };
}
