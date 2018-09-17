import { createAll } from './asyncActionCreator';

// queries
// no auth
export const queryEmployers = createAll('QUERY_EMPLOYERS');
export const queryPublicPostings = createAll('QUERY_PUBLIC_POSTINGS');
export const queryPostingDetails = createAll('QUERY_POSTING_DETAILS', { request: ['id']});

// auth required
export const queryPostings = createAll('QUERY_POSTINGS');

// mutations
export const login = createAll('LOGIN', { request: ['email', 'password'], success: ['token']})
export const signupEmployer = createAll('SIGNUP_EMPLOYER',
{
  request: {
    objectParams: true,
    params: [
      'companyName',
      'contactEmail',
      'adminFirstName',
      'adminLastName',
      'adminEmail',
      'adminPassword',
      
      //optional
      'adminMiddleNames',
    ]
  }});
export const signupCandidate = createAll('SIGNUP_CANDIDATE',
{ request: ['firstName', 'middleNames', 'lastName', 'email', 'password']});
export const newPosting = createAll(
  'NEW_POSTING',
  { request: ['postingTitle', 'positionTitle', 'employmentType', 'description', 'requirements', 'customId', 'expiresAt'] });
export const releasePosting = createAll(
  'RELEASE_POSTING',
  { request: ['customId']});
export const logout = createAll('LOGOUT');


export const ROUTE_TO = 'ROUTE_TO';
export const routeTo = route => ({type: ROUTE_TO, route});
