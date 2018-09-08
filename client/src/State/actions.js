import { createAll } from './asyncActionCreator';

// queries
export const queryEmployers = createAll('QUERY_EMPLOYERS');
export const queryPostings = createAll('QUERY_POSTINGS', { request: ['count']});

// mutations
export const loginEmployer = createAll('LOGIN_EMPLOYER', { request: ['name', 'password'], success: ['token']})
export const registerEmployer = createAll('REGISTER_EMPLOYER', { request: ['name', 'email', 'password']});
export const newPosting = createAll(
  'NEW_POSTING',
  { request: ['postingTitle', 'positionTitle', 'employmentType', 'description', 'requirements', 'customId', 'expiresAt'] });
export const releasePosting = createAll(
  'RELEASE_POSTING',
  { request: ['customId']});


export const ROUTE_TO = 'ROUTE_TO';
export const routeTo = route => ({type: ROUTE_TO, route});
