import {isActionOf} from "typesafe-actions";
import {addTrade, deleteTrade, updateTonsPerMinute, updateTradeIslands, updateTradeProduct} from "./actions";
import {AnyAction} from "redux";
import {RootState} from "../store";
import {deleteIsland} from "../islands/actions";

export interface Trade {
    fromIslandId: number,
    toIslandId: number,
    productId: number,
    tonsPerMinute: number,
}

export type TradeState = {
    tradesById: { [tradeId: number]: Trade };
    allTradeIds: number[];
};

export const initialTradeState: TradeState = {
    tradesById: {},
    allTradeIds: [],
};

export function tradeReducer(state: RootState, action: AnyAction) {
    if (isActionOf(deleteIsland, action)) {
        const deletedIslandId = action.payload;
        const tradesToDelete = state.trades.allTradeIds.filter(tradeId => {
            const trade = state.trades.tradesById[tradeId];
            return trade.toIslandId === deletedIslandId || trade.fromIslandId === deletedIslandId;
        });
        const tradesById: { [tradeId: number]: Trade } = {};
        const remainingTradeIds = state.trades.allTradeIds.filter(tradeId => !tradesToDelete.includes(tradeId));
        for (let tradeId of remainingTradeIds) {
            tradesById[tradeId] = state.trades.tradesById[tradeId];
        }
        let intermediate: RootState = state;
        tradesToDelete.forEach(tradeId => {
            const trade = state.trades.tradesById[tradeId];
            if (trade.toIslandId === deletedIslandId) {
                const {[tradeId]: _, ...exports} = intermediate.products[trade.fromIslandId][trade.productId].exports;
                intermediate = {
                    ...intermediate,
                    products: {
                        ...intermediate.products,
                        [trade.fromIslandId]: {
                            ...intermediate.products[trade.fromIslandId],
                            [trade.productId]: {
                                ...intermediate.products[trade.fromIslandId][trade.productId],
                                exports
                            }
                        }
                    }
                }
            } else {
                const {[tradeId]: _, ...imports} = intermediate.products[trade.toIslandId][trade.productId].imports;
                intermediate = {
                    ...intermediate,
                    products: {
                        ...intermediate.products,
                        [trade.toIslandId]: {
                            ...intermediate.products[trade.toIslandId],
                            [trade.productId]: {
                                ...intermediate.products[trade.toIslandId][trade.productId],
                                imports
                            }
                        }
                    }
                }
            }
        });
        return {
            ...intermediate,
            trades: {
                allTradeIds: remainingTradeIds,
                tradesById,
            }
        };
    } else if (isActionOf(updateTradeIslands, action)) {
        const previousTrade = state.trades.tradesById[action.payload.tradeId];
        const trade = {
            ...previousTrade,
            fromIslandId: action.payload.fromIslandId,
            toIslandId: action.payload.toIslandId,
        };
        const products = {...state.products};
        if (previousTrade && trade.productId && previousTrade.fromIslandId !== action.payload.fromIslandId) {
            if (previousTrade.fromIslandId) {
                // delete the old export
                products[previousTrade.fromIslandId] = {...products[previousTrade.fromIslandId]};
                products[previousTrade.fromIslandId][trade.productId] = {...products[previousTrade.fromIslandId][trade.productId]};
                const {[action.payload.tradeId]: _, ...newExports} = products[previousTrade.fromIslandId][trade.productId].exports;
                products[previousTrade.fromIslandId][trade.productId].exports = newExports;
            }
            if (action.payload.fromIslandId) {
                // create the new export
                products[action.payload.fromIslandId] = {...products[action.payload.fromIslandId]};
                products[action.payload.fromIslandId][trade.productId] = {...products[action.payload.fromIslandId][trade.productId]};
                products[action.payload.fromIslandId][trade.productId].exports = {...products[action.payload.fromIslandId][trade.productId].exports};
                products[action.payload.fromIslandId][trade.productId].exports[action.payload.tradeId] = trade.tonsPerMinute;
            }
        }
        if (previousTrade && trade.productId && previousTrade.toIslandId !== action.payload.toIslandId) {
            // delete the old import
            if (!!previousTrade.toIslandId) {
                products[previousTrade.toIslandId] = {...products[previousTrade.toIslandId]};
                products[previousTrade.toIslandId][previousTrade.productId] = {...products[previousTrade.toIslandId][previousTrade.productId]};
                const {[action.payload.tradeId]: _, ...newImports} = products[previousTrade.toIslandId][previousTrade.productId].imports;
                products[previousTrade.toIslandId][previousTrade.productId].imports = newImports;
            }
            if (action.payload.toIslandId) {
                // create the new import
                products[action.payload.toIslandId] = {...products[action.payload.toIslandId]};
                const newProductState = {...products[action.payload.toIslandId][trade.productId]};
                newProductState.imports = {
                    ...newProductState.imports,
                    [action.payload.tradeId]: trade.tonsPerMinute,
                };
                products[trade.toIslandId] = {
                    ...products[trade.toIslandId],
                    [trade.productId]: newProductState,
                }
            }
        }
        return {
            ...state,
            products,
            trades: {
                ...state.trades,
                tradesById: {
                    ...state.trades.tradesById,
                    [action.payload.tradeId]: trade
                }
            }

        };
    } else if (isActionOf(updateTradeProduct, action)) {
        const previousTrade = state.trades.tradesById[action.payload.tradeId];
        const trade = {
            ...state.trades.tradesById[action.payload.tradeId],
            productId: action.payload.productId,
        };
        let products = state.products;
        if (previousTrade && trade.productId !== previousTrade.productId) {
            products = {...products};
            if (previousTrade.fromIslandId) {
                const exportIslandProducts = {...products[previousTrade.fromIslandId]};
                products[previousTrade.fromIslandId] = exportIslandProducts;
                if (previousTrade.productId) {
                    // delete the old export
                    const previousExportProductState = {...exportIslandProducts[previousTrade.productId]};
                    exportIslandProducts[previousTrade.productId] = previousExportProductState;
                    const {[action.payload.tradeId]: _, ...remainingPreviousExports} = previousExportProductState.exports;
                    previousExportProductState.exports = remainingPreviousExports;
                }

                // create the new export
                const newExportProductState = {...exportIslandProducts[trade.productId]};
                exportIslandProducts[trade.productId] = newExportProductState;
                newExportProductState.exports = {
                    ...newExportProductState.exports,
                    [action.payload.tradeId]: trade.tonsPerMinute,
                };
            }
            if (previousTrade.toIslandId) {
                const importIslandProducts = {...products[previousTrade.toIslandId]};
                products[previousTrade.toIslandId] = importIslandProducts;
                if (previousTrade.productId) {
                    // delete the old import
                    const previousImportProductState = {...importIslandProducts[previousTrade.productId]};
                    importIslandProducts[previousTrade.productId] = previousImportProductState;
                    const {[action.payload.tradeId]: _remove, ...remainingPreviousImports} = previousImportProductState.imports;
                    previousImportProductState.imports = remainingPreviousImports;
                }
                // create the new import
                const newImportProductState = {...importIslandProducts[trade.productId]};
                importIslandProducts[trade.productId] = newImportProductState;
                newImportProductState.imports = {
                    ...newImportProductState.imports,
                    [action.payload.tradeId]: trade.tonsPerMinute,
                };
            }
        }
        return {
            ...state,
            products,
            trades: {
                ...state.trades,
                tradesById: {
                    ...state.trades.tradesById,
                    [action.payload.tradeId]: trade
                }
            }
        };
    } else if (isActionOf(updateTonsPerMinute, action)) {
        const previousTrade = state.trades.tradesById[action.payload.tradeId];
        const trade = {
            ...state.trades.tradesById[action.payload.tradeId],
            tonsPerMinute: action.payload.tonsPerMinute
        };
        let products = state.products;
        if (previousTrade && previousTrade.productId) {
            products = {...products};
            // update export
            if (previousTrade.fromIslandId) {
                products[trade.fromIslandId] = {...products[trade.fromIslandId]};
                products[trade.fromIslandId][trade.productId] = {...products[trade.fromIslandId][trade.productId]};
                products[trade.fromIslandId][trade.productId].exports = {...products[trade.fromIslandId][trade.productId].exports};
                products[trade.fromIslandId][trade.productId].exports[action.payload.tradeId] = trade.tonsPerMinute;
            }
            // update import
            if (previousTrade.toIslandId) {
                products[trade.toIslandId] = {...products[trade.toIslandId]};
                products[trade.toIslandId][trade.productId] = {...products[trade.toIslandId][trade.productId]};
                products[trade.toIslandId][trade.productId].imports = {...products[trade.toIslandId][trade.productId].imports};
                products[trade.toIslandId][trade.productId].imports[action.payload.tradeId] = trade.tonsPerMinute;
            }
        }

        return {
            ...state,
            products,
            trades: {
                ...state.trades,
                tradesById: {
                    ...state.trades.tradesById,
                    [action.payload.tradeId]: trade
                }
            }
        };
    } else if (isActionOf(deleteTrade, action)) {
        const previousTrade = state.trades.tradesById[action.payload];
        const {[action.payload]: tradeToDelete, ...tradesById} = state.trades.tradesById;
        const allTradeIds = state.trades.allTradeIds.filter((tradeId) => tradeId !== action.payload);
        let products = state.products;
        if (previousTrade && previousTrade.productId) {
            products = {...products};
            // update export
            if (previousTrade.fromIslandId) {
                products[previousTrade.fromIslandId] = {...products[previousTrade.fromIslandId]};
                products[previousTrade.fromIslandId][previousTrade.productId] = {...products[previousTrade.fromIslandId][previousTrade.productId]};
                const {[action.payload]: _removed, ...remainingExports} = products[previousTrade.fromIslandId][previousTrade.productId].exports;
                products[previousTrade.fromIslandId][previousTrade.productId].exports = remainingExports;
            }
            // update import
            if (previousTrade.toIslandId) {
                products[previousTrade.toIslandId] = {...products[previousTrade.toIslandId]};
                products[previousTrade.toIslandId][previousTrade.productId] = {...products[previousTrade.toIslandId][previousTrade.productId]};
                const {[action.payload]: _removed, ...remainingImports} = products[previousTrade.toIslandId][previousTrade.productId].imports;
                products[previousTrade.toIslandId][previousTrade.productId].imports = remainingImports;
            }
        }
        return {
            ...state,
            products,
            trades: {
                tradesById,
                allTradeIds
            }
        }
    } else if (isActionOf(addTrade, action)) {
        const tradesById = {...state.trades.tradesById};
        let maxId = 0;
        for (let tradeId of state.trades.allTradeIds) {
            maxId = Math.max(maxId, tradeId);
        }
        const newTradeId = maxId + 1;
        tradesById[newTradeId] = {
            productId: 0,
            toIslandId: 0,
            fromIslandId: action.payload,
            tonsPerMinute: 0,
        };
        return {
            ...state,
            trades: {
                tradesById,
                allTradeIds: [...state.trades.allTradeIds, newTradeId]
            }
        }
    }
    return state;
}