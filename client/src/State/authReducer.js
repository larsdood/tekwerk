
import * as A from './actions';
import jwtDecode from 'jwt-decode';

const DEFAULT_STATE = {};

export const authReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case A.login.SUCCESS:
      return { token: action.token, ...jwtDecode(action.token) };
    case A.logout.SUCCESS:
      return DEFAULT_STATE;
  }
  return state;
}