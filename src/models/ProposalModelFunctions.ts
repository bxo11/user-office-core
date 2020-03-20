import {
  TextInputConfig,
  SelectionFromOptionsConfig,
} from '../resolvers/types/FieldConfig';
import JSDict from '../utils/Dictionary';
import { ConditionEvaluator } from './ConditionEvaluator';
import {
  ProposalTemplateField,
  QuestionaryField,
  ProposalTemplate,
  Questionary,
  DataType,
  DataTypeSpec,
  FieldDependency,
} from './ProposalModel';
type AbstractField = ProposalTemplateField | QuestionaryField;
type AbstractCollection = ProposalTemplate | Questionary;
export function getDataTypeSpec(type: DataType): DataTypeSpec {
  switch (type) {
    case DataType.EMBELLISHMENT:
      return { readonly: true };
    default:
      return { readonly: false };
  }
}
export function getTopicById(collection: AbstractCollection, topicId: number) {
  const step = collection.steps.find(step => step.topic.topic_id === topicId);

  return step ? step.topic : undefined;
}
export function getQuestionaryStepByTopicId(
  template: AbstractCollection,
  topicId: number
) {
  return template.steps.find(step => step.topic.topic_id === topicId);
}
export function getFieldById(
  collection: AbstractCollection,
  questionId: string
) {
  let needle: AbstractField | undefined;
  collection.steps.every(step => {
    needle = step.fields.find(
      field => field.proposal_question_id === questionId
    );

    return needle === undefined;
  });

  return needle;
}
export function getAllFields(collection: AbstractCollection) {
  let allFields = new Array<AbstractField>();
  collection.steps.forEach(step => {
    allFields = allFields.concat(step.fields);
  });

  return allFields;
}
export function isDependencySatisfied(
  collection: Questionary,
  dependency: FieldDependency
): boolean {
  //const { condition, params } = dependency.condition;
  const { condition, params } = dependency.condition;
  const field = getFieldById(collection, dependency.dependency_id) as
    | QuestionaryField
    | undefined;
  if (!field) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const isParentSattisfied = areDependenciesSatisfied(
    collection,
    dependency.dependency_id
  );

  return (
    isParentSattisfied &&
    new ConditionEvaluator()
      .getConditionEvaluator(condition)
      .isSatisfied(field, params)
  );
}
export function areDependenciesSatisfied(
  questionary: Questionary,
  fieldId: string
) {
  const field = getFieldById(questionary, fieldId);
  if (!field) {
    return true;
  }
  const isAtLeastOneDissasisfied = field.dependencies?.some(dep => {
    const result = isDependencySatisfied(questionary, dep) === false;

    return result;
  });

  return isAtLeastOneDissasisfied === false;
}

class BaseValidator implements ConstraintValidator {
  constructor(private dataType?: DataType | undefined) {}

  validate(value: any, field: QuestionaryField) {
    if (this.dataType && field.data_type !== this.dataType) {
      throw new Error('Field validator ');
    }
    if (field.config.required && !value) {
      return false;
    }

    return true;
  }
}

class TextInputValidator extends BaseValidator {
  constructor() {
    super(DataType.TEXT_INPUT);
  }
  validate(value: any, field: QuestionaryField) {
    if (!super.validate(value, field)) {
      return false;
    }
    const config = field.config as TextInputConfig;
    if (config.min && value && value.length < config.min) {
      return false;
    }
    if (config.max && value && value.length > config.max) {
      return false;
    }

    return true;
  }
}

class SelectFromOptionsInputValidator extends BaseValidator {
  constructor() {
    super(DataType.SELECTION_FROM_OPTIONS);
  }
  validate(value: any, field: QuestionaryField) {
    const config = field.config as SelectionFromOptionsConfig;
    if (!super.validate(value, field)) {
      return false;
    }

    if (config.required && config.options!.indexOf(value) === -1) {
      return false;
    }

    return true;
  }
}

const validatorMap = JSDict.Create<DataType, ConstraintValidator>();
validatorMap.put(DataType.TEXT_INPUT, new TextInputValidator());
validatorMap.put(
  DataType.SELECTION_FROM_OPTIONS,
  new SelectFromOptionsInputValidator()
);

export function isMatchingConstraints(
  value: any,
  field: ProposalTemplateField
): boolean {
  const val = JSON.parse(value).value;
  const validator = validatorMap.get(field.data_type) || new BaseValidator();

  return validator.validate(val, field);
}

interface ConstraintValidator {
  validate(value: any, field: ProposalTemplateField): boolean;
}
