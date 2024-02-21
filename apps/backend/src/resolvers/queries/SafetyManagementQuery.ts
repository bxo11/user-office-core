import { Query, Arg, Ctx, Resolver, Int } from 'type-graphql';

import { ResolverContext } from '../../context';
import { SafetyManagement } from '../types/SafetyManagement';

@Resolver()
export class SafetyManagementQuery {
  @Query(() => SafetyManagement, { nullable: true })
  proposalSafetyManagement(
    @Arg('proposalPk', () => Int) proposalPk: number,
    @Ctx() context: ResolverContext
  ) {
    return context.queries.safetyManagement.getProposalSafetyManagement(
      context.user,
      proposalPk
    );
  }
}
