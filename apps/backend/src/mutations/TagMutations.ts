import { inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { TagDataSource } from '../datasources/TagDataSource';
import { Authorized } from '../decorators';
import { Rejection, rejection } from '../models/Rejection';
import { Roles } from '../models/Role';
import { UserWithRole } from '../models/User';
import {
  AssignTagsToProposalArgs,
  RemoveTagsFromProposalArgs,
} from '../resolvers/mutations/AssignTagsToProposalMutation';
import { UpdateProposalTagsArgs } from '../resolvers/mutations/UpdateProposalTagsMutation';

@injectable()
export default class TagMutations {
  constructor(
    @inject(Tokens.TagDataSource)
    private dataSource: TagDataSource
  ) {}

  @Authorized([Roles.USER_OFFICER])
  async updateProposalTags(
    agent: UserWithRole | null,
    args: UpdateProposalTagsArgs
  ): Promise<boolean | Rejection> {
    return this.dataSource
      .updateProposalTags(args.proposalPk, args.tagIds)
      .catch((error) => {
        return rejection(
          'Could not update proposal tag/s',
          { agent, args },
          error
        );
      });
  }

  @Authorized([Roles.USER_OFFICER])
  async assignTagsToProposal(
    agent: UserWithRole | null,
    args: AssignTagsToProposalArgs
  ): Promise<boolean | Rejection> {
    return this.dataSource
      .assingTagsToProposal(args.proposalPk, args.tagIds)
      .catch((error) => {
        return rejection(
          'Could not assign tag/s to proposal',
          { agent, args },
          error
        );
      });
  }

  @Authorized([Roles.USER_OFFICER])
  async removeTagsFromProposal(
    agent: UserWithRole | null,
    args: RemoveTagsFromProposalArgs
  ): Promise<boolean | Rejection> {
    return this.dataSource
      .removeTagsFromProposal(args.proposalPk, args.tagIds)
      .catch((error) => {
        return rejection(
          'Could not remove assigned tag/s from proposal',
          { agent, args },
          error
        );
      });
  }
}
