import { GraphQLError } from 'graphql';
import { injectable } from 'tsyringe';

import { Tag } from '../../models/Tag';
import { TagDataSource } from '../TagDataSource';
import database from './database';
import { TagRecord, createTagObject } from './records';
@injectable()
export default class PostgresTagDataSource implements TagDataSource {
  async getTagsForCategory(category: string): Promise<Tag[]> {
    return database
      .select()
      .from('tags')
      .orderBy('tag_id', 'desc')
      .where('category', category)
      .then((tags: TagRecord[]) => {
        const result = tags.map((tag) => createTagObject(tag));

        return result;
      });
  }

  async getProposalTags(proposalPk: number): Promise<Tag[]> {
    return database
      .select()
      .from('tags')
      .join('proposal_tags', 'tags.tag_id', 'proposal_tags.tag_id')
      .where('proposal_tags.proposal_pk', proposalPk)
      .then((tags: TagRecord[]) => {
        const result = tags.map((tag) => createTagObject(tag));

        return result;
      });
  }

  async updateProposalTags(
    proposalPk: number,
    tagIds: number[]
  ): Promise<boolean> {
    try {
      await database.transaction(async (trx) => {
        await database('proposal_tags')
          .where('proposal_pk', proposalPk)
          .del()
          .transacting(trx);

        if (tagIds.length > 0) {
          await database('proposal_tags')
            .insert(
              tagIds.map((tagId) => ({
                tag_id: tagId,
                proposal_pk: proposalPk,
              }))
            )
            .transacting(trx);
        }
        await trx.commit();
      });

      return true;
    } catch (error) {
      throw new GraphQLError(
        `Could not assign tags ${tagIds} to proposal with id: ${proposalPk}`
      );
    }
  }

  async assingTagsToProposal(
    proposalPk: number,
    tagIds: number[]
  ): Promise<boolean> {
    const dataToInsert = tagIds.map((tagId) => ({
      tag_id: tagId,
      proposal_pk: proposalPk,
    }));

    const result = await database('proposal_tags').insert(dataToInsert);

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async removeTagsFromProposal(
    proposalPk: number,
    tagIds: number[]
  ): Promise<boolean> {
    const result = await database('proposal_tags')
      .where('proposal_pk', proposalPk)
      .whereIn('tag_id', tagIds)
      .del();

    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
