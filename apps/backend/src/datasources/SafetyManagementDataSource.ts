import { SafetyManagement } from '../models/SafetyManagement';

export interface SafetyManagementDataSource {
  getProposalSafetyManagement(proposalPk: number): Promise<SafetyManagement>;
  updateProposalSafetyManagement(
    proposalPk: number,
    safetyManagement: boolean
  ): Promise<SafetyManagement>;
}
