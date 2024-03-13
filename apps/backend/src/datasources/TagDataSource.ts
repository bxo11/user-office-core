import { Knex } from 'knex';

import { Tag } from '../models/Tag';

export interface TagDataSource {
  getTagsForCategory(category: string): Promise<Tag[]>;
  updateProposalTags(proposalPk: number, tagIds: number[]): Promise<boolean>;
  assingTagsToProposal(proposalPk: number, tagIds: number[]): Promise<boolean>;
  removeTagsFromProposal(
    proposalPk: number,
    tagIds: number[]
  ): Promise<boolean>;
  getProposalTags(proposalPk: number): Promise<Tag[]>;
  insertProposalTags(
    insertData: { tag_id: number; proposal_pk: number }[],
    trx?: Knex.Transaction | null
  ): Promise<void>;
  removeProposalTags(
    proposalPk: number,
    trx?: Knex.Transaction | null
  ): Promise<void>;
}
