import { createAll } from './asyncActionCreator';

// queries
// no auth
export const queryEmployers = createAll('QUERY_EMPLOYERS');
export const queryPublicPostings = createAll('QUERY_PUBLIC_POSTINGS');
export const queryPostingDetails = createAll('QUERY_POSTING_DETAILS', { request: ['id']});

// auth required
export const queryInternalPostings = createAll('QUERY_INTERNAL_POSTINGS');
export const queryInternalPostingDetails = createAll('QUERY_INTERNAL_POSTING_DETAILS', { request: ['id']});
export const queryMessageThreads = createAll('QUERY_MESSAGE_THREADS');
export const queryMessagesInThread = createAll('QUERY_MESSAGES_IN_THREAD',
  { request: ['threadId'] }
);

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
export const postMessage = createAll('POST_MESSAGE', 
  { request: ['toId', 'message']});

export const signupCandidate = createAll('SIGNUP_CANDIDATE',
{ request: ['firstName', 'middleNames', 'lastName', 'email', 'password']});

// candidate mutations
export const sendApplication = createAll(
  'SEND_APPLICATION',
  {
    request: [ 'postingId', 'applicationLetter' ],
  }
)


export const newPosting = createAll(
  'NEW_POSTING',
  { request: 
    {
      objectParams: true,
      params: [
        'customId',
        'postingTitle',
        'positionTitle',
        'country',
        'city',
        'employmentType',
        'description',
        'enableSalary',
        'minimumSalary',
        'maximumSalary',
        'currency',
        'workingHoursFrom',
        'workingHoursTo',
        'vacationDays',
        'minimumEducation',
        'minimumExperience',
        'internationalOK',
        'hasRelocationAllowance',
        'requirements',
        'niceToHave',
        'tags',
        'automaticRelease',
        'releaseAt',
        'expiresAt',
      ]
    } 
  });
export const releasePosting = createAll(
  'RELEASE_POSTING',
  { request: ['customId']});
export const logout = createAll('LOGOUT');


export const ROUTE_TO = 'ROUTE_TO';
export const routeTo = route => ({type: ROUTE_TO, route});
