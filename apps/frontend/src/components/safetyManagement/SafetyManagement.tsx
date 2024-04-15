import {
  Box,
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
import { Prompt, useHistory } from 'react-router';

import FormikUIAutocomplete from 'components/common/FormikUIAutocomplete';
import SuperMaterialTable from 'components/common/SuperMaterialTable';
import Editor from 'components/common/TinyEditor';
import UOLoader from 'components/common/UOLoader';
import { SafetyLevel, UserRole } from 'generated/sdk';
import { useFormattedDateTime } from 'hooks/admin/useFormattedDateTime';
import { useSafetyManagementData } from 'hooks/safetyManagement/useSafetyManagementData';
import { useScheduledEvents } from 'hooks/scheduledEvent/useScheduledEvents';
import { useTagsData } from 'hooks/tag/useTagsData';
import { useUsersData } from 'hooks/user/useUsersData';
import { StyledButtonContainer } from 'styles/StyledComponents';
import { tableIcons } from 'utils/materialIcons';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';
import { Option } from 'utils/utilTypes';

import EsraStatusAssigment from './EsraStatusAssigment';
type SafetyManagementProps = {
  proposalPk: number;
};

const SafetyManagement = ({ proposalPk }: SafetyManagementProps) => {
  const history = useHistory();
  const { api } = useDataApiWithFeedback();
  const { toFormattedDateTime } = useFormattedDateTime({
    shouldUseTimeZone: true,
  });
  const { tags, loadingTags } = useTagsData({ category: 'PROPOSAL' });
  const {
    safetyManagement,
    loadingSafetyManagement,
    setSafetyManagementWithLoading,
  } = useSafetyManagementData({
    proposalPk,
  });
  const { usersData, loadingUsersData } = useUsersData({
    userRole: UserRole.INSTRUMENT_SCIENTIST,
  });

  const { scheduledEvents, setScheduledEvents, loadingEvents } =
    useScheduledEvents({
      filter: { proposalPk: proposalPk },
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
    { text: 'Green', value: SafetyLevel.GREEN },
    {
      text: 'Yellow',
      value: SafetyLevel.YELLOW,
    },
    {
      text: 'Red',
      value: SafetyLevel.RED,
    },
  ];

  const columns = [
    {
      title: 'No.',
      field: 'rowNumber',
    },
    {
      title: 'Experiment start',
      field: 'startsAtFormatted',
    },
    {
      title: 'Experiment end',
      field: 'endsAtFormatted',
    },
  ];

  const scheduledEventsFormatted = scheduledEvents.map((evt, index) => ({
    ...evt,
    startsAtFormatted: toFormattedDateTime(evt.startsAt),
    endsAtFormatted: toFormattedDateTime(evt.endsAt),
    rowNumber: index + 1,
  }));

  return (
    <div data-cy="safety-management-tab">
      <EsraStatusAssigment safetyManagement={safetyManagement} />
      <Typography variant="h6" component="h2" gutterBottom>
        Safety management
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values): Promise<void> => {
          const result = safetyManagement
            ? await api({
                toastSuccessMessage: 'Saved safety management decision!',
              })
                .updateProposalSafetyManagement({
                  safetyManagementId: safetyManagement.id,
                  safetyLevel: values.safetyLevel as SafetyLevel,
                  notes: values.notes,
                  tagIds: values.proposalTags,
                  responsibleUserIds: values.responsibleUsers,
                })
                .then((result) => result.updateProposalSafetyManagement)
            : await api({
                toastSuccessMessage: 'Saved safety management decision!',
              })
                .createProposalSafetyManagement({
                  proposalPk,
                  safetyLevel: values.safetyLevel as SafetyLevel,
                  notes: values.notes,
                  tagIds: values.proposalTags,
                  responsibleUserIds: values.responsibleUsers,
                })
                .then((result) => result.createProposalSafetyManagement);

          setSafetyManagementWithLoading(result);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <PromptIfDirty />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikUIAutocomplete
                  name="proposalTags"
                  label="Proposal tags"
                  loading={loadingTags}
                  noOptionsText="No tags"
                  data-cy="proposal-tags"
                  items={tagOptions}
                  multiple
                  disabled={isSubmitting}
                  InputProps={{ 'data-cy': 'proposal-tags' }}
                  TagColors={tags.reduce(
                    (acc: { [key: number]: string }, tag) => {
                      acc[tag.id] = tag.color;

                      return acc;
                    },
                    {}
                  )}
                />
              </Grid>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="safetyLevel"
                    shrink={!!values.safetyLevel}
                    required
                  >
                    Safety level
                  </InputLabel>
                  <Field
                    name="safetyLevel"
                    component={Select}
                    disabled={isSubmitting}
                    data-cy="safety-level"
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
                <SuperMaterialTable
                  data={scheduledEventsFormatted}
                  setData={setScheduledEvents}
                  icons={tableIcons}
                  title={
                    <Typography variant="h6" component="h2">
                      Proposal experiments
                    </Typography>
                  }
                  columns={columns}
                  isLoading={loadingEvents}
                  options={{
                    search: false,
                    paging: false,
                  }}
                  hasAccess={{
                    create: false,
                    remove: false,
                    update: false,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ '& button': { m: 1 } }}>
                  <StyledButtonContainer>
                    <Button onClick={() => history.push(`/Esra/${proposalPk}`)}>
                      Go to ESRA form
                    </Button>
                    <Button
                      type="submit"
                      data-cy="save-safety-management-decision"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </StyledButtonContainer>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SafetyManagement;
