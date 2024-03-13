import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import React from 'react';

import { EsraStatus, SafetyManagement } from 'generated/sdk';
import { StyledButtonContainer } from 'styles/StyledComponents';
import useDataApiWithFeedback from 'utils/useDataApiWithFeedback';
import { Option } from 'utils/utilTypes';

type EsraStatusAssigmenttProps = {
  safetyManagement: SafetyManagement | null;
};

const useStyles = makeStyles((theme) => ({
  reassignContainer: {
    padding: theme.spacing(2),
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  reassignContainerDisabled: {
    pointerEvents: 'none',
    opacity: '0.5',
  },
}));

const statusOptions: Option[] = [
  { text: 'ESRA requested', value: EsraStatus.ESRA_REQUESTED },
  {
    text: 'ESRA rejected',
    value: EsraStatus.ESRA_REJECTED,
  },
  {
    text: 'ESRA approved',
    value: EsraStatus.ESRA_APPROVED,
  },
];

const EsraStatusAssigment = ({
  safetyManagement,
}: EsraStatusAssigmenttProps) => {
  const { api } = useDataApiWithFeedback();
  const classes = useStyles();

  const initialValues = {
    esraStatus: safetyManagement?.esraStatus || '',
    statusComment: '',
  };

  return (
    <Paper
      elevation={1}
      className={clsx(
        classes.reassignContainer,
        !safetyManagement && classes.reassignContainerDisabled
      )}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Update ESRA status
      </Typography>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values): Promise<void> => {
          if (safetyManagement) {
            await api({
              toastSuccessMessage: 'Saved safety management decision!',
            }).updateEsraStatus({
              proposalPk: safetyManagement.proposalPk,
              esraStatus: values.esraStatus as EsraStatus,
              statusComment: values.statusComment,
            });
            safetyManagement.esraStatus = values.esraStatus as EsraStatus;
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="esraStatus"
                    shrink={!!values.esraStatus}
                    required
                  >
                    Status
                  </InputLabel>
                  <Field
                    name="esraStatus"
                    component={Select}
                    disabled={isSubmitting}
                    data-cy="esraStatus"
                    required
                  >
                    {statusOptions.map(({ value, text }) => (
                      <MenuItem
                        value={value}
                        key={value}
                        disabled={value === safetyManagement?.esraStatus}
                      >
                        {text}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="statusComment"
                    shrink={!!values.statusComment}
                    required
                  >
                    Status comment
                  </InputLabel>
                  <Field
                    name="statusComment"
                    component={TextField}
                    disabled={isSubmitting}
                    data-cy="statusComment"
                    required
                  ></Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <StyledButtonContainer>
                  <Button
                    type="submit"
                    data-cy="save-safety-management-decision"
                    disabled={
                      isSubmitting ||
                      values.esraStatus === safetyManagement?.esraStatus
                    }
                  >
                    Save
                  </Button>
                </StyledButtonContainer>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default EsraStatusAssigment;
