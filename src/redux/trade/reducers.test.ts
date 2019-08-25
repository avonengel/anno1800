import {tradeReducer} from './reducers';
import {initialState as initialRootState} from "../store";
import {addTrade, updateTradeIslands, updateTradeProduct} from "./actions";
import {createIsland} from "../islands/actions";
import {islandReducer} from "../islands/reducers";

describe('tradeReducer', () => {
    test('create new trade, select product before other island', () => {
        // Arrange
        const initialState = {...initialRootState};
        const firstIslandId = initialState.selectedIsland;
        let state = tradeReducer(initialState, addTrade(1));
        const tradeId = 1; // just assume that the created trade uses id 1
        state = {...state, island: islandReducer(state.island, createIsland('Other'))};
        const otherIslandId = state.island.islandIds[state.island.islandIds.length - 1];
        state = tradeReducer(state, updateTradeProduct(tradeId, 1010200));

        // Act
        state = tradeReducer(state, updateTradeIslands(tradeId, firstIslandId, otherIslandId));

        // Assert
        expect(state.trades[1]).toEqual({"fromIslandId": firstIslandId, "productId": 1010200, "toIslandId": otherIslandId, "tonsPerMinute": 0});
    });
});
