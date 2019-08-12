import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {initialState as initialIslandState, islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {fromJS, Map, Record} from 'immutable';

// To be used to hydrate state
let persistedState = JSON.parse(localStorage.getItem('reduxState') || '{}');
persistedState.products = fromJS(persistedState.products);
persistedState.factories = fromJS(persistedState.factories);

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: 'Anno1800 Companion'
});

export interface IRootState {
    island: IslandState,
    products: Map<number, Map<number, ProductState>>,
    factories: Map<number, Map<number, FactoryState>>,
}

export class RootState extends Record({
    island: initialIslandState,
    products: Map<number, Map<number, ProductState>>(),
    factories: Map<number, Map<number, FactoryState>>()
}) implements IRootState {
    constructor(config?: Partial<IRootState>) {
        if (!!config) {
            super(config);
        } else {
            super();
        }
    }
}

function rootReducer(state: RootState | undefined = new RootState(), action: AnyAction): RootState {
    const islandState = islandReducer(state.island, action);
    let result = populationConsumptionReducer({
        // FIXME this should have displayed an error, as this state object is only IRootState, but not RootState (the Record)!
        // FIXME maybe get rid of Immutable.JS and it's problems, after all!
        ...state,
        island: islandState,
    }, action);
    result = factoryReducer(result, action);
    result = factoryProductionConsumptionReducer(result, action);
    return result;
}

const store = createStore(rootReducer, persistedState);

// Every time state changes, will be written to localStorage.
// TODO: Find a more efficient way to do localStorage
store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;
