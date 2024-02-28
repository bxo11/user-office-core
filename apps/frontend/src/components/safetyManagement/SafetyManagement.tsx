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
import UOLoader from 'components/common/UOLoader';
import { Tag, UserRole } from 'generated/sdk';
import { useSafetyManagementData } from 'hooks/safetyManagement/useSafetyManagementData';
import { useTagsData } from 'hooks/tag/useTagsData';
import { useUsersData } from 'hooks/user/useUsersData';
import { StyledButtonContainer } from 'styles/StyledComponents';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';
import { Option } from 'utils/utilTypes';

type SafetyManagementProps = {
  proposalPk: number;
};

const SafetyManagement = ({ proposalPk }: SafetyManagementProps) => {
  const { api } = useDataApiWithFeedback();
  const { tags, loadingTags } = useTagsData({ category: 'PROPOSAL' });
  const { safetyManagement, loadingSafetyManagement } = useSafetyManagementData(
    {
      proposalPk,
    }
  );
  const { usersData, loadingUsersData } = useUsersData({
    userRole: UserRole.INSTRUMENT_SCIENTIST,
  });

  if (loadingSafetyManagement) {
    return <UOLoader style={{ marginLeft: '50%', marginTop: '100px' }} />;
  }

  const tagOptions =
    tags?.map((tag) => ({
      text: tag.tag,
      value: tag.id,
    })) || [];

  const initialValues = {
    proposalTags: safetyManagement?.tags?.map((tag) => tag.id) || [],
    safetyLevel: safetyManagement?.safetyLevel || '',
    notes: safetyManagement?.notes || '',
    responsibleUsers:
      safetyManagement?.responsibleUsers.map((user) => user.id) || [],
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

  const safetyLevelOptions: Option[] = [
    { text: 'Green', value: 1 },
    {
      text: 'Yellow',
      value: 2,
    },
    {
      text: 'Red',
      value: 3,
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
          if (safetyManagement) {
            await api({
              toastSuccessMessage: 'Saved safety management decision!',
            }).updateProposalSafetyManagement({
              safetyManagementId: safetyManagement.id,
              safetyLevel: Number(values.safetyLevel),
              notes: values.notes,
              tagIds: values.proposalTags,
              responsibleUserIds: values.responsibleUsers,
            });
          } else {
            await api({
              toastSuccessMessage: 'Saved safety management decision!',
            }).createProposalSafetyManagement({
              proposalPk,
              safetyLevel: Number(values.safetyLevel),
              notes: values.notes,
              tagIds: values.proposalTags,
              responsibleUserIds: values.responsibleUsers,
            });
          }
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
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="safetyLevel"
                    shrink={!!values.safetyLevel}
                    required
                  >
                    Status
                  </InputLabel>
                  <Field
                    name="safetyLevel"
                    component={Select}
                    disabled={isSubmitting}
                    data-cy="safety-level"
                    MenuProps={{ 'data-cy': 'safety-level-options' }}
                    required
                  >
                    {safetyLevelOptions.map(({ value, text }) => (
                      <MenuItem value={value} key={value}>
                        {text}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormikUIAutocomplete
                  name="responsibleUsers"
                  label="Responsible users"
                  loading={loadingUsersData}
                  noOptionsText="No users"
                  data-cy="responsible-users"
                  items={usersData.users.map((user) => ({
                    text: user.firstname + ' ' + user.lastname,
                    value: user.id,
                  }))}
                  multiple
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="notes" shrink margin="dense">
                  Notes
                </InputLabel>
                <Editor
                  id="notes"
                  disabled={isSubmitting}
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
                      setFieldValue('notes', content);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButtonContainer>
                  <Button
                    type="submit"
                    data-cy="save-safety-management-decision"
                    disabled={isSubmitting}
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
