import { Query, Arg, Ctx, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { Tag } from '../types/Tag';

@Resolver()
export class TagQuery {
  @Query(() => [Tag])
  tags(
    @Arg('category', () => String) category: string,
    @Ctx() context: ResolverContext
  ) {
    return context.queries.tag.getTagsForCategory(context.user, category);
  }
}
