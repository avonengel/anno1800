import {factoryReducer, populationConsumptionReducer} from './reducers';
import {initialState as initialRootState} from "../store";
import {createIsland, deleteIsland, updatePopulation} from "../islands/actions";
import {islandReducer} from "../islands/reducers";
import {ALL_FACTORIES, POPULATION_LEVELS} from "../../data/assets";
import {updateFactoryCount} from "./actions";

describe('populationConsumptionReducer', () => {
    describe('delete island', () => {
        test('should not delete last island', () => {
            // Arrange
            const initialState = {...initialRootState};
            const firstIslandId = initialState.selectedIsland;

            // Act
            let state = populationConsumptionReducer(initialState, deleteIsland(firstIslandId));

            // Assert
            expect(state).toStrictEqual(initialState);
        });
        test('should delete whole island product state tree', () => {
            // Arrange
            const initialState = {...initialRootState};

            // create another island, so we can delete one at the end
            let state = islandReducer(initialState, createIsland('other'));
            const islandId = state.island.islandIds[state.island.islandIds.length-1];

            // touch product state
            const populationChange = updatePopulation(islandId, POPULATION_LEVELS[0], 10);
            state = islandReducer(state, populationChange);
            state = populationConsumptionReducer(state, populationChange);

            // Act
            const deleteAction = deleteIsland(islandId);
            state = islandReducer(state, deleteAction);
            state = populationConsumptionReducer(state, deleteAction);

            // Assert
            expect(state).toStrictEqual(initialState);
        });
    });
});

describe("factoryReducer", () => {
    describe("delete island", () => {
        it("should delete factory state for the island", () => {
            // Arrange
            const initialState = {...initialRootState};

            // create another island, so we can delete one at the end
            let state = islandReducer(initialState, createIsland('other'));
            const islandId = state.island.islandIds[state.island.islandIds.length-1];

            // touch factory state
            const factoryChange = updateFactoryCount(islandId, ALL_FACTORIES[0].guid, 1);
            state = factoryReducer(state, factoryChange);

            // Act
            const deleteAction = deleteIsland(islandId);
            state = islandReducer(state, deleteAction);
            state = factoryReducer(state, deleteAction);

            // Assert
            expect(state).toStrictEqual(initialState);
        });
    });
});