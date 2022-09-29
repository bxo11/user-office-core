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
import { SuccessResponseWrap, SEPResponseWrap } from '../types/CommonWrappers';
import { wrapResponse } from '../wrapResponse';
import { ProposalPkWithCallId } from './ChangeProposalsStatusMutation';

@ArgsType()
export class AssignProposalsToSepArgs {
  @Field(() => [ProposalPkWithCallId])
  public proposals: ProposalPkWithCallId[];

  @Field(() => Int)
  public sepId: number;
}

@ArgsType()
export class RemoveProposalsFromSepArgs {
  @Field(() => [Int])
  public proposalPks: number[];

  @Field(() => Int)
  public sepId: number;
}

@Resolver()
export class AssignProposalsToSEPMutation {
  @Mutation(() => SuccessResponseWrap)
  async assignProposalsToSep(
    @Args() args: AssignProposalsToSepArgs,
    @Ctx() context: ResolverContext
  ) {
    return wrapResponse(
      context.mutations.sep.assignProposalsToSep(context.user, args),
      SuccessResponseWrap
    );
  }

  @Mutation(() => SEPResponseWrap)
  async removeProposalsFromSep(
    @Args() args: RemoveProposalsFromSepArgs,
    @Ctx() context: ResolverContext
  ) {
    return wrapResponse(
      context.mutations.sep.removeProposalsFromSep(context.user, args),
      SEPResponseWrap
    );
  }
}
