import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import LandingPage from './Views/LandingPage';
import EmployerDashboard from './Views/EmployerDashboard.jsx';
import './App.css';
import TopBar from './Containers/TopBar';
import CandidateDashboard from './Views/CandidateDashboard';
import PostingDetailsView from './Views/PostingDetailsView.jsx';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path='/' component={LandingPage} />
        <Route path='/employer/dashboard' component={EmployerDashboard} />
        <Route path='/candidate' component={TopBar} />
        <Route path='/candidate/dashboard' component={CandidateDashboard} />
        <Route path='/candidate/postings/' component={PostingDetailsView} />
          
      </React.Fragment>
    );
  }
}

export default App;