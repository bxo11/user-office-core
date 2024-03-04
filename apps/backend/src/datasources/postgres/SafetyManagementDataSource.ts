import { GraphQLError } from 'graphql';
import { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';

import { Tokens } from '../../config/Tokens';
import { SafetyManagement } from '../../models/SafetyManagement';
import { BasicUserDetails } from '../../models/User';
import { CreateProposalSafetyManagementArgs } from '../../resolvers/mutations/CreateProposalSafetyManagementMutation';
import { UpdateProposalSafetyManagementArgs } from '../../resolvers/mutations/UpdateProposalSafetyManagementMutation';
import { SafetyManagementDataSource } from '../SafetyManagementDataSource';
import { TagDataSource } from '../TagDataSource';
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
  constructor(
    @inject(Tokens.TagDataSource) private tagDataSource: TagDataSource
  ) {}

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
              esra_status: args.esraStatus,
              notes: args.notes,
            })
            .into('safety_management')
            .transacting(trx)
            .returning('*');

          if (args.tagIds && args.tagIds.length > 0) {
            await this.tagDataSource.insertProposalTags(
              args.tagIds.map((tagId) => ({
                tag_id: tagId,
                proposal_pk: result.proposal_pk,
              })),
              trx
            );
          }

          if (args.responsibleUserIds && args.responsibleUserIds.length > 0) {
            await this.insertResponsisbleUsers(
              args.responsibleUserIds.map((userId) => ({
                user_id: userId,
                safety_management_id: result.safety_management_id,
              })),
              trx
            );
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
      const safetyManagement: SafetyManagementRecord =
        await database.transaction(async (trx) => {
          const [result]: SafetyManagementRecord[] = await database(
            'safety_management'
          )
            .update({
              proposal_pk: args.proposalPk,
              safety_level: args.safetyLevel,
              esra_status: args.esraStatus,
              notes: args.notes,
            })
            .where('safety_management_id', args.safetyManagementId)
            .transacting(trx)
            .returning('*');

          if (args.tagIds) {
            await this.tagDataSource.removeProposalTags(
              result.proposal_pk,
              trx
            );

            if (args.tagIds.length > 0) {
              await this.tagDataSource.insertProposalTags(
                args.tagIds.map((tagId) => ({
                  tag_id: tagId,
                  proposal_pk: result.proposal_pk,
                })),
                trx
              );
            }
          }

          if (args.responsibleUserIds) {
            await this.removeResponsibleUsers(args.safetyManagementId, trx);

            if (args.responsibleUserIds.length > 0) {
              await this.insertResponsisbleUsers(
                args.responsibleUserIds.map((userId) => ({
                  user_id: userId,
                  safety_management_id: args.safetyManagementId,
                })),
                trx
              );
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

  async insertResponsisbleUsers(
    insertValues: { user_id: number; safety_management_id: number }[],
    trx?: Knex.Transaction | null
  ) {
    let query = database('safety_management_users').insert(insertValues);

    if (trx) {
      query = query.transacting(trx);
    }

    await query;
  }

  async removeResponsibleUsers(
    safetyManagementId: number,
    trx?: Knex.Transaction | null
  ) {
    let query = database('safety_management_users')
      .where('safety_management_id', safetyManagementId)
      .del();

    if (trx) {
      query = query.transacting(trx);
    }

    await query;
  }
}
