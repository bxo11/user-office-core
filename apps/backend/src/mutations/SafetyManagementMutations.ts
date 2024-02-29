import { inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { SafetyManagementDataSource } from '../datasources/SafetyManagementDataSource';
import { Authorized, EventBus } from '../decorators';
import { Event } from '../events/event.enum';
import { Rejection, rejection } from '../models/Rejection';
import { Roles } from '../models/Role';
import { SafetyManagement } from '../models/SafetyManagement';
import { UserWithRole } from '../models/User';
import { CreateProposalSafetyManagementArgs } from '../resolvers/mutations/CreateProposalSafetyManagementMutation';
import { UpdateProposalSafetyManagementArgs } from '../resolvers/mutations/UpdateProposalSafetyManagementMutation';

@injectable()
export default class SafetyManagementMutations {
  constructor(
    @inject(Tokens.SafetyManagementDataSource)
    private dataSource: SafetyManagementDataSource
  ) {}

  @EventBus(Event.PROPOSAL_SAFETY_MANAGEMENT_DECISSION_UPDATED)
  @Authorized([Roles.USER_OFFICER])
  async updateProposalSafetyManagement(
    agent: UserWithRole | null,
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement | Rejection> {
    return this.dataSource.update(args).catch((error) => {
      return rejection(
        'Could not update proposal tag/s',
        { agent, args },
        error
      );
    });
  }

  @EventBus(Event.PROPOSAL_SAFETY_MANAGEMENT_DECISSION_UPDATED)
  @Authorized([Roles.USER_OFFICER])
  async createProposalSafetyManagement(
    agent: UserWithRole | null,
    args: CreateProposalSafetyManagementArgs
  ): Promise<SafetyManagement | Rejection> {
    return this.dataSource.create(args).catch((error) => {
      return rejection(
        'Could not create proposal tag/s',
        { agent, args },
        error
      );
    });
  }
}
