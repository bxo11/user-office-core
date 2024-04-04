import {
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { SampleStatus } from '../../models/Sample';
import { Sample } from '../types/Sample';

@InputType()
class SamplesFilter {
  @Field(() => String, { nullable: true })
  public title?: string;

  @Field(() => Int, { nullable: true })
  public creatorId?: number;

  @Field(() => [Int], { nullable: true })
  public questionaryIds?: number[];

  @Field(() => [Int], { nullable: true })
  public sampleIds?: number[];

  @Field(() => SampleStatus, { nullable: true })
  public status?: SampleStatus;

  @Field(() => String, { nullable: true })
  public questionId?: string;

  @Field(() => Int, { nullable: true })
  public proposalPk?: number;

  @Field(() => Int, { nullable: true })
  public visitId?: number;
}

@ArgsType()
export class SamplesArgs {
  @Field(() => SamplesFilter, { nullable: true })
  public filter?: SamplesFilter;

  @Field(() => Int, { nullable: true })
  public first?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;
}

@ObjectType()
export class SamplesQueryResult {
  @Field(() => Int)
  public totalCount: number;

  @Field(() => [Sample])
  public samples: Sample[];
}

@Resolver()
export class SamplesQuery {
  @Query(() => [Sample], { nullable: true })
  async samples(@Ctx() context: ResolverContext, @Args() args: SamplesArgs) {
    const samples = await context.queries.sample.getSamples(context.user, args);

    return samples;
  }

  @Query(() => SamplesQueryResult, { nullable: true })
  async samplesWithTotalCount(
    @Ctx() context: ResolverContext,
    @Args() args: SamplesArgs
  ) {
    const response = await context.queries.sample.getSamplesWithTotalCount(
      context.user,
      args
    );

    return response;
  }
}
