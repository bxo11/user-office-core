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
import { UpdateEsraStatusMutationArgs } from '../resolvers/mutations/UpdateEsraStatusMutation';
import { UpdateProposalSafetyManagementArgs } from '../resolvers/mutations/UpdateProposalSafetyManagementMutation';

@injectable()
export default class SafetyManagementMutations {
  constructor(
    @inject(Tokens.SafetyManagementDataSource)
    private dataSource: SafetyManagementDataSource
  ) {}

  @EventBus(Event.PROPOSAL_SAFETY_MANAGEMENT_DECISSION_UPDATED)
  @Authorized([Roles.USER_OFFICER, Roles.SAFETY_MANAGER])
  async updateProposalSafetyManagement(
    agent: UserWithRole | null,
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement | Rejection> {
    return this.dataSource.update(args).catch((error) => {
      return rejection(
        'Could not update proposal safety management',
        { agent, args },
        error
      );
    });
  }

  @EventBus(Event.PROPOSAL_SAFETY_MANAGEMENT_DECISSION_UPDATED)
  @Authorized([Roles.USER_OFFICER, Roles.SAFETY_MANAGER])
  async createProposalSafetyManagement(
    agent: UserWithRole | null,
    args: CreateProposalSafetyManagementArgs
  ): Promise<SafetyManagement | Rejection> {
    return this.dataSource.create(args).catch((error) => {
      return rejection(
        'Could not create proposal safety management',
        { agent, args },
        error
      );
    });
  }

  @EventBus(Event.PROPOSAL_SAFETY_MANAGEMENT_ESRA_STATUS_UPDATED)
  @Authorized([Roles.USER_OFFICER, Roles.SAFETY_MANAGER])
  async updateEsraStatus(
    agent: UserWithRole | null,
    args: UpdateEsraStatusMutationArgs
  ): Promise<SafetyManagement | Rejection> {
    const safetyManagement = await this.dataSource.getProposalSafetyManagement(
      args.proposalPk
    );

    if (!safetyManagement) {
      return rejection('Safety management not found', { agent, args });
    }

    if (safetyManagement.esraStatus === args.esraStatus) {
      return rejection('ESRA status is already set to the same value', {
        agent,
        args,
      });
    }

    return this.dataSource
      .update({
        esraStatus: args.esraStatus,
        safetyManagementId: safetyManagement.id,
      })
      .catch((error) => {
        return rejection(
          'Could not update ESRA status',
          { agent, args },
          error
        );
      });
  }
}
