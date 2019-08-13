import {AnyAction, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {initialState as initialIslandState, islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {isRecord, Map, Record} from 'immutable';
import {persistStore } from 'redux-persist-immutable';
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


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
    let currentState = state;
    if (!isRecord(state)) {
        currentState = new RootState();
    }
    const islandState = islandReducer(currentState.island, action);
    currentState = populationConsumptionReducer(currentState.set('island', islandState), action);
    currentState = factoryReducer(currentState, action);
    currentState = factoryProductionConsumptionReducer(currentState, action);
    return currentState;
}

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, composeEnhancers())
export const persistor = persistStore(store, {records: RootState})
