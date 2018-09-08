const regex = /^[^@]+/g;

export const requestsReducer = (state= { awaiting: [], successStack: [], failureStack: []}, action) => {
  let root;
  let awaiting;
  let pos;
  switch(true) {
    case /@REQUEST/.test(action.type):
      return { ...state, awaiting: state.awaiting.concat([action.type.match(regex)[0]]) };
    case /@SUCCESS/.test(action.type):
      [root] = action.type.match(regex);
      awaiting = state.awaiting;
      pos = awaiting.indexOf(root);
      if (pos === -1) return state;
      awaiting.splice(pos, 1);
      const { successStack } = state;
      successStack.unshift(root) > 5 && successStack.pop();
      return { ...state, awaiting, successStack }
    case /@FAILURE/.test(action.type):
      [root] = action.type.match(regex);
      awaiting = state.awaiting;
      pos = awaiting.indexOf(root);
      if (pos === -1) return state;
      awaiting.splice(pos, 1);
      const { failureStack } = state;
      failureStack.unshift(root) > 5 && failureStack.pop();
      return { ...state, awaiting, failureStack }
    default:
      return state;
  }
}