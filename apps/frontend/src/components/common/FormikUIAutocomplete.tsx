import { Box, Chip, InputAdornment, Typography } from '@mui/material';
import { InputProps } from '@mui/material/Input';
import MuiTextField, {
  TextFieldProps as MUITextFieldProps,
} from '@mui/material/TextField';
import { Field } from 'formik';
import { Autocomplete } from 'formik-mui';
import React, { useState } from 'react';

import { Option } from 'utils/utilTypes';

type FormikUIAutocompleteProps = {
  items: Option[];
  name: string;
  label: string;
  loading?: boolean;
  noOptionsText?: string;
  required?: boolean;
  disabled?: boolean;
  TextFieldProps?: MUITextFieldProps;
  InputProps?: Partial<InputProps> & { 'data-cy': string };
  multiple?: boolean;
  'data-cy'?: string;
  AdornmentIcon?: MUITextFieldProps;
  TagColors?: { [key: number]: string };
};

const FormikUIAutocomplete = ({
  items,
  name,
  label,
  loading = false,
  noOptionsText,
  required,
  disabled,
  InputProps,
  TextFieldProps,
  multiple = false,
  AdornmentIcon,
  TagColors,
  ...props
}: FormikUIAutocompleteProps) => {
  const [adornmentVisible, setAdornmentVisible] = useState(false);
  const options = items.map((item) => item.value);

  //TODO: refactor colored chips and list items
  const renderTags = (value: number[], getTagProps) =>
    value.map((val, index) => {
      const option = items.find((item) => item.value === val);

      const color = TagColors![val];

      return option ? (
        <Chip
          label={option.text}
          {...getTagProps({ index })}
          sx={{
            backgroundColor: color,
            color: 'dark-gray',
            '&:hover': {
              opacity: 0.7,
            },
          }}
        />
      ) : null;
    });

  const renderOption = (props: object, option) => {
    const color = TagColors ? TagColors[option] : 'transparent';
    const optionText = items.find((item) => item.value === option)?.text || '';

    return (
      <Box
        component="li"
        {...props}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: color,
            marginRight: 1,
          }}
        />
        <Typography variant="body2">{optionText}</Typography>
      </Box>
    );
  };

  return (
    <Field
      id={name + '-input'}
      name={name}
      component={Autocomplete}
      loading={loading}
      multiple={multiple}
      options={options}
      noOptionsText={noOptionsText}
      getOptionLabel={(option: number | string) => {
        const foundOption = items.find((item) => item.value === option);

        return foundOption?.text || '';
      }}
      renderTags={multiple && TagColors ? renderTags : undefined}
      renderOption={multiple && TagColors ? renderOption : undefined}
      renderInput={(params: MUITextFieldProps) => (
        <MuiTextField
          {...params}
          {...TextFieldProps}
          label={label}
          required={required}
          disabled={disabled}
          InputProps={{
            ...params.InputProps,
            ...InputProps,
            endAdornment: (
              <InputAdornment position="start">
                {AdornmentIcon && adornmentVisible
                  ? { ...AdornmentIcon }
                  : null}
                {params.InputProps?.endAdornment}
              </InputAdornment>
            ),
          }}
          onFocus={() => {
            setAdornmentVisible(true);
          }}
          onBlur={() => {
            setAdornmentVisible(false);
          }}
        />
      )}
      ListboxProps={{
        'data-cy': props['data-cy'] + '-options',
      }}
      data-cy={props['data-cy']}
    />
  );
};

export default FormikUIAutocomplete;
