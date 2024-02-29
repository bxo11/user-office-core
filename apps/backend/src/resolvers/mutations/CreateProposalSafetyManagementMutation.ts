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

  @Field(() => [Int], { nullable: true })
  public tagIds?: number[];

  @Field(() => [Int], { nullable: true })
  public responsibleUserIds?: number[];

  @Field(() => String, { nullable: true })
  public status?: string;

  @Field(() => String, { nullable: true })
  public statusComment?: string;
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
