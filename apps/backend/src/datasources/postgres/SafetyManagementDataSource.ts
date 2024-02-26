import { GraphQLError } from 'graphql';
import { injectable } from 'tsyringe';

import { SafetyManagement } from '../../models/SafetyManagement';
import { BasicUserDetails } from '../../models/User';
import { CreateProposalSafetyManagementArgs } from '../../resolvers/mutations/CreateProposalSafetyManagementMutation';
import { UpdateProposalSafetyManagementArgs } from '../../resolvers/mutations/UpdateProposalSafetyManagementMutation';
import { SafetyManagementDataSource } from '../SafetyManagementDataSource';
import database from './database';
import {
  InstitutionRecord,
  SafetyManagementRecord,
  UserRecord,
  createBasicUserObject,
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
    try {
      const safetyManagement: SafetyManagementRecord =
        await database.transaction(async (trx) => {
          const [result]: SafetyManagementRecord[] = await database(
            'safety_management'
          )
            .insert({
              proposal_pk: args.proposalPk,
              safety_level: args.safetyLevel,
              notes: args.notes,
            })
            .into('safety_management')
            .transacting(trx)
            .returning('*');

          if (args.responsibleUserIds && args.responsibleUserIds.length > 0) {
            await database('safety_management_users')
              .insert(
                args.responsibleUserIds.map((userId) => ({
                  user_id: userId,
                  safety_management_id: result.safety_management_id,
                }))
              )
              .transacting(trx);
          }

          return result;
        });

      return createSafetyManagementObject(safetyManagement);
    } catch (error) {
      throw new GraphQLError(`Could not create safety management ${error}`);
    }
  }

  async update(
    args: UpdateProposalSafetyManagementArgs
  ): Promise<SafetyManagement> {
    try {
      const [safetyManagement]: SafetyManagementRecord[] =
        await database.transaction(async (trx) => {
          const result = await database('safety_management')
            .update({
              proposal_pk: args.proposalPk,
              safety_level: args.safetyLevel,
              notes: args.notes,
            })
            .where('safety_management_id', args.safetyManagementId)
            .transacting(trx)
            .returning('*');

          if (args.responsibleUserIds) {
            await database('safety_management_users')
              .where('safety_management_id', args.safetyManagementId)
              .del()
              .transacting(trx);

            if (args.responsibleUserIds.length > 0) {
              await database('safety_management_users')
                .insert(
                  args.responsibleUserIds.map((userId) => ({
                    user_id: userId,
                    safety_management_id: args.safetyManagementId,
                  }))
                )
                .transacting(trx);
            }
          }

          return result;
        });

      return createSafetyManagementObject(safetyManagement);
    } catch (error) {
      throw new GraphQLError(
        `Could not update safety management with id: ${args.safetyManagementId} ${error}`
      );
    }
  }

  async getResponsibleUsers(
    safetyManagementId: number
  ): Promise<BasicUserDetails[]> {
    return database
      .select()
      .from('users as u')
      .join('institutions as i', { 'u.institution_id': 'i.institution_id' })
      .join('safety_management_users as smu', { 'u.user_id': 'smu.user_id' })
      .where('smu.safety_management_id', safetyManagementId)
      .then((usersRecord: Array<UserRecord & InstitutionRecord>) =>
        usersRecord.map((user) => createBasicUserObject(user))
      );
  }

  async addResponsibleUsers(
    safetyManagementId: number,
    userId: number[]
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async removeResponsibleUsers(
    safetyManagementId: number,
    userId: number[]
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
