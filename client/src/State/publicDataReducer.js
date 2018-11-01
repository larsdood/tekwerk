import * as A from './actions';

const INITIAL_STATE = {
  postings: [],
  postingDetails: {},
}

const publicDataReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case A.queryPublicPostings.SUCCESS:
      return { ...state, postings: action.response.data.publicPostings };
    case A.queryPostingDetails.SUCCESS:
      return { ...state, postingDetails: action.response.data.publicPostings[0] };
    default:
      return state;
  }
}

export default publicDataReducer;