import { createSelector } from 'reselect';

const authSelector = state => state.auth;
const requestsSelector = state => state.requests;
const employerDataSelector = state => state.employerData;

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