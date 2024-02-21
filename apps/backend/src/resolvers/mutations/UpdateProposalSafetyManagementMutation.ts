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
export class UpdateProposalSafetyManagementArgs {
  @Field(() => Int)
  public safetyManagemntId: number;

  @Field(() => Int, { nullable: true })
  public proposalPk: number;

  @Field(() => Int, { nullable: true })
  public safetyLevel: number;

  @Field(() => String, { nullable: true })
  public notes: string;
}

@Resolver()
export class UpdateProposalSafetyManagementMutation {
  @Mutation(() => SafetyManagement)
  async updateProposalSafetyManagement(
    @Args() args: UpdateProposalSafetyManagementArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.safetyManagement.updateProposalSafetyManagement(
      context.user,
      args
    );
  }
}
