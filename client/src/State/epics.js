import 'rxjs-compat';
import client from '../Graphql/Client';
import gql from 'graphql-tag';
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
            name,
            email,
            postings {
              postingTitle
            }
          }
        }`
      }))
      .map(A.queryEmployers.success)
      .catch(error => [A.queryEmployers.failure(error)])
    )

const queryPostingsEpic = action$ =>
  action$
    .ofType(A.queryPostings.REQUEST)
    .switchMap(() => Observable.from(
      client.query({
        query: gql`
        query {
          postings {
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
    .ofType(A.registerEmployer.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        mutation: gql`
        mutation {
          signupEmployer(
            name: "${action.name}",
            email: "${action.email}",
            password: "${action.password}"
          ) {name, email }
        }`
      }))
    .map(A.registerEmployer.success)
    .catch(error => [A.registerEmployer.failure(error)])
  )

const loginEmployerEpic = action$ =>
  action$
    .ofType(A.loginEmployer.REQUEST)
    .switchMap(action => Observable.from(client.mutate({
        mutation: gql`
        mutation {
          loginEmployer (name: "${action.name}", password: "${action.password}")
        }`
        }))
      .map(response => response.data.loginEmployer)
      .do(token => !!localStorage && localStorage.setItem('auth-token', token))
      .flatMap(token => [A.loginEmployer.success(token), A.routeTo('/employer/dashboard')])
      .catch(error => [A.loginEmployer.failure(error)])
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

export default [ signupEmployerEpic, queryEmployersEpic, loginEmployerEpic, newPostingEpic, queryPostingsEpic, releasePostingEpic ];
