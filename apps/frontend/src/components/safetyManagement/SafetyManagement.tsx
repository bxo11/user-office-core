import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from '@mui/material';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { Select } from 'formik-mui';
import React from 'react';
import { Prompt } from 'react-router';

import FormikUIAutocomplete from 'components/common/FormikUIAutocomplete';
import Editor from 'components/common/TinyEditor';
import { Tag, TechnicalReviewStatus } from 'generated/sdk';
import { useTagsData } from 'hooks/tag/useTagsData';
import { StyledButtonContainer } from 'styles/StyledComponents';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';
import { Option } from 'utils/utilTypes';

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
    status: '',
    notes: '',
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

  const statusOptions: Option[] = [
    { text: 'Feasible', value: TechnicalReviewStatus.FEASIBLE },
    {
      text: 'Partially feasible',
      value: TechnicalReviewStatus.PARTIALLY_FEASIBLE,
    },
    {
      text: 'Unfeasible',
      value: TechnicalReviewStatus.UNFEASIBLE,
    },
  ];

  return (
    <div data-cy="safety-management-tab">
      <Typography variant="h6" component="h2" gutterBottom>
        Safety management
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values): Promise<void> => {
          await api({
            toastSuccessMessage: 'Saved tags!',
          }).updateProposalTags({
            proposalPk,
            tagIds: values.proposalTags,
          });
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <PromptIfDirty />
            <Grid container spacing={2}>
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
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="status"
                    shrink={!!values.status}
                    required
                  >
                    Status
                  </InputLabel>
                  <Field
                    name="status"
                    type="text"
                    component={Select}
                    data-cy="technical-review-status"
                    MenuProps={{ 'data-cy': 'technical-review-status-options' }}
                    required
                  >
                    {statusOptions.map(({ value, text }) => (
                      <MenuItem value={value} key={value}>
                        {text}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="publicComment" shrink margin="dense">
                  Notes
                </InputLabel>
                <Editor
                  id="notes"
                  initialValue={initialValues.notes}
                  init={{
                    skin: false,
                    content_css: false,
                    plugins: [
                      'link',
                      'preview',
                      'code',
                      'charmap',
                      'wordcount',
                    ],
                    toolbar: 'bold italic',
                    branding: false,
                  }}
                  onEditorChange={(content, editor) => {
                    const isStartContentDifferentThanCurrent =
                      editor.startContent !==
                      editor.contentDocument.body.innerHTML;

                    if (
                      isStartContentDifferentThanCurrent ||
                      editor.isDirty()
                    ) {
                      setFieldValue('publicComment', content);
                    }
                  }}
                />
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
