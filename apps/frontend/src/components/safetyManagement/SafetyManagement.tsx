import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import React from 'react';
import { Prompt } from 'react-router';

import FormikUIAutocomplete from 'components/common/FormikUIAutocomplete';
import { Tag } from 'generated/sdk';
import { useTagsData } from 'hooks/tag/useTagsData';
import { StyledButtonContainer } from 'styles/StyledComponents';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';

type SafetyManagementProps = {
  proposalPk: number;
  proposalTags: Tag[];
};

const SafetyManagement = ({
  proposalPk,
  proposalTags,
}: SafetyManagementProps) => {
  const { api } = useDataApiWithFeedback();
  const { tags, loadingTags } = useTagsData({ category: 'PROPOSAL' });

  const tagOptions =
    tags?.map((tag) => ({
      text: tag.tag,
      value: tag.id,
    })) || [];

  const initialValues = {
    proposalTags: proposalTags.map((tag) => tag.id),
  };

  const PromptIfDirty = () => {
    const formik = useFormikContext();

    return (
      <Prompt
        when={formik.dirty && formik.submitCount === 0}
        message="Changes you recently made in this tab will be lost! Are you sure?"
      />
    );
  };

  return (
    <div data-cy="safety-management-tab">
      <Typography variant="h6" component="h2" gutterBottom>
        Safety management
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values): Promise<void> => {
          const safetyManagementValues = {
            proposalPk: proposalPk,
            propsalTags: values.proposalTags,
          };
          // const initialTagIds = data.proposalTags.map((tag) => tag.id);

          // const tagsToAssing = values.proposalTags
          //   .filter((tagId) => !initialTagIds.includes(tagId))
          //   .map((tagId) => ({
          //     tagId,
          //   }));

          // const tagsToRemove = data.proposalTags
          //   .filter((tag) => !values.proposalTags.includes(tag.id))
          //   .map((tag) => ({
          //     tagId: tag.id,
          //   }));

          // console.log(tagsToAssing);
          // console.log(tagsToRemove);

          await api({
            toastSuccessMessage: 'Saved!',
          }).administrationProposal(safetyManagementValues);
        }}
      >
        {({}) => (
          <Form>
            <PromptIfDirty />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid item xs={6}>
                  <FormikUIAutocomplete
                    name="proposalTags"
                    label="Proposal tags"
                    loading={loadingTags}
                    noOptionsText="No tags"
                    data-cy="proposal-tags"
                    items={tagOptions}
                    multiple
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <StyledButtonContainer>
                  <Button
                    type="submit"
                    data-cy="save-safety-management-decision"
                  >
                    Save
                  </Button>
                </StyledButtonContainer>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SafetyManagement;
