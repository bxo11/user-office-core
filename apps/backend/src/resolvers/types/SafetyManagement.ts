import { ObjectType, Field, Int, Directive } from 'type-graphql';

import { SafetyManagement as SafetyManagementOrigin } from '../../models/SafetyManagement';

@ObjectType()
@Directive('@key(fields: "id")')
export class SafetyManagement implements Partial<SafetyManagementOrigin> {
  @Field(() => Int)
  public id: number;

  @Field(() => Int)
  public proposalPk: number;

  @Field(() => Int)
  public safetyLevel: number;

  @Field(() => String, { nullable: true })
  public notes?: string;
}
