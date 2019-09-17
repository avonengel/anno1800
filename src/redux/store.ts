import {createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {initialState as initialIslandState, islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {isActionOf} from "typesafe-actions";
import {selectIsland} from "./islands/actions";
import {initialTradeState, tradeReducer, TradeState} from "./trade/reducers";
import {stateUploadReducer} from "./reducers";
import {RootAction} from "./types";
import {PublicServiceStateByIslandId} from "./publicservices/types";


const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: 'Anno1800 Companion'
});

export interface RootState {
    readonly island: IslandState,
    readonly products: { [islandId: number]: { [productId: number]: ProductState } }
    readonly factories: { [islandId: number]: { [factoryId: number]: FactoryState } },
    readonly selectedIsland: number,
    readonly trades: TradeState,
    readonly publicServices: PublicServiceStateByIslandId,
}

export const initialState: Readonly<RootState> = {
    island: initialIslandState,
    products: {},
    factories: {},
    selectedIsland: 1,
    trades: initialTradeState,
    publicServices: {
        byIslandId: {}
    },
};

function rootReducer(state: RootState | undefined = initialState, action: RootAction): RootState {
    state = stateUploadReducer(state, action);
    state = islandReducer(state, action);
    state = populationConsumptionReducer(state, action);
    state = factoryReducer(state, action);
    state = factoryProductionConsumptionReducer(state, action);
    if (isActionOf(selectIsland, action)) {
        if (state.selectedIsland !== action.payload) {
            state = {
                ...state,
                selectedIsland: action.payload
            };
        }
    }
    state = tradeReducer(state, action);
    return state;
}

// Config
const mapStatePersistConfig = {
    key: 'mapState',
    storage,
};

const persistedReducer = persistReducer(mapStatePersistConfig, rootReducer);

export const store = createStore(persistedReducer, composeEnhancers());
export const persistor = persistStore(store);
