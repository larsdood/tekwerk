import 'rxjs-compat';
import client from '../Graphql/Client';
import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs-compat';
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

const queryInternalPostingsEpic = (action$, state$) =>
  action$
    .ofType(A.queryInternalPostings.REQUEST)
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
            customId,
            id,
            applications {
              id
            }
          }
        }`
      }))
      .map(A.queryInternalPostings.success)
      .catch(error => [A.queryInternalPostings.failure(error)])
    );

const queryInternalPostingDetailsEpic = (action$, state$) =>
  action$
    .ofType(A.queryInternalPostingDetails.REQUEST)
    .switchMap(action => Observable.from(
      client.query({
        context: getAuthHeader(state$),
        query: gql`
        query {
          internalPostingDetails (id: "${action.id}") {
            postingTitle,
            positionTitle,
            status,
            employmentType,
            createdDate,
            expiresAt,
            customId,
            id,
            applications {
              applicant {
                firstName,
                middleNames,
                lastName,
                email,
                id,
              },
              applicationLetter,
              status
            }
          }
        }
        `
      })
    ).map(A.queryInternalPostingDetails.success)
    .catch(error => [A.queryInternalPostingDetails.failure(error)])
  );

const queryMessageThreadsEpic = (action$, state$) =>
  action$
    .ofType(A.queryMessageThreads.REQUEST)
    .switchMap(action => Observable.from(
      client.query({
        context: getAuthHeader(state$),
        query: gql`
        query {
          messageThreads
          {id, users{id, firstName, lastName}, messages(first:1){message, sentAt}}
        }
        `
      })
    ).map(A.queryMessageThreads.success)
    .catch(error => [A.queryMessageThreads.failure(error)])
  );

const queryMessagesInThreadEpic = (action$, state$) =>
  action$
    .ofType(A.queryMessagesInThread.REQUEST)
    .switchMap(action => Observable.from(
      client.query({
        context: getAuthHeader(state$),
        query: gql`
        query {
          messageThreads (id: "${action.threadId}")
          {id, users{id, firstName, lastName}, messages{message, from{id, firstName, lastName}, to{id, firstName, lastName}, sentAt, readAt}}
        }
        `
      })
    ).map(A.queryMessagesInThread.success)
    .catch(error => [A.queryMessageThreads.failure(error)])
  );

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
      .flatMap(response => [
        A.signupEmployer.success(response),
        A.login.request(action.adminEmail, action.adminPassword)
      ])
      .catch(error => [A.signupEmployer.failure(error)])
    )

const signUpCandidateEpic = action$ =>
  action$
    .ofType(A.signupCandidate.REQUEST)
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
      .flatMap(response => [
          A.signupCandidate.success(response),
          A.login.request(action.email, action.password)
        ])
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
      .flatMap(({token, decoded}) =>
        [A.login.success(token),
        A.routeTo(decoded.userType === 'CANDIDATE' ? '/candidate/dashboard/' : '/employer/postings/')])
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
          createPosting(
            customId: "${action.customId}",
            postingTitle: "${action.postingTitle}",
            positionTitle: "${action.positionTitle}",
            country: "${action.country}",
            city: "${action.city}",
            employmentType: "${action.employmentType}",
            description: "${action.description}",
            minimumSalary: ${parseInt(action.minimumSalary, 10)},
            maximumSalary: ${parseInt(action.maximumSalary, 10)},
            currency: "${action.currency}",
            workingHoursFrom: "${action.workingHoursFrom}",
            workingHoursTo: "${action.workingHoursTo}",
            vacationDays: ${parseInt(action.vacationDays, 10)},
            minimumEducation: "${action.minimumEducation}",
            minimumExperience: "${action.minimumExperience}",
            internationalOK: ${action.internationalOK},
            hasRelocationAllowance: ${action.hasRelocationAllowance},
            requirements: "${action.requirements}",
            niceToHave: "${action.niceToHave}",
            tags: "${action.tags}",
            releaseAt: "${action.releaseAt}",
            expiresAt: "${action.expiresAt}"
            )
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

const sendApplicationEpic = (action$, state$) =>
  action$
    .ofType(A.sendApplication.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        context: getAuthHeader(state$),
        mutation: gql`
        mutation {
          sendApplication(
            postingId: "${action.postingId}",
            applicationLetter: "${action.applicationLetter}"
          ){status}
        }
        `
      }))
      .map(A.sendApplication.success)
      .catch(error => [A.sendApplication.failure(error)])
);

const postMessageEpic = (action$, state$) =>
  action$
    .ofType(A.postMessage.REQUEST)
    .switchMap(action => Observable.from(
      client.mutate({
        context: getAuthHeader(state$),
        mutation: gql`
        mutation {
          postMessage(
            toId: "${action.toId}",
            message: "${action.message}"
          ){id, users{id, firstName, lastName}, messages{message, from{id, firstName, lastName}, to{id, firstName, lastName}, sentAt, readAt}}
        }
        `
      })
    )
    .map(A.postMessage.success)
    .catch(error => [A.postMessage.failure(error)])
);

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
  queryInternalPostingsEpic,
  queryPostingDetailsEpic,
  queryPublicPostingsEpic,
  releasePostingEpic,
  logoutEpic,
  signUpCandidateEpic,
  sendApplicationEpic,
  queryInternalPostingDetailsEpic,
  postMessageEpic,
  queryMessageThreadsEpic,
  queryMessagesInThreadEpic
];
