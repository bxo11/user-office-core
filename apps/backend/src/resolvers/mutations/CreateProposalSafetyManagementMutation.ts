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
import { SafetyManagement } from '../types/SafetyManagement';

@ArgsType()
export class CreateProposalSafetyManagementArgs {
  @Field(() => Int)
  public proposalPk: number;

  @Field(() => Int)
  public safetyLevel: number;

  @Field(() => String, { nullable: true })
  public notes?: string;
}

@Resolver()
export class CreateProposalSafetyManagementMutation {
  @Mutation(() => SafetyManagement)
  async createProposalSafetyManagement(
    @Args() args: CreateProposalSafetyManagementArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.safetyManagement.createProposalSafetyManagement(
      context.user,
      args
    );
  }
}
