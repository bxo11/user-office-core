import { Field, Int, ObjectType, createUnionType } from "type-graphql";
import { EmailVerificationMutation } from "../../../build/src/resolvers/mutations/EmailVerificationMutation";

// TODO go over and make sure the nullability is correct
@ObjectType()
export class ConfigBase {
  @Field(() => String, { nullable: true })
  small_label?: string;

  @Field(() => Boolean, { nullable: true })
  required?: boolean;

  @Field(() => String, { nullable: true })
  tooltip?: string;
}

@ObjectType()
export class BooleanConfig extends ConfigBase {}

@ObjectType()
export class DateConfig extends ConfigBase {}

@ObjectType()
export class EmbellishmentConfig extends ConfigBase {
  @Field(() => Boolean, { nullable: true })
  omitFromPdf?: boolean;

  @Field(() => String, { nullable: true })
  html?: string;

  @Field(() => String, { nullable: true })
  plain?: string;
}

@ObjectType()
export class FileUploadConfig extends ConfigBase {
  @Field(() => [String], { nullable: true })
  file_type?: string[];

  @Field(() => Int, { nullable: true })
  max_files?: number;
}

@ObjectType()
export class SelectionFromOptionsConfig extends ConfigBase {
  @Field(() => String, { nullable: true })
  variant?: string;

  @Field(() => [String], { nullable: true })
  options?: string[];
}

@ObjectType()
export class TextInputConfig extends ConfigBase {
  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;

  @Field(() => Boolean, { nullable: true })
  multiline?: boolean;

  @Field(() => String, { nullable: true })
  placeholder?: string;
}

export const FieldConfigType = createUnionType({
  name: "FieldConfig", // the name of the GraphQL union
  types: () => [
    BooleanConfig,
    DateConfig,
    EmbellishmentConfig,
    FileUploadConfig,
    SelectionFromOptionsConfig,
    TextInputConfig
  ] // function that returns array of object types classes
});
