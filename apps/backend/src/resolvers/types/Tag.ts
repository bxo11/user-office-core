import { ObjectType, Field, Int, Directive } from 'type-graphql';

import { Tag as TagOrigin } from '../../models/Tag';

@ObjectType()
@Directive('@key(fields: "id")')
export class Tag implements Partial<TagOrigin> {
  @Field(() => Int)
  public id: number;

  @Field()
  public tag: string;

  @Field()
  public category: string;

  @Field()
  public color: string;
}
