import { GraphQLError } from 'graphql';
import { injectable } from 'tsyringe';

import { SafetyManagement } from '../../models/SafetyManagement';
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
  ): Promise<SafetyManagement> {
    return database
      .select()
      .from('safety_management')
      .where('proposal_pk', proposalPk)
      .first()
      .then((s: SafetyManagementRecord) => {
        const result = createSafetyManagementObject(s);

        return result;
      });
  }

  async updateProposalSafetyManagement(
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement> {
    return database('safety_management')
      .update(
        {
          proposal_pk: args.proposalPk,
          safety_level: args.safetyLevel,
          notes: args.notes,
        },
        ['*']
      )
      .where('safety_management_id', args.safetyManagemntId)
      .then((records: SafetyManagementRecord[]) => {
        if (records === undefined || !records.length) {
          throw new GraphQLError(`sa not found ${args.safetyManagemntId}`);
        }

        return createSafetyManagementObject(records[0]);
      });
  }
}
