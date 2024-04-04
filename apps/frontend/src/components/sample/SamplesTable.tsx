import MaterialTable, {
  MaterialTableProps,
  Column,
} from '@material-table/core';
import { Typography } from '@mui/material';
import React from 'react';
import { DecodedValueMap, SetQuery, QueryParamConfig } from 'use-query-params';

import { SampleWithProposalData } from 'models/questionary/sample/SampleWithProposalData';
import { tableIcons } from 'utils/materialIcons';

import { SamplesByCallIdArgs } from './SampleSafetyPage';

const defaultColumns: Column<SampleWithProposalData>[] = [
  { title: 'Title', field: 'title' },
  { title: 'Status', field: 'safetyStatus' },
  { title: 'Created', field: 'created' },
];

type SamplesTableQueryParamsType = {
  call: QueryParamConfig<number | null | undefined>;
  search: QueryParamConfig<string | null | undefined>;
};

const SamplesTable = (
  props: Omit<MaterialTableProps<SampleWithProposalData>, 'columns'> & {
    urlQueryParams: DecodedValueMap<SamplesTableQueryParamsType>;
    setUrlQueryParams: SetQuery<SamplesTableQueryParamsType>;
    setSampleQueryParams: React.Dispatch<
      React.SetStateAction<SamplesByCallIdArgs>
    >;
    columns?: Column<SampleWithProposalData>[];
  }
) => (
  <div data-cy="samples-table">
    <MaterialTable
      columns={props.columns ? props.columns : defaultColumns}
      icons={tableIcons}
      title={
        <Typography variant="h6" component="h2">
          Samples
        </Typography>
      }
      onSearchChange={(searchText) => {
        props.setUrlQueryParams({
          search: searchText ? searchText : undefined,
        });
        props.setSampleQueryParams((prev) => ({
          ...prev,
          title: searchText ? searchText : undefined,
        }));
      }}
      onPageChange={(page, pageSize) => {
        props.setSampleQueryParams((prev) => ({
          ...prev,
          offset: page * pageSize,
        }));
      }}
      onRowsPerPageChange={(pageSize) => {
        props.setSampleQueryParams((prev) => ({
          ...prev,
          first: pageSize,
          offset: 0,
        }));
      }}
      options={{
        ...props.options,
        searchText: props.urlQueryParams.search || undefined,
      }}
      {...props}
    />
  </div>
);

export default React.memo(
  SamplesTable,
  (prevProps, nextProps) =>
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.data === nextProps.data
);
