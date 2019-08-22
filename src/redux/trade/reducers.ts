import {isActionOf} from "typesafe-actions";
import {updateTradeIslands, updateTradeProduct} from "./actions";
import {AnyAction} from "redux";
import {RootState} from "../store";

export interface Trade {
    islandId1: number,
    islandId2: number,
    productId: number,
    tonsPerMinute: number,
}

export type TradeState = { [tradeId: number]: Trade };
export const initialTradeState: TradeState = {
    1: {
        islandId1: 1,
        islandId2: 2,
        productId: 120042,
        tonsPerMinute: 0,
    }
};

export function tradeReducer(state: RootState, action: AnyAction) {
    if (isActionOf(updateTradeIslands, action)) {
        const trade = {
            ...state.trades[action.payload.tradeId],
            islandId1: action.payload.islandId1,
            islandId2: action.payload.islandId2,
        };
        return {
            ...state,
            trades: {
                ...state.trades,
                [action.payload.tradeId]: trade
            }

        };
    } else if (isActionOf(updateTradeProduct, action)) {
        const trade = {
            ...state.trades[action.payload.tradeId],
            productId: action.payload.productId,
        };
        return {
            ...state,
            trades: {
                ...state.trades,
                [action.payload.tradeId]: trade
            }
        };
    }
    return state;
}