import * as A from './actions';

export const employerReducer = (state = {}, action) => {
  switch(action.type) {
    case A.queryInternalPostings.SUCCESS:
      return { ...state, postings: action.response.data.internalPostings }
    case A.queryInternalPostingDetails.SUCCESS:
      return { ...state, postingDetails: action.response.data.internalPostingDetails}
    default:
      return state;
  }
}