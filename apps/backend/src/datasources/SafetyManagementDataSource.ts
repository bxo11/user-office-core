import { SafetyManagement } from '../models/SafetyManagement';
import { BasicUserDetails } from '../models/User';
import { CreateProposalSafetyManagementArgs } from '../resolvers/mutations/CreateProposalSafetyManagementMutation';
import { UpdateProposalSafetyManagementArgs } from '../resolvers/mutations/UpdateProposalSafetyManagementMutation';

export interface SafetyManagementDataSource {
  getProposalSafetyManagement(
    proposalPk: number
  ): Promise<SafetyManagement | null>;
  create(args: CreateProposalSafetyManagementArgs): Promise<SafetyManagement>;
  update(args: UpdateProposalSafetyManagementArgs): Promise<SafetyManagement>;
  getResponsibleUsers(safetyManagementId: number): Promise<BasicUserDetails[]>;
}
