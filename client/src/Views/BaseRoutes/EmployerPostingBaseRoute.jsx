import React from 'react';
import { Route } from 'react-router-dom';
import { Responsive, Grid } from 'semantic-ui-react';
import EmployerPostingCard from '../../Components/EmployerPostingCard';
import NewPostingModal from '../../Containers/NewPostingModal';
import EmployerPostingsView from '../Employer/EmployerPostingsView';
import EmployerPostingDetailsView from '../Employer/EmployerPostingDetailsView';
import EmployerPostingContextBar from '../ContextBars/EmployerPostingContextBar';

const EmployerPostingBaseRoute = () => 
  <Grid>
      <Grid.Column computer='1' />
    <Grid.Column phone='16' tablet='5' computer='4' >
      <EmployerPostingContextBar/>
    </Grid.Column>
    <Grid.Column phone='16' tablet='9' computer='10'>
      <Route exact path='/employer/postings' component={EmployerPostingsView} />
      <Route path='/employer/postings/**/:topicId' component={EmployerPostingDetailsView} />
    </Grid.Column>
    <Grid.Column computer='1' />
  </Grid>

export default EmployerPostingBaseRoute;