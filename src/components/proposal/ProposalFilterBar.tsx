import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { MTableToolbar, Options } from 'material-table';
import React, { Dispatch, SetStateAction } from 'react';

import { ProposalsFilter, Call, Instrument } from 'generated/sdk';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function ProposalFilterBar(props: {
  callsData: Call[];
  instrumentsData: Instrument[];
  data: Options;
  onChange: Dispatch<SetStateAction<ProposalsFilter>>;
  filter: ProposalsFilter;
}) {
  const classes = useStyles();

  return (
    <>
      <MTableToolbar {...props.data} />
      <FormControl className={classes.formControl}>
        <InputLabel>Call</InputLabel>
        <Select
          onChange={call =>
            props.onChange({
              ...props.filter,
              callId: call.target.value as number,
            })
          }
          value={props.filter.callId}
          defaultValue={0}
        >
          <MenuItem value={0}>All</MenuItem>
          {props.callsData.map(call => (
            <MenuItem key={call.id} value={call.id}>
              {call.shortCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Instrument</InputLabel>
        <Select
          onChange={instrument =>
            props.onChange({
              ...props.filter,
              instrumentId: instrument.target.value as number,
            })
          }
          value={props.filter.instrumentId}
          defaultValue={0}
        >
          <MenuItem value={0}>All</MenuItem>
          {props.instrumentsData.map(instrument => (
            <MenuItem
              key={instrument.instrumentId}
              value={instrument.instrumentId}
            >
              {instrument.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
