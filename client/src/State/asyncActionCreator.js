export const createAsyncActionTypes = (root, options) => {
  return {
    ROOT: root,
    REQUEST: `${root}@REQUEST`,
    SUCCESS: `${root}@SUCCESS`,
    FAILURE: `${root}@FAILURE`,
  }
};

export const createAll = (root, actionParams) => {
  const actionTypes = createAsyncActionTypes(root);
  const actions = createAsyncActions(actionTypes, actionParams);
  return {
    ...actionTypes, ...actions
  }
};

const createAsyncActions = (actionTypes, actionParams = {}) => {
  const request = createAsyncAction(actionTypes.REQUEST, actionParams.request);
  const success = createAsyncAction(actionTypes.SUCCESS, actionParams.success || ['response']);
  const failure = createAsyncAction(actionTypes.FAILURE, actionParams.failure || ['error']);

  return {
    request,
    success,
    failure
  }
};

const createAsyncAction = (actionType, params, defaultFunc) => {
  switch (true) {
    case Array.isArray(params):
      return new Function(...params, `return { type: "${actionType}",  ${params}}`)
    case typeof params === 'object':
      if (params.objectParams) {
        return new Function(`{${params.params}}`, `return { type: "${actionType}",  ${params.params}}`);
      }
    default:
      return defaultFunc || function () { return { type: actionType } };
  }
}