import {createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import {islandReducer} from "./islands/reducers";
import {factoryProductionConsumptionReducer, factoryReducer, populationConsumptionReducer} from "./production/reducers";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {isActionOf} from "typesafe-actions";
import {selectIsland} from "./islands/actions";
import {tradeReducer} from "./trade/reducers";
import {stateUploadReducer} from "./reducers";
import {RootAction} from "./types";
import {initialState, RootState} from "./root-state";
import {publicServiceReducer} from "./publicservices/reducers";
import {productFilterReducer} from "./productFilter/reducers";


const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    name: 'Anno1800 Companion'
});

function rootReducer(state: RootState = initialState, action: RootAction): RootState {
    state = stateUploadReducer(state, action);
    state = publicServiceReducer(state, action);
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
    state = productFilterReducer(state, action);
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
