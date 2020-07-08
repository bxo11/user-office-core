import { useState } from 'react';

import { useDataApi } from 'hooks/useDataApi';
import { prepareAnswers } from 'models/ProposalModelFunctions';
import {
  Event,
  EventType,
  SubquestionarySubmissionModelState,
} from 'models/SubquestionarySubmissionModel';
import { MiddlewareInputParams } from 'utils/useReducerWithMiddleWares';

export function usePersistSubquestionaryModel() {
  const [isSavingModel, setIsSavingModel] = useState<boolean>(false);
  const api = useDataApi();
  const persistModel = ({
    getState,
    dispatch,
  }: MiddlewareInputParams<SubquestionarySubmissionModelState, Event>) => {
    const reducer = (next: Function) => async (action: Event) => {
      next(action);
      const state = getState();
      const questionary = state.questionary;
      switch (action.type) {
        case EventType.SAVE_CLICKED:
          const step = questionary.steps[0];
          setIsSavingModel(true);
          await api().answerTopic({
            questionaryId: questionary.questionaryId as number,
            topicId: step.topic.id,
            answers: prepareAnswers(step.fields),
          });
          setIsSavingModel(false);
          dispatch({ type: EventType.MODEL_SAVED });
          break;
      }
    };

    return reducer;
  };

  return { isSavingModel, persistModel };
}
