import { inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { SafetyManagementDataSource } from '../datasources/SafetyManagementDataSource';
import { Authorized } from '../decorators';
import { Rejection, rejection } from '../models/Rejection';
import { Roles } from '../models/Role';
import { SafetyManagement } from '../models/SafetyManagement';
import { UserWithRole } from '../models/User';
import { UpdateProposalSafetyManagementArgs } from '../resolvers/mutations/UpdateProposalSafetyManagementMutation';

@injectable()
export default class SafetyManagementMutations {
  constructor(
    @inject(Tokens.SafetyManagementDataSource)
    private dataSource: SafetyManagementDataSource
  ) {}

  @Authorized([Roles.USER_OFFICER])
  async updateProposalSafetyManagement(
    agent: UserWithRole | null,
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement | Rejection> {
    return this.dataSource
      .updateProposalSafetyManagement(args)
      .catch((error) => {
        return rejection(
          'Could not update proposal tag/s',
          { agent, args },
          error
        );
      });
  }
}
