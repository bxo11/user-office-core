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
import { EsraStatus } from '../../models/SafetyManagement';
import { SafetyManagement } from '../types/SafetyManagement';

@ArgsType()
export class UpdateEsraStatusMutationArgs {
  @Field(() => Int)
  public proposalPk: number;

  @Field(() => EsraStatus)
  public esraStatus: EsraStatus;

  @Field(() => String)
  public statusComment: string;
}

@Resolver()
export class UpdateEsraStatusMutation {
  @Mutation(() => SafetyManagement)
  async updateEsraStatus(
    @Args() args: UpdateEsraStatusMutationArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.safetyManagement.updateEsraStatus(
      context.user,
      args
    );
  }
}
