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
}
