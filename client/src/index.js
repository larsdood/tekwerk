import React from 'react';
import { createBrowserHistory } from 'history'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import jwtDecode from 'jwt-decode';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import firstEpics from './State/epics';
import { ConnectedRouter } from 'connected-react-router'
import { routeToMiddleware } from './State/routeToMiddleware';
import { authReducer } from './State/authReducer';
import { requestsReducer } from './State/requestsReducer';
import { employerReducer } from './State/employerReducer';

const storedToken = !!localStorage && localStorage.getItem('auth-token');

const INITIAL_STATE = { auth: { token: storedToken, ...jwtDecode(storedToken) }};

const ROOT_REDUCER = combineReducers({ auth: authReducer, requests: requestsReducer, employerData: employerReducer});

const history = createBrowserHistory()
const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(connectRouter(history)(ROOT_REDUCER),
  INITIAL_STATE,
  composeEnhancers(applyMiddleware(
    routerMiddleware(history),
    routeToMiddleware,
    epicMiddleware,
  )));

firstEpics.forEach(epic => epicMiddleware.run(epic));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, document.getElementById('root'));
