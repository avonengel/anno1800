import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI} from "redux";
import IdentityReducer from "./reducers";
import {composeWithDevTools} from 'redux-devtools-extension';

// To be used to hydrate state
const persistedState = JSON.parse(localStorage.getItem('reduxState') || '{}');

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: 'Anno1800 Companion'
});

/**
 * Logs all actions and states after they are dispatched.
 */
const logger: Middleware = (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', api.getState());
    console.groupEnd();
    return result
};
const store = createStore(IdentityReducer, persistedState, composeEnhancers(applyMiddleware(logger)));

// Every time state changes, will be written to localStorage.
// TODO: Find a more efficient way to do localStorage
store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;