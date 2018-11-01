import * as A from './actions';

const INITIAL_STATE = {
  threads: [],
  selectedThread: {},
}

export const messageReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case A.queryMessageThreads.SUCCESS:
      return { ...state, threads: action.response.data.messageThreads };
    case A.queryMessagesInThread.SUCCESS:
      return { ...state, selectedThread: action.response.data.messageThreads[0]}
    case A.postMessage.SUCCESS:
      return { ...state, selectedThread: action.response.data.postMessage}
    default:
      return state;
  }
}
