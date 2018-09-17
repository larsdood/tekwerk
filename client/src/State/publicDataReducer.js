import * as A from './actions';

const INITIAL_STATE = {
  postings: [],  
}

const publicDataReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case A.queryPublicPostings.SUCCESS:
      console.log('response:', action.response);
      return { ...state, postings: action.response.data.publicPostings };
    case A.queryPostingDetails.SUCCESS:
      console.log('response:', action.response);
      return { ...state, postingDetails: action.response.data.publicPostings[0] };
    default:
      return state;
  }
}

export default publicDataReducer;