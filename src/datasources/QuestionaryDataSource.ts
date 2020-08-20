/* eslint-disable @typescript-eslint/camelcase */
import {
  AnswerBasic,
  Questionary,
  QuestionaryStep,
} from '../models/Questionary';

export interface QuestionaryDataSource {
  deleteAnswerQuestionaryRelations(answerId: number): Promise<AnswerBasic>;
  createAnswerQuestionaryRelations(
    answerId: number,
    questionaryIds: number[]
  ): Promise<AnswerBasic>;
  getAnswer(answer_id: number): Promise<AnswerBasic>;
  delete(questionary_id: number): Promise<Questionary>;
  getQuestionary(questionary_id: number): Promise<Questionary | null>;
  getQuestionarySteps(questionaryId: number): Promise<QuestionaryStep[]>;
  getBlankQuestionarySteps(template_id: number): Promise<QuestionaryStep[]>;
  getParentQuestionary(
    child_questionary_id: number
  ): Promise<Questionary | null>;
  updateAnswer(
    questionary_id: number,
    question_id: string,
    answer: string
  ): Promise<string>;
  updateTopicCompleteness(
    questionary_id: number,
    topic_id: number,
    isComplete: boolean
  ): Promise<void>;
  create(creator_id: number, template_id: number): Promise<Questionary>;
}
