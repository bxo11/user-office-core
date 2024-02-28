import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import React, { Dispatch } from 'react';
import { useQueryParams, DelimitedNumericArrayParam } from 'use-query-params';

import { Tag } from 'generated/sdk';

type ProposalTagsFilterProps = {
  proposalTags?: Tag[];
  onChange?: Dispatch<number[] | null>;
  selectedProposalTagIds?: number[];
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
  }));

  return (
    <>
      <FormControl fullWidth>
        <Autocomplete
          id="proposal-tag-select"
          // aria-labelledby="proposal-tag-select-label"
          onChange={(_event, newValue) => {
            console.log('newValue', selectedProposalTagIds);
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
