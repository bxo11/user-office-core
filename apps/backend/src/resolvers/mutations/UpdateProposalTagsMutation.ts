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
export class UpdateProposalTagsArgs {
  @Field(() => Int)
  public proposalPk: number;

  @Field(() => [Int])
  public tagIds: number[];
}

@Resolver()
export class UpdateProposalTagsMutation {
  @Mutation(() => Boolean)
  async updateProposalTags(
    @Args() args: UpdateProposalTagsArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.tag.updateProposalTags(context.user, args);
  }
}
