import * as A from './actions';

export const employerReducer = (state = {}, action) => {
  switch(action.type) {
    case A.queryPostings.SUCCESS:
      return { ...state, postings: action.response.data.postings }
    default:
      return state;
  }
}