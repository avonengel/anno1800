import {createCustomAction} from "typesafe-actions";
import {ADD_TRADE, UPDATE_TRADE_ISLANDS, UPDATE_TRADE_PRODUCT} from "./constants";

export const addTrade = createCustomAction(ADD_TRADE, type => () => ({type}));

export const updateTradeIslands = createCustomAction(UPDATE_TRADE_ISLANDS,
    type => (tradeId: number, islandId1: number, islandId2: number) => ({
        type,
        payload: {tradeId, islandId1, islandId2}
    }));
export const updateTradeProduct = createCustomAction(UPDATE_TRADE_PRODUCT,
    type => (tradeId: number, productId: number) => ({
        type,
        payload: {tradeId, productId}
    }));
