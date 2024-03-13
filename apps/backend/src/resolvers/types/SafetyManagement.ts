import {
  ObjectType,
  Field,
  Int,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Directive,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { isRejection } from '../../models/Rejection';
import {
  EsraStatus,
  SafetyLevel,
  SafetyManagement as SafetyManagementOrigin,
} from '../../models/SafetyManagement';
import { BasicUserDetails } from './BasicUserDetails';
import { Tag } from './Tag';

@ObjectType()
@Directive('@key(fields: "id")')
export class SafetyManagement implements Partial<SafetyManagementOrigin> {
  @Field(() => Int)
  public id: number;

  @Field(() => Int)
  public proposalPk: number;

  @Field(() => EsraStatus, { nullable: true })
  public esraStatus?: EsraStatus;

  @Field(() => SafetyLevel, { nullable: true })
  public safetyLevel?: SafetyLevel;

  @Field(() => String, { nullable: true })
  public notes?: string;
}

@Resolver(() => SafetyManagement)
export class SafetyManagementResolver {
  @FieldResolver(() => [BasicUserDetails])
  async responsibleUsers(
    @Root() safetyManagement: SafetyManagement,
    @Ctx() context: ResolverContext
  ): Promise<BasicUserDetails[] | null> {
    const users =
      context.queries.safetyManagement.dataSource.getResponsibleUsers(
        safetyManagement.id
      );

    return isRejection(users) ? [] : users;
  }

  @FieldResolver(() => [Tag], { nullable: true })
  async tags(
    @Root() safetyManagement: SafetyManagement,
    @Ctx() ctx: ResolverContext
  ): Promise<Tag[] | null> {
    return ctx.queries.tag.getProposalTags(
      ctx.user,
      safetyManagement.proposalPk
    );
  }
}
