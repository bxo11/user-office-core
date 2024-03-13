import { container, inject, injectable } from 'tsyringe';

import { ProposalAuthorization } from '../auth/ProposalAuthorization';
import { UserAuthorization } from '../auth/UserAuthorization';
import { Tokens } from '../config/Tokens';
import { SafetyManagementDataSource } from '../datasources/SafetyManagementDataSource';
import { Authorized } from '../decorators';
import { Roles } from '../models/Role';
import { SafetyManagement } from '../models/SafetyManagement';
import { UserWithRole } from '../models/User';

@injectable()
export default class SafetyManagementQueries {
  private proposalAuth = container.resolve(ProposalAuthorization);

  constructor(
    @inject(Tokens.SafetyManagementDataSource)
    public dataSource: SafetyManagementDataSource,
    @inject(Tokens.UserAuthorization) private userAuth: UserAuthorization
  ) {}

  @Authorized([Roles.USER_OFFICER, Roles.SAFETY_MANAGER, Roles.USER])
  async getProposalSafetyManagement(
    agent: UserWithRole | null,
    proposalPk: number
  ): Promise<SafetyManagement | null> {
    const safetyManagement = await this.dataSource.getProposalSafetyManagement(
      proposalPk
    );

    return safetyManagement;
  }

  @Authorized()
  async getProposalSafetyManagementId(
    agent: UserWithRole | null,
    proposalPk: number
  ): Promise<number | null> {
    if (
      !(
        (await this.proposalAuth.isMemberOfProposal(agent, proposalPk)) ||
        this.userAuth.isUserOfficer(agent) ||
        this.userAuth.isSafetyManager(agent)
      )
    ) {
      return null;
    }

    const safetyManagement = await this.dataSource.getProposalSafetyManagement(
      proposalPk
    );

    return safetyManagement?.id || null;
  }
}
