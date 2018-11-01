import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LandingPage from './Views/LandingPage';
import './App.css';
import TopBar from './Containers/TopBar';
import CandidateDashboard from './Views/Candidate/CandidateDashboard';
import CandidatePostingDetailsView from './Views/Candidate/CandidatePostingDetailsView';
import EmployerPostingsView from './Views/Employer/EmployerPostingsView';
import EmployerPostingDetailsView from './Views/Employer/EmployerPostingDetailsView';
import MessagesView from './Views/Shared/MessagesView';
import EmployerPostingBaseRoute from './Views/BaseRoutes/EmployerPostingBaseRoute';
import MessagesBaseRoute from './Views/BaseRoutes/MessagesBaseRoute';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path='/' component={LandingPage} />
        <Route path='/employer' component={TopBar} />
        <Route path='/employer/postings' component={EmployerPostingBaseRoute}>
            <Route exact path='/employer/postings/' component={EmployerPostingsView} />
            <Route path='/employer/postings/:topicId' component={EmployerPostingDetailsView} />
          </Route>
        <Route path='/employer/messages/' component={MessagesBaseRoute} />

        <Route path='/candidate' component={TopBar} />
        <Route path='/candidate/dashboard/' component={CandidateDashboard} />
        <Route path='/candidate/postings/' component={CandidatePostingDetailsView} />
        <Route path='/candidate/messages/' component={MessagesBaseRoute} />
          
      </React.Fragment>
    );
  }
}

export default App;