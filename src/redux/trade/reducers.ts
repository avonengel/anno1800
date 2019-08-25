import {isActionOf} from "typesafe-actions";
import {addTrade, deleteTrade, updateTonsPerMinute, updateTradeIslands, updateTradeProduct} from "./actions";
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
};

export function tradeReducer(state: RootState, action: AnyAction) {
    if (isActionOf(updateTradeIslands, action)) {
        const previousTrade = state.trades[action.payload.tradeId];
        const trade = {
            ...previousTrade,
            fromIslandId: action.payload.fromIslandId,
            toIslandId: action.payload.toIslandId,
        };
        const products = {...state.products};
        if (previousTrade && trade.productId && previousTrade.fromIslandId !== action.payload.fromIslandId) {
            // delete the old export
            const productState = {...products[previousTrade.fromIslandId][previousTrade.productId]};
            const {[action.payload.tradeId]: _, ...newExports} = productState.exports;
            productState.exports = newExports;
            products[previousTrade.fromIslandId] = {
                ...products[previousTrade.fromIslandId],
                [previousTrade.productId]: productState,
            };
            // create the new export
            const newProductState = {...products[action.payload.fromIslandId][trade.productId]};
            newProductState.exports = {
                ...newProductState.exports,
                [action.payload.tradeId]: trade.tonsPerMinute,
            };
            products[trade.fromIslandId] = {
                ...products[trade.fromIslandId],
                [trade.productId]: newProductState,
            }
        }
        if (previousTrade && trade.productId && previousTrade.toIslandId !== action.payload.toIslandId) {
            // delete the old import
            products[previousTrade.toIslandId] = {...products[previousTrade.toIslandId]};
            products[previousTrade.toIslandId][previousTrade.productId] = {...products[previousTrade.toIslandId][previousTrade.productId]};
            const {[action.payload.tradeId]: _, ...newImports} = products[previousTrade.toIslandId][previousTrade.productId].imports;
            products[previousTrade.toIslandId][previousTrade.productId].imports = newImports;
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
        return {
            ...state,
            products,
            trades: {
                ...state.trades,
                [action.payload.tradeId]: trade
            }

        };
    } else if (isActionOf(updateTradeProduct, action)) {
        const previousTrade = state.trades[action.payload.tradeId];
        const trade = {
            ...state.trades[action.payload.tradeId],
            productId: action.payload.productId,
        };
        let products = state.products;
        if (previousTrade && previousTrade.productId) {
            products = {...products};
            if (previousTrade.fromIslandId) {
                const exportIslandProducts = {...products[previousTrade.fromIslandId]};
                products[previousTrade.fromIslandId] = exportIslandProducts;
                // delete the old export
                const previousExportProductState = {...exportIslandProducts[previousTrade.productId]};
                exportIslandProducts[previousTrade.productId] = previousExportProductState;
                const {[action.payload.tradeId]: _, ...remainingPreviousExports} = previousExportProductState.exports;
                previousExportProductState.exports = remainingPreviousExports;
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
                // delete the old import
                const previousImportProductState = {...importIslandProducts[previousTrade.productId]};
                importIslandProducts[previousTrade.productId] = previousImportProductState;
                const {[action.payload.tradeId]: _remove, ...remainingPreviousImports} = previousImportProductState.imports;
                previousImportProductState.imports = remainingPreviousImports;
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
                [action.payload.tradeId]: trade
            }
        };
    } else if (isActionOf(updateTonsPerMinute, action)) {
        const previousTrade = state.trades[action.payload.tradeId];
        const trade = {
            ...state.trades[action.payload.tradeId],
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
                [action.payload.tradeId]: trade
            }
        };
    } else if (isActionOf(deleteTrade, action)) {
        const previousTrade = state.trades[action.payload];
        const {[action.payload]: tradeToDelete, ...trades} = state.trades;
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
            trades: trades
        }
    } else if (isActionOf(addTrade, action)) {
        const trades = {...state.trades};
        let maxId = 0;
        for (let tradeId in trades) {
            // TODO: introduce allTradeIds: number[] instead of this BS
            maxId = Math.max(maxId, Number(tradeId));
        }
        trades[maxId + 1] = {
            productId: 0,
            toIslandId: 0,
            fromIslandId: action.payload,
            tonsPerMinute: 0,
        };
        return {
            ...state,
            trades
        }
    }
    return state;
}