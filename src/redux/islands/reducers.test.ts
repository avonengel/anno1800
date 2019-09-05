import {initialState as initialRootState} from "../store";
import {createIsland, deleteIsland} from "./actions";
import {islandReducer} from "./reducers";

describe('islandReducer', () => {
    describe('delete island', () => {
        test('should not delete last island', () => {
            // Arrange
            const initialState = {...initialRootState};
            const firstIslandId = initialState.selectedIsland;

            // Act
            let state = islandReducer(initialState, deleteIsland(firstIslandId));

            // Assert
            expect(state).toBe(initialState);
        });
        test('should delete the island and the ID', () => {
            // Arrange
            const initialState = {...initialRootState};

            // create another island, so we can delete one at the end
            let state = islandReducer(initialState, createIsland('other'));
            const islandId = state.island.islandIds[state.island.islandIds.length-1];

            // Act
            state = islandReducer(state, deleteIsland(islandId));

            // Assert
            expect(state).toStrictEqual(initialState);
        });
    });
});