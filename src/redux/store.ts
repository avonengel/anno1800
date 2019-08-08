import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {islandReducer} from "./islands/reducers";
import {factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {fromJS, Map} from 'immutable';

// To be used to hydrate state
let persistedState = JSON.parse(localStorage.getItem('reduxState') || '{}');
// TODO: turn all state members into ImmutableJS Maps (or even whole state)
// for (let key in persistedState) {
//     persistedState.key = fromJS(persistedState.key);
// }
persistedState.products = fromJS(persistedState.products);

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

export interface AppState {
    island: IslandState,
    products: Map<number, Map<number, ProductState>>,
    factories: Map<number, Map<number, FactoryState>>,
}

function rootReducer(state: AppState | undefined, action: AnyAction): AppState {
    if (state) {
        const islandState = islandReducer(state.island, action);
        let result = populationConsumptionReducer({
            ...state,
            island: islandState,
        }, action);
        result = factoryReducer(result, action);
        return result;
    } else {
        return {
            island: islandReducer(undefined, action),
            products: Map<number, Map<number, ProductState>>(),
            factories: Map<number, Map<number, FactoryState>>(),
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
