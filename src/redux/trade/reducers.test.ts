import {tradeReducer} from './reducers';
import {addTrade, updateTradeIslands, updateTradeProduct} from "./actions";
import {createIsland, deleteIsland} from "../islands/actions";
import {islandReducer} from "../islands/reducers";
import {populationConsumptionReducer} from "../production/reducers";
import {initialState, RootState} from "../root-state";

describe('tradeReducer', () => {
    test('create new trade, select product before other island', () => {
        // Arrange
        const firstIslandId = initialState.selectedIsland;
        let state = tradeReducer(initialState, addTrade(1));
        const tradeId = state.trades.allTradeIds[0];
        state = islandReducer(state, createIsland('Other'));
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
        // Add island 'Other'
        let state: RootState = islandReducer(initialState, createIsland('Other'));
        const firstIslandId = initialState.selectedIsland;
        const secondIslandId = state.island.islandIds[state.island.islandIds.length-1];
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
        expect(state.trades).toMatchSnapshot();
    });

    test('create new trade, inverse im/export, select product, select island', () => {
        // Arrange
        // Add island 'Other'
        let state: RootState = islandReducer(initialState, createIsland('Other'));
        const firstIslandId = initialState.selectedIsland;
        const secondIslandId = state.island.islandIds[state.island.islandIds.length-1];
        // Add trade
        state = tradeReducer(state, addTrade(firstIslandId));
        const tradeId = state.trades.allTradeIds[0];
        // Inverse im/export
        state = tradeReducer(state, updateTradeIslands(tradeId, state.trades.tradesById[tradeId].toIslandId, firstIslandId));
        // Set product
        state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

        // Act
        state = tradeReducer(state, updateTradeIslands(tradeId, secondIslandId, firstIslandId));

        // Assert
        expect(state.trades).toMatchSnapshot();
    });

    describe('delete island', () => {
        test('should delete affected trades', () => {
            // Arrange
            // Add island 'Other'
            let state: RootState = islandReducer(initialState, createIsland('Other'));
            const firstIslandId = initialState.selectedIsland;
            const secondIslandId = state.island.islandIds[state.island.islandIds.length-1];
            // Add trade
            state = tradeReducer(state, addTrade(firstIslandId));
            const tradeId = state.trades.allTradeIds[0];
            state = tradeReducer(state, updateTradeIslands(tradeId, firstIslandId, secondIslandId));
            state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

            // Act
            state = tradeReducer(state, deleteIsland(secondIslandId));

            // Assert
            expect(state.trades.allTradeIds).toHaveLength(0);
            expect(state.trades.tradesById).toStrictEqual({});
        });

        it("should delete exports from the other island", () => {
            // Arrange
            // Add island 'Other'
            let state: RootState = islandReducer(initialState, createIsland('Other'));
            const firstIslandId = initialState.selectedIsland;
            const secondIslandId = state.island.islandIds[state.island.islandIds.length-1];
            // Add trade
            state = tradeReducer(state, addTrade(firstIslandId));
            const tradeId = state.trades.allTradeIds[0];
            state = tradeReducer(state, updateTradeIslands(tradeId, firstIslandId, secondIslandId));
            state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));


            // Act
            const deleteIslandAction = deleteIsland(secondIslandId);
            state = islandReducer(state, deleteIslandAction);
            state = populationConsumptionReducer(state, deleteIslandAction);
            state = tradeReducer(state, deleteIslandAction);

            // Assert
            expect(state.products[firstIslandId][1010200].exports).toStrictEqual({});
        });

        it("should delete imports from the other island", () => {
            // Arrange
            // Add island 'Other'
            let state: RootState = islandReducer(initialState, createIsland('Other'));
            const firstIslandId = initialState.selectedIsland;
            const secondIslandId = state.island.islandIds[state.island.islandIds.length-1];
            // Add trade
            state = tradeReducer(state, addTrade(firstIslandId));
            const tradeId = state.trades.allTradeIds[0];
            state = tradeReducer(state, updateTradeIslands(tradeId, secondIslandId, firstIslandId));
            state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));


            // Act
            const deleteIslandAction = deleteIsland(secondIslandId);
            state = islandReducer(state, deleteIslandAction);
            state = populationConsumptionReducer(state, deleteIslandAction);
            state = tradeReducer(state, deleteIslandAction);

            // Assert
            expect(state.products[firstIslandId][1010200].imports).toStrictEqual({});
        });
    });
});
