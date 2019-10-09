import { useEffect, useState } from "react";
import { useDataAPI } from "./useDataAPI";
import { ProposalTemplate } from "../model/ProposalModel";

export function useProposalQuestionTemplate() {
  const sendRequest = useDataAPI();
  const [proposalTemplate, setProposalTemplate] = useState<ProposalTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProposalTemplateRequest = () => {
      const query = `
            query {
              proposalTemplate {
                topics {
                  topic_title
                  topic_id,
                  fields {
                    proposal_question_id
                    data_type
                    question
                    config
                    dependencies {
                      proposal_question_dependency
                      condition
                      proposal_question_id
                    }
                  }
                }
              }
            }`;

      sendRequest(query).then(data => {
        setLoading(false);
        setProposalTemplate(
          new ProposalTemplate(data.proposalTemplate)
        );
      });
      
    };
    getProposalTemplateRequest();
  }, [sendRequest]); // passing empty array as a second param so that effect is called only once on mount

  return { loading, proposalTemplate };
}
