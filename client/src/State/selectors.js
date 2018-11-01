import { createSelector } from 'reselect';

const authSelector = state => state.auth;
const requestsSelector = state => state.requests;
const employerDataSelector = state => state.employerData;
const publicDataSelector = state => state.publicData;
const routerSelector = state => state.router;
const messageDataSelector = state => state.messageData;

export const tokenSelector = createSelector(
  authSelector,
  auth => auth.token,
)

export const employerSelector = createSelector(
  authSelector,
  auth => auth.loginType === 'employer'
    ? { name: auth.name, email: auth.email }
    : { }
);

export const ownUserIdSelector = createSelector(
  authSelector,
  auth => auth.id,
)

export const awaitingResponseSelector = createSelector(
  requestsSelector,
  ({ awaiting }) => awaiting,
);

export const successStackSelector = createSelector(
  requestsSelector,
  requests => requests.successStack,
);

export const failureStackSelector = createSelector(
  requestsSelector,
  requests => requests.failureStack,
);

export const employerPostingsSelector = createSelector(
  employerDataSelector,
  employerData => employerData.postings,
)

export const employerActivePostingsSelector = createSelector(
  employerPostingsSelector,
  postings => !!postings
    ? postings.filter(posting => posting.status ==='ACTIVE')
    : []
)

export const employerUpcomingPostingsSelector = createSelector(
  employerPostingsSelector,
  postings => !!postings
    ? postings.filter(posting => posting.status === 'UPCOMING' )
    : []
)

export const employerPostingsCountSelector = createSelector(
  employerDataSelector,
  employerData => employerData.postings
    ? employerData.postings.length
    : null,
)

export const publicPostingsSelector = createSelector(
  publicDataSelector,
  publicData => publicData.postings,
)

export const pathnameSelector = createSelector(
  routerSelector,
  routerState => routerState.location.pathname
)

export const postingDetailsSelector = createSelector(
  publicDataSelector,
  publicData => publicData.postingDetails,
)

export const internalPostingDetailsSelector = createSelector(
  employerDataSelector,
  employerData => employerData.postingDetails,
)

export const numberOfApplicationsSelector = createSelector(
  employerDataSelector,
  employerData => employerData && Array.isArray(employerData.postings)
    ? employerData.postings.reduce((acc, curr) => {
    return (acc + curr.applications.length)
  }, 0)
  : 0
)

export const messageThreadsSelector = createSelector(
  messageDataSelector,
  messageData => messageData.threads,
)

export const selectedThreadSelector = createSelector(
  messageDataSelector,
  messageData => messageData.selectedThread,
)