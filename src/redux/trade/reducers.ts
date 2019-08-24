import {isActionOf} from "typesafe-actions";
import {deleteTrade, updateTonsPerMinute, updateTradeIslands, updateTradeProduct} from "./actions";
import {AnyAction} from "redux";
import {RootState} from "../store";

export interface Trade {
    fromIslandId: number,
    toIslandId: number,
    productId: number,
    tonsPerMinute: number,
}

export type TradeState = { [tradeId: number]: Trade };
export const initialTradeState: TradeState = {
    1: {
        fromIslandId: 1,
        toIslandId: 2,
        productId: 120042,
        tonsPerMinute: 0,
    }
};

export function tradeReducer(state: RootState, action: AnyAction) {
    if (isActionOf(updateTradeIslands, action)) {
        const trade = {
            ...state.trades[action.payload.tradeId],
            fromIslandId: action.payload.fromIslandId,
            toIslandId: action.payload.toIslandId,
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
    } else if (isActionOf(updateTonsPerMinute, action)) {
        const trade = {
            ...state.trades[action.payload.tradeId],
            tonsPerMinute: action.payload.tonsPerMinute
        };
        return {
            ...state,
            trades: {
                ...state.trades,
                [action.payload.tradeId]: trade
            }
        };
    } else if (isActionOf(deleteTrade, action)) {
        const {[action.payload]: tradeToDelete, ...trades} = state.trades;
        return {
            ...state,
            trades: trades
        }
    }
    return state;
}