import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Resolver,
  Int,
  InputType,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { SafetyManagement } from '../types/SafetyManagement';

@InputType()
export class EsraForm {
  @Field(() => Boolean)
  hazardousEquipment: boolean;
  @Field(() => Boolean)
  ownEquipment: boolean;
  @Field(() => String)
  ownEquipmentNotes: string;
  @Field(() => Boolean)
  nanoSamplesDeclaration: boolean;
  @Field(() => Boolean)
  samplesDeclaration: boolean;
  @Field(() => Boolean)
  classedAsCmrCompound: boolean;
  @Field(() => Boolean)
  biologicalSamplesDeclaration: boolean;
  @Field(() => String)
  samplesRemoval: string;
  @Field(() => String)
  labAccess: string;
}

@ArgsType()
export class RequestEsraArgs {
  @Field(() => Int)
  public safetyManagementId: number;

  @Field(() => EsraForm)
  public esraForm: EsraForm;
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
