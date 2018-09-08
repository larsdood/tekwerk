import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LandingPage from './Views/LandingPage';
import EmployerDashboard from './Views/EmployerDashboard.jsx';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path='/' component={LandingPage} />
        <Route path='/employer/dashboard' component={EmployerDashboard} />
      </React.Fragment>
    );
  }
}

export default App;