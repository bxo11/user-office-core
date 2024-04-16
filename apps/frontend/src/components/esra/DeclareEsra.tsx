import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { Select } from 'formik-mui';
import React from 'react';
import { Prompt } from 'react-router';

import Editor from 'components/common/TinyEditor';
import { useSafetyManagementIdData } from 'hooks/safetyManagement/useSafetyManagementIdData';
import { StyledButtonContainer } from 'styles/StyledComponents';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';
import withConfirm from 'utils/withConfirm';

type DeclareEsraProps = {
  proposalPk: number;
};

function DeclareEsra({ proposalPk }: DeclareEsraProps) {
  const { api } = useDataApiWithFeedback();
  const { safetyManagementId } = useSafetyManagementIdData(proposalPk);

  const PromptIfDirty = () => {
    const formik = useFormikContext();

    return (
      <Prompt
        when={formik.dirty && formik.submitCount === 0}
        message="Changes you recently made in this tab will be lost! Are you sure?"
      />
    );
  };

  const initialValues = {
    hazardousEquipment: false,
    ownEquipment: false,
    ownEquipmentNotes: '',
    nanoSamplesDeclaration: false,
    samplesDeclaration: false,
    classedAsCmrCompound: false,
    biologicalSamplesDeclaration: false,
    samplesRemoval: '',
    labAccess: '',
  };

  const handleEsraRequest = async (values: any): Promise<void> => {
    if (safetyManagementId) {
      await api({
        toastSuccessMessage: 'Esra requested successfully!',
      }).requestEsra({ safetyManagementId, esraForm: values });
    }
  };

  return safetyManagementId ? (
    <>
      <Typography variant="h6" component="h2" sx={{ marginBottom: 3 }}>
        Declare ESRA
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values): Promise<void> => {
          handleEsraRequest(values);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <PromptIfDirty />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" sx={{ marginTop: 3 }}>
                  Experiment Equipment
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="hazardousEquipment"
                      name="hazardousEquipment"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.hazardousEquipment}
                      onChange={() => {
                        setFieldValue(
                          'hazardousEquipment',
                          !values.hazardousEquipment
                        );
                      }}
                    />
                  }
                  label="The experiment will involve the use of hazardous equipment at MAX IV"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="ownEquipment"
                      name="ownEquipment"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.ownEquipment}
                      onChange={() => {
                        setFieldValue('ownEquipment', !values.ownEquipment);
                      }}
                    />
                  }
                  label="The experiment involves bringing our own equipment to MAX IV"
                />
                {values.ownEquipment && (
                  <>
                    <InputLabel htmlFor="notes" shrink margin="dense">
                      Equipment description
                    </InputLabel>
                    <Editor
                      id="ownEquipmentNotes"
                      disabled={isSubmitting}
                      initialValue={initialValues.ownEquipmentNotes}
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
                          setFieldValue('ownEquipmentNotes', content);
                        }
                      }}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" sx={{ marginTop: 3 }}>
                  Experiment Samples
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="nanoSamplesDeclaration"
                      name="nanoSamplesDeclaration"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.nanoSamplesDeclaration}
                      onChange={() => {
                        setFieldValue(
                          'nanoSamplesDeclaration',
                          !values.nanoSamplesDeclaration
                        );
                      }}
                    />
                  }
                  label="
                  Declaration of Nanomaterials amd NanoProducts (NPMs), Nano-sized Samples, 1-100 nm"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="samplesDeclaration"
                      name="samplesDeclaration"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.samplesDeclaration}
                      onChange={() => {
                        setFieldValue(
                          'samplesDeclaration',
                          !values.samplesDeclaration
                        );
                      }}
                    />
                  }
                  label="Declaration of Samples, Chemicals, Gases, Radioactive Materials"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="classedAsCmrCompound"
                      name="classedAsCmrCompound"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.classedAsCmrCompound}
                      onChange={() => {
                        setFieldValue(
                          'classedAsCmrCompound',
                          !values.classedAsCmrCompound
                        );
                      }}
                    />
                  }
                  label="One or several of the substrates or chemicals are classed as CMR coumpound (Check the following H-phrases: H340x 350x or 360x)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Field
                      id="biologicalSamplesDeclaration"
                      name="biologicalSamplesDeclaration"
                      component={Checkbox}
                      type="checkbox"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={values.biologicalSamplesDeclaration}
                      onChange={() => {
                        setFieldValue(
                          'biologicalSamplesDeclaration',
                          !values.biologicalSamplesDeclaration
                        );
                      }}
                    />
                  }
                  label="Declaration of Biological Samples"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" sx={{ marginTop: 3 }}>
                  Samples Removal
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="samplesRemoval"
                    shrink={!!values.samplesRemoval}
                    required
                  >
                    Samples will be removed by
                  </InputLabel>
                  <Field
                    name="samplesRemoval"
                    component={Select}
                    disabled={isSubmitting}
                    required
                  >
                    <MenuItem value={'maxiv'} key={1}>
                      MAX IV
                    </MenuItem>
                    <MenuItem value={'user'} key={2}>
                      The user
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" sx={{ marginTop: 3 }}>
                  Lab Access
                </Typography>
              </Grid>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="labAccess"
                    shrink={!!values.labAccess}
                    required
                  >
                    I will require access to a Chemical or Biology laboratory
                  </InputLabel>
                  <Field
                    name="labAccess"
                    component={Select}
                    disabled={isSubmitting}
                    required
                  >
                    <MenuItem value={'no'} key={1}>
                      No
                    </MenuItem>
                    <MenuItem value={'yes'} key={2}>
                      Yes
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ '& button': { m: 1 } }}>
                  <StyledButtonContainer>
                    <Button type="submit" disabled={isSubmitting}>
                      Request ESRA
                    </Button>
                  </StyledButtonContainer>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  ) : (
    <Typography variant="h6" component="h2" sx={{ marginBottom: 3 }}>
      Safety management is not available for this proposal
    </Typography>
  );
}

export default withConfirm(DeclareEsra);
