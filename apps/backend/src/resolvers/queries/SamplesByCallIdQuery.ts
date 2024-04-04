import { Args, ArgsType, Ctx, Field, Int, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { SamplesQueryResult } from './SamplesQuery';

@ArgsType()
export class SamplesByCallIdArgs {
  @Field(() => Int)
  public callId: number;

  @Field(() => String, { nullable: true })
  public title?: string;

  @Field(() => Int, { nullable: true })
  public first?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;
}

@Resolver()
export class SamplesByCallIdQuery {
  @Query(() => SamplesQueryResult, { nullable: true })
  samplesByCallId(
    @Ctx() context: ResolverContext,
    @Args() args: SamplesByCallIdArgs
  ) {
    return context.queries.sample.getSamplesByCallId(context.user, args);
  }
}
