import { inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { TagDataSource } from '../datasources/TagDataSource';
import { Authorized } from '../decorators';
import { UserWithRole } from '../models/User';

@injectable()
export default class TagQueries {
  constructor(
    @inject(Tokens.TagDataSource)
    private dataSource: TagDataSource
  ) {}

  @Authorized()
  async getTagsForCategory(agent: UserWithRole | null, category: string) {
    const tags = await this.dataSource.getTagsForCategory(category);

    return tags;
  }

  @Authorized()
  async getProposalTags(agent: UserWithRole | null, proposalPk: number) {
    const tags = await this.dataSource.getProposalTags(proposalPk);

    return tags;
  }
}
