import {createCustomAction, createStandardAction} from "typesafe-actions";
import {
    ADD_TRADE,
    DELETE_TRADE,
    UPDATE_TRADE_ISLANDS,
    UPDATE_TRADE_PRODUCT,
    UPDATE_TRADE_TONS_PER_MINUTE
} from "./constants";

export const addTrade = createStandardAction(ADD_TRADE)<number>();

export const updateTradeIslands = createCustomAction(UPDATE_TRADE_ISLANDS,
    type => (tradeId: number, fromIslandId: number, toIslandId: number) => ({
        type,
        payload: {tradeId, fromIslandId, toIslandId}
    }));
export const updateTradeProduct = createCustomAction(UPDATE_TRADE_PRODUCT,
    type => (tradeId: number, productId: number) => ({
        type,
        payload: {tradeId, productId}
    }));
export const updateTonsPerMinute = createCustomAction(UPDATE_TRADE_TONS_PER_MINUTE,
    type => (tradeId: number, tonsPerMinute: number) => ({
        type,
        payload: {tradeId, tonsPerMinute}
    }));

export const deleteTrade = createStandardAction(DELETE_TRADE)<number>();
