import { GraphQLError } from 'graphql';
import { injectable } from 'tsyringe';

import { SafetyManagement } from '../../models/SafetyManagement';
import { CreateProposalSafetyManagementArgs } from '../../resolvers/mutations/CreateProposalSafetyManagementMutation';
import { UpdateProposalSafetyManagementArgs } from '../../resolvers/mutations/UpdateProposalSafetyManagementMutation';
import { SafetyManagementDataSource } from '../SafetyManagementDataSource';
import database from './database';
import {
  SafetyManagementRecord,
  createSafetyManagementObject,
} from './records';

@injectable()
export default class PostgresSafetyManagementDataSource
  implements SafetyManagementDataSource
{
  async getProposalSafetyManagement(
    proposalPk: number
  ): Promise<SafetyManagement | null> {
    return database
      .select()
      .from('safety_management')
      .where('proposal_pk', proposalPk)
      .first()
      .then((s: SafetyManagementRecord | null) =>
        s ? createSafetyManagementObject(s) : null
      );
  }

  async create(
    args: CreateProposalSafetyManagementArgs
  ): Promise<SafetyManagement> {
    const [instrumentRecord]: SafetyManagementRecord[] = await database
      .insert({
        proposal_pk: args.proposalPk,
        safety_level: args.safetyLevel,
        notes: args.notes,
      })
      .into('safety_management')
      .returning('*');

    if (!instrumentRecord) {
      throw new GraphQLError('Could not create Safety management');
    }

    return createSafetyManagementObject(instrumentRecord);
  }

  async update(
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement> {
    const [sRecord]: SafetyManagementRecord[] = await database(
      'safety_management'
    )
      .update({
        proposal_pk: args.proposalPk,
        safety_level: args.safetyLevel,
        notes: args.notes,
      })
      .where('safety_management_id', args.safetyManagementId)
      .returning('*');

    if (!sRecord) {
      throw new GraphQLError(
        `Safety management not found ${args.safetyManagementId}`
      );
    }

    return createSafetyManagementObject(sRecord);
  }
}
