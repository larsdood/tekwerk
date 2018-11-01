import React from 'react';
import { Route } from 'react-router-dom';
import { Responsive, Grid } from 'semantic-ui-react';
import MessagesView from '../Shared/MessagesView';
import MessagesContextBar from '../ContextBars/MessagesContextBar';

const EmployerMessagesBaseRoute = () =>
  <Grid>
      <Grid.Column tablet='1' computer='1' />
    <Grid.Column phone='16' tablet='5' computer='4' >
      <MessagesContextBar />
    </Grid.Column>
    <Grid.Column phone='16' tablet='9' computer='10'>
      <Route path='/**/messages/' component={MessagesView} />
    </Grid.Column>
      <Grid.Column tablet='1' computer='1' />
  </Grid>

export default EmployerMessagesBaseRoute;