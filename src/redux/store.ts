import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {islandReducer} from "./islands/reducers";
import {consumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {ProductState} from "./production/types";
import {Map} from 'immutable';

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

export type GuidMap<T> = { [key: number]: T };

export interface AppState {
    island: IslandState,
    products: Map<number, Map<number, ProductState>>
}

function rootReducer(state: AppState | undefined, action: AnyAction): AppState {
    if (state) {
        const islandState = islandReducer(state.island, action);
        const result = consumptionReducer({
            ...state,
            island: islandState,
        }, action);
        return result;
    } else {
        return {
            island: islandReducer(undefined, action),
            products: Map<number, Map<number, ProductState>>(),
        };
    }
}

const store = createStore(rootReducer, persistedState, composeEnhancers(applyMiddleware(logger)));

// Every time state changes, will be written to localStorage.
// TODO: Find a more efficient way to do localStorage
store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;
