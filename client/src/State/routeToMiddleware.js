import { ROUTE_TO } from './actions';
import { push } from 'connected-react-router'
export const routeToMiddleware = store => next => action => {
  if (action.type === ROUTE_TO) {
    if (store.getState().router.location.pathname !== action.route) {
      store.dispatch(push(action.route));
      return;
    }
  }
  next(action);
};