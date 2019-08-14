import {AnyAction, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {initialState as initialIslandState, islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {persistReducer, persistStore, createTransform} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: 'Anno1800 Companion'
});

export interface RootState {
    readonly island: IslandState,
    readonly products: ReadonlyMap<number, ReadonlyMap<number, ProductState>> //{ [islandId: number]: { [productId: number]: ProductState } }
    readonly factories: ReadonlyMap<number, ReadonlyMap<number, FactoryState>> //{ [islandId: number]: { [factoryId: number]: FactoryState } }
}

const initialState = {
    island: initialIslandState,
    products: new Map<number, ReadonlyMap<number, ProductState>>(),
    factories: new Map<number, ReadonlyMap<number, FactoryState>>(),
};

function rootReducer(state: RootState | undefined = initialState, action: AnyAction): RootState {
    const islandState = islandReducer(state.island, action);
    state = populationConsumptionReducer({...state, island: islandState}, action);
    // FIXME for some reason, the state changes are not visible in redux dev tools now
    // FIXME also, population consumption does not show up on factory cards
    state = factoryReducer(state, action);
    state = factoryProductionConsumptionReducer(state, action);
    return state;
}

// The transformer
const mapTransformer = (config: any) => {
    return createTransform(
        (map: Map<any, any>) => JSON.stringify(Array.from(map)),
        arrayString => new Map(JSON.parse(arrayString)),
        config,
    );
};

// Config
const mapStatePersistConfig = {
    key: 'mapState',
    storage,
    transforms: [mapTransformer({ whitelist: 'products' })],
};

const persistConfig = {
    key: 'root',
    storage,
};
 // FIXME rehydrate doesn't work
const persistedReducer = persistReducer(mapStatePersistConfig, rootReducer);

export const store = createStore(persistedReducer, composeEnhancers());
export const persistor = persistStore(store);
