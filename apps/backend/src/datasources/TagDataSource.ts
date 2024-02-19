import { Tag } from '../models/Tag';

export interface TagDataSource {
  getTagsForCategory(category: string): Promise<Tag[]>;
  assingTagsToProposal(proposalPk: number, tagIds: number[]): Promise<boolean>;
  removeTagsFromProposal(
    proposalPk: number,
    tagIds: number[]
  ): Promise<boolean>;
  getProposalTags(proposalPk: number): Promise<Tag[]>;
}
