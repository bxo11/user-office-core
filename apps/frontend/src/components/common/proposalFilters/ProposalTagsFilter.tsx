import { Autocomplete, Box, Chip, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import React, { Dispatch } from 'react';
import { useQueryParams, DelimitedNumericArrayParam } from 'use-query-params';

import { Tag } from 'generated/sdk';

type ProposalTagsFilterProps = {
  proposalTags?: Tag[];
  onChange?: Dispatch<number[] | null>;
  selectedProposalTagIds?: number[] | null;
};

const ProposalTagsFilter = ({
  proposalTags,
  onChange,
  selectedProposalTagIds,
}: ProposalTagsFilterProps) => {
  const [, setQuery] = useQueryParams({
    proposalTagIds: DelimitedNumericArrayParam,
  });

  if (proposalTags === undefined) {
    return null;
  }

  const finalStatusOptions = proposalTags.map((key) => ({
    id: key.id,
    label: key.tag,
    color: key.color,
  }));

  //TODO: refactor colored chips and list items
  const renderTags = (value, getTagProps) =>
    value.map((val, index) => {
      return (
        <Chip
          {...getTagProps({ index })}
          label={val.label}
          sx={{
            backgroundColor: val.color,
            color: 'dark-gray',
            '&:hover': {
              opacity: 0.7,
            },
          }}
        />
      );
    });

  const renderOption = (props: object, option) => {
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
            backgroundColor: option.color,
            marginRight: 1,
          }}
        />
        <Typography variant="body2">{option.label}</Typography>
      </Box>
    );
  };

  return (
    <>
      <FormControl fullWidth>
        <Autocomplete
          id="proposal-tag-select"
          // aria-labelledby="proposal-tag-select-label"
          onChange={(_event, newValue) => {
            const tags = newValue.map((tag) => tag.id);
            const show = tags.length > 0;
            setQuery({
              proposalTagIds: show ? tags : undefined,
            });
            onChange?.(tags);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Tags" margin="none" />
          )}
          renderTags={renderTags}
          renderOption={renderOption}
          options={finalStatusOptions}
          value={finalStatusOptions.filter((tag) =>
            selectedProposalTagIds?.includes(tag.id)
          )}
          data-cy="tag-filter"
          multiple
        />
      </FormControl>
    </>
  );
};

// ProposalTagsFilter.propTypes = {
//   proposalStatuses: PropTypes.array,
//   isLoading: PropTypes.bool,
//   onChange: PropTypes.func,
//   shouldShowAll: PropTypes.bool,
//   proposalStatusId: PropTypes.number,
// };

export default ProposalTagsFilter;
