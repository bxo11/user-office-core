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
export class RequestEsraArgs {
  @Field(() => Int)
  public safetyManagementId: number;
}

@Resolver()
export class RequestEsraMutation {
  @Mutation(() => SafetyManagement)
  async requestEsra(
    @Args() args: RequestEsraArgs,
    @Ctx() context: ResolverContext
  ) {
    return context.mutations.safetyManagement.requestEsra(context.user, args);
  }
}
