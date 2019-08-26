import {tradeReducer} from './reducers';
import {initialState as initialRootState, RootState} from "../store";
import {addTrade, updateTradeIslands, updateTradeProduct} from "./actions";
import {createIsland} from "../islands/actions";
import {islandReducer} from "../islands/reducers";

describe('tradeReducer', () => {
    test('create new trade, select product before other island', () => {
        // Arrange
        const initialState = {...initialRootState};
        const firstIslandId = initialState.selectedIsland;
        let state = tradeReducer(initialState, addTrade(1));
        const tradeId = state.trades.allTradeIds[0];
        state = {...state, island: islandReducer(state.island, createIsland('Other'))};
        const otherIslandId = state.island.islandIds[state.island.islandIds.length - 1];
        state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

        // Act
        state = tradeReducer(state, updateTradeIslands(tradeId, firstIslandId, otherIslandId));

        // Assert
        expect(state.trades.tradesById[1]).toEqual({"fromIslandId": firstIslandId, "productId": 1010200, "toIslandId": otherIslandId, "tonsPerMinute": 0});
        expect(state.products[firstIslandId][1010200]).toBeDefined();
        expect(state.products[otherIslandId][1010200]).toBeDefined();
    });

    test('create new trade, select island, select product, inverse im/export', () => {
         // Arrange
        const initialState = {...initialRootState};
        // Add island 'Other'
        let state: RootState = {...initialState, island: islandReducer(initialState.island, createIsland('Other'))};
        const firstIslandId = initialState.selectedIsland;
        const secondIslandId = state.island.islandIds[-1];
        // Add trade
        state = tradeReducer(state, addTrade(firstIslandId));
        const tradeId = state.trades.allTradeIds[0];
        // Set 'Other' island as target
        state = tradeReducer(state, updateTradeIslands(tradeId, firstIslandId, secondIslandId));
        // Set product
        state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

        // Act
        state = tradeReducer(state, updateTradeIslands(tradeId, secondIslandId, firstIslandId));

        // Assert
        // TODO
    });

    test('create new trade, inverse im/export, select product, select island', () => {
        // Arrange
        const initialState = {...initialRootState};
        // Add island 'Other'
        let state: RootState = {...initialState, island: islandReducer(initialState.island, createIsland('Other'))};
        const firstIslandId = initialState.selectedIsland;
        const secondIslandId = state.island.islandIds[-1];
        // Add trade
        state = tradeReducer(state, addTrade(firstIslandId));
        const tradeId = state.trades.allTradeIds[0];
        // Inverse im/export
        state = tradeReducer(state, updateTradeIslands(tradeId, state.trades.tradesById[tradeId].toIslandId, firstIslandId));
        // Set product
        state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

        // Act
        state = tradeReducer(state, updateTradeIslands(tradeId, secondIslandId, firstIslandId));
    });
});
