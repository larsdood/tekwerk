import 'rxjs-compat';
import client from '../Graphql/Client';
import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';

import { Observable, from } from 'rxjs-compat';
import * as A from './actions';
import * as S from './selectors';

const getAuthHeader = state$ => ({headers: { Authorization: `Bearer ${S.tokenSelector(state$.value)}`}});

const queryEmployersEpic = action$ =>
  action$
    .ofType(A.queryEmployers.REQUEST)
    .switchMap(() => Observable.from(
      client.query({
        query: gql`
        query {
          employers {
            companyName,
            contactEmail,
            postings {
              postingTitle
            }
          }
        }`
      }))
      .map(A.queryEmployers.success)
      .catch(error => [A.queryEmployers.failure(error)])
    )

const queryPublicPostingsEpic = action$ => 
  action$
    .ofType(A.queryPublicPostings.REQUEST)
    .switchMap(action => Observable.from(
      client.query({
        query: gql`
        query {
          publicPostings {
            postingTitle,
            positionTitle,
            employmentType,
            expiresAt,
            id,
            description,
            offeredBy{
              companyName
            }
          }
        }`
      }))
      .map(A.queryPublicPostings.success)
      .catch(error => [A.queryPublicPostings.failure(error)])
      )

const queryPostingDetailsEpic = action$ =>
  action$
    .ofType(A.queryPostingDetails.REQUEST)
    .switchMap(action => Observable.from(
      client.query({
        query: gql`
        query {
          publicPostings (id: "${action.id}") {
            postingTitle,
            positionTitle,
            employmentType,
            expiresAt,
            id,
            description,
            offeredBy{
              companyName,
              contactEmail
            }
          }
        }`
      }))
      .map(A.queryPostingDetails.success)
      .catch(error => [A.queryPostingDetails.failure(error)])
      )

const queryPostingsEpic = (action$, state$) =>
  action$
    .ofType(A.queryPostings.REQUEST)
    .switchMap(() => Observable.from(
      client.query({
        context: getAuthHeader(state$),
        query: gql`
        query {
          internalPostings {
            postingTitle,
            positionTitle,
            status,
            employmentType,
            createdDate,
            expiresAt,
            customId
          }
        }`
      }))
      .map(A.queryPostings.success)
      .catch(error => [A.queryPostings.failure(error)])
    )

const signupEmployerEpic = action$ =>
  action$
    .ofType(A.signupEmployer.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        mutation: gql`
        mutation {
          signupEmployer(
            companyName: "${action.companyName}",
            contactEmail: "${action.contactEmail}",
            adminFirstName: "${action.adminFirstName}",
            adminMiddleNames: "${action.adminMiddleNames}",
            adminLastName: "${action.adminLastName}",
            adminEmail: "${action.adminEmail}",
            adminPassword: "${action.adminPassword}"
          ) {firstName, lastName, email }
        }`
      }))
      .map(A.signupEmployer.success)
      .catch(error => [A.signupEmployer.failure(error)])
    )

const signUpCandidateEpic = action$ =>
  action$
    .ofType(A.signupCandidate.REQUEST)
    .do(action => { console.log(action)})
    .switchMap(action => Observable.from(
      client.mutate({
        mutation: gql`
        mutation {
          signupCandidate(
            firstName: "${action.firstName}",
            middleNames: "${action.middleNames}",
            lastName: "${action.lastName}",
            email: "${action.email}",
            password: "${action.password}"
          ) {firstName, middleNames, lastName, email }
        }`
      }))
      .flatMap(response => [A.signupCandidate.success(response), A.routeTo('/candidate/dashboard')])
      .catch(error => [A.signupCandidate.failure(error)])
    )

const loginEpic = action$ =>
  action$
    .ofType(A.login.REQUEST)
    .switchMap(action => Observable.from(client.mutate({
        mutation: gql`
        mutation {
          login (email: "${action.email}", password: "${action.password}")
        }`
        }))
      .map(response => ({ token: response.data.login, decoded: jwtDecode(response.data.login) }))
      .do(({token}) => !!localStorage && localStorage.setItem('auth-token', token))
      .do(({decoded}) => { console.log('decoded:', decoded)} )
      .flatMap(({token, decoded}) =>
        [A.login.success(token),
        A.routeTo(decoded.userType === 'CANDIDATE' ? '/candidate/dashboard/' : '/employer/dashboard')])
      .catch(error => [A.login.failure(error)])
    )

const newPostingEpic = (action$, state$) =>
  action$
    .ofType(A.newPosting.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        context: getAuthHeader(state$),
        mutation: gql`
        mutation {
          createPosting(postingTitle: "${action.postingTitle}",
            positionTitle: "${action.positionTitle}",
            employmentType: "${action.employmentType}",
            description: "${action.description}",
            requirements: "${action.requirements}",
            customId: "${action.customId}",
            expiresAt: "${action.expiresAt}" )
            {postingTitle, status }
        }`
      }))
      .map(A.newPosting.success)
      .catch(error => [A.newPosting.failure(error)])
    )   

const releasePostingEpic = (action$, state$) =>
  action$
    .ofType(A.releasePosting.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        context: getAuthHeader(state$),
        mutation: gql`
        mutation {
          releasePosting(customId: "${action.customId}")
        }
        `
      }))
      .map(A.releasePosting.success)
      .catch(error => [A.releasePosting.failure(error)])
)

//TODO: Trenger denne mer logikk? Backend?
const logoutEpic = action$ =>
  action$
    .ofType(A.logout.REQUEST)
    .do(() => !!localStorage && localStorage.removeItem('auth-token'))
    .flatMap(() => [A.logout.success(), A.routeTo('/')]);

export default [
  signupEmployerEpic,
  queryEmployersEpic,
  loginEpic,
  newPostingEpic,
  queryPostingsEpic,
  queryPostingDetailsEpic,
  queryPublicPostingsEpic,
  releasePostingEpic,
  logoutEpic,
  signUpCandidateEpic
];
