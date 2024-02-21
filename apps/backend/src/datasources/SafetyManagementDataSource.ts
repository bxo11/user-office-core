import { SafetyManagement } from '../models/SafetyManagement';
import { UpdateProposalSafetyManagementArgs } from '../resolvers/mutations/UpdateProposalSafetyManagementMutation';

export interface SafetyManagementDataSource {
  getProposalSafetyManagement(proposalPk: number): Promise<SafetyManagement>;
  updateProposalSafetyManagement(
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement>;
}
