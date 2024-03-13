import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Resolver,
  Int,
} from 'type-graphql';

import { ResolverContext } from '../../context';

@ArgsType()
export class AssignTagsToProposalArgs {
  @Field(() => Int)
  public proposalPk: number;

  @Field(() => [Int])
  public tagIds: number[];
}

@ArgsType()
export class RemoveTagsFromProposalArgs {
  @Field(() => Int)
  public proposalPk: number;

  @Field(() => [Int])
  public tagIds: number[];
}

@Resolver()
export class AssignTagsToProposalMutation {
  @Mutation(() => Boolean)
  async assignTagsToProposal(
    @Args() args: AssignTagsToProposalArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.tag.assignTagsToProposal(context.user, args);
  }

  @Mutation(() => Boolean)
  async removeTagsFromProposal(
    @Args() args: RemoveTagsFromProposalArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.tag.removeTagsFromProposal(context.user, args);
  }
}
