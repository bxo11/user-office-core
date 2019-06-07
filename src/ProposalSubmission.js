import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import ProposalInformation from './ProposalInformation';
import ProposalParticipants from './ProposalParticipants';
import ProposalReview from './ProposalReview';
import { request } from 'graphql-request'
import { Link } from "react-router-dom";

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  }
});

const steps = ['Information', 'Participants', 'Review'];

class ProposalSubmission extends React.Component {


  constructor(props) {
    super(props);

    this.state = { 
    proposalData: {},
    proposalID: null,
    stepIndex: 0,
    };
  }



  sendProposalRequest(){
    
    const query = `
    mutation($abstract: String!, $status: Int!, $users: [Int!]) {
      createProposal(abstract: $abstract, status: $status, users: $users){
       proposal{
        id
      }
        error
      }
    }
    `;

    const variables = {
      status: 1,
      abstract: this.state.proposalData.abstract,
      users: this.state.proposalData.users.map((user => user.username)),
    }
      request('/graphql', query, variables).then(data => this.setState({ proposalID: data.createProposal.proposal.id}));
  }
  


onChange(name, value){
  this.setState({...this.state, proposalData: {
    ...this.state.proposalData,
    [name]: value
  }})
}

handleNext(data) {
  this.setState({
    stepIndex: this.state.stepIndex + 1,
    proposalData: {
      ...this.state.proposalData,
      ...data
    }
  })
};

handleBack(){
  this.setState({stepIndex: this.state.stepIndex - 1})
};


getStepContent(step) {
  switch (step) {
    case 0:
      return <ProposalInformation 
                data={this.state.proposalData} 
                onChange={this.onChange.bind(this)}
                next={this.handleNext.bind(this)}
                />;
    case 1:
      return <ProposalParticipants 
                data={this.state.proposalData} 
                onChange={this.onChange.bind(this)}
                next={this.handleNext.bind(this)}
                back={this.handleBack.bind(this)}
              />;
    case 2:
      return <ProposalReview
                data={this.state.proposalData}
                back={this.handleBack.bind(this)}
                submit={this.sendProposalRequest.bind(this)}
            />;
    default:
      throw new Error('Unknown step');
  }
}

render() {
  const {classes} = this.props;
  const activeStep = this.state.stepIndex;

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            <Link to="/">DUO2</Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Proposal Submission
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {this.state.proposalID ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Your proposal has been submitted
                </Typography>
                <Typography variant="subtitle1">
                  Your proposal number is #{this.state.proposalID}. You will recieve an email regarding approval.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.getStepContent(activeStep)}
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}

}

export default withStyles(styles)(ProposalSubmission);