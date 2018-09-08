
import * as A from './actions';
import jwtDecode from 'jwt-decode';

export const authReducer = (state = {}, action) => {
  switch(action.type) {
    case A.loginEmployer.SUCCESS:
      return { token: action.token, ...jwtDecode(action.token) };
  }
  return state;
}