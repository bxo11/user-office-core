import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { Dispatch } from 'react';
import {
  useQueryParams,
  NumericArrayParam,
  DelimitedNumericArrayParam,
} from 'use-query-params';

import { Tag } from 'generated/sdk';
import { Option } from 'utils/utilTypes';
import { Autocomplete, TextField } from '@mui/material';

type ProposalTagsFilterProps = {
  proposalTags?: Tag[];
  onChange?: Dispatch<number[] | null>;
  selectedProposalTags?: number[] | null;
};

const ProposalTagsFilter = ({
  proposalTags,
  selectedProposalTags,
  onChange,
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
  }));

  /**
   * NOTE: We might use https://material-ui.com/components/autocomplete/.
   * If we have lot of dropdown options to be able to search.
   */
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="proposal-tag-select-label" shrink>
          Tags
        </InputLabel>
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
          options={finalStatusOptions}
          data-cy="tag-filter"
          multiple
        >
          {/* {finalStatusOptions.map(({ value, text }) => (
            <MenuItem value={value} key={value}>
              {text}
            </MenuItem>
          ))} */}
        </Autocomplete>
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
