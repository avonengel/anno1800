import {AnyAction, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {initialState as initialIslandState, islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {getType, isOfType} from "typesafe-actions";
import {selectIsland} from "./islands/actions";
import {initialTradeState, tradeReducer, TradeState} from "./trade/reducers";


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
}

const initialState = {
    island: initialIslandState,
    products: {},
    factories: {},
    selectedIsland: 1,
    trades: initialTradeState
};

function rootReducer(state: RootState | undefined = initialState, action: AnyAction): RootState {
    const islandState = islandReducer(state.island, action);
    state = populationConsumptionReducer({...state, island: islandState}, action);
    state = factoryReducer(state, action);
    state = factoryProductionConsumptionReducer(state, action);
    if (isOfType(getType(selectIsland), action)) {
        if (state.selectedIsland !== action.payload) {
            state = {...state,
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
