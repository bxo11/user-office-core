import { inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { SafetyManagementDataSource } from '../datasources/SafetyManagementDataSource';
import { Authorized } from '../decorators';
import { Roles } from '../models/Role';
import { SafetyManagement } from '../models/SafetyManagement';
import { UserWithRole } from '../models/User';

@injectable()
export default class SafetyManagementQueries {
  constructor(
    @inject(Tokens.SafetyManagementDataSource)
    public dataSource: SafetyManagementDataSource
  ) {}

  @Authorized([Roles.USER_OFFICER, Roles.SAFETY_MANAGER])
  async getProposalSafetyManagement(
    agent: UserWithRole | null,
    proposalPk: number
  ): Promise<SafetyManagement | null> {
    const safetyManagement = await this.dataSource.getProposalSafetyManagement(
      proposalPk
    );

    return safetyManagement;
  }
}
