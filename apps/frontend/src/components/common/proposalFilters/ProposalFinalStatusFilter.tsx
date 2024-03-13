import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import makeStyles from '@mui/styles/makeStyles';
import React, { Dispatch } from 'react';
import { useQueryParams, StringParam } from 'use-query-params';

import { ProposalEndStatus } from 'generated/sdk';
import { Option } from 'utils/utilTypes';

const useStyles = makeStyles(() => ({
  loadingText: {
    minHeight: '32px',
    marginTop: '16px',
  },
}));

type ProposalFinalStatusFilterProps = {
  proposalFinalStatuses?: ProposalEndStatus[];
  onChange?: Dispatch<string | null>;
  shouldShowAll?: boolean;
  proposalFinalStatus?: string;
};

const ProposalFinalStatusFilter = ({
  proposalFinalStatuses,
  proposalFinalStatus,
  onChange,
  shouldShowAll,
}: ProposalFinalStatusFilterProps) => {
  const [, setQuery] = useQueryParams({
    proposalFinalStatus: StringParam,
  });

  if (proposalFinalStatuses === undefined) {
    return null;
  }

  const finalStatusOptions: Option[] = proposalFinalStatuses.map((key) => ({
    value: key,
    text: key,
  }));

  /**
   * NOTE: We might use https://material-ui.com/components/autocomplete/.
   * If we have lot of dropdown options to be able to search.
   */
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="proposal-status-select-label" shrink>
          Final status
        </InputLabel>
        <Select
          id="proposal-status-select"
          aria-labelledby="proposal-status-select-label"
          onChange={(proposalFinalStatus) => {
            setQuery({
              proposalFinalStatus: proposalFinalStatus.target.value
                ? (proposalFinalStatus.target.value as string)
                : undefined,
            });

            onChange?.(
              proposalFinalStatus.target.value
                ? (proposalFinalStatus.target.value as string)
                : null
            );
          }}
          value={proposalFinalStatus || 0}
          defaultValue={0}
          data-cy="status-filter"
        >
          {shouldShowAll && <MenuItem value={0}>All</MenuItem>}
          {finalStatusOptions.map(({ value, text }) => (
            <MenuItem value={value} key={value}>
              {text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

// ProposalFinalStatusFilter.propTypes = {
//   proposalStatuses: PropTypes.array,
//   isLoading: PropTypes.bool,
//   onChange: PropTypes.func,
//   shouldShowAll: PropTypes.bool,
//   proposalStatusId: PropTypes.number,
// };

export default ProposalFinalStatusFilter;
