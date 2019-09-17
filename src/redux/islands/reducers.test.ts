import {initialState as initialRootState} from "../store";
import {createIsland, deleteIsland, renameIsland, selectNextIsland, selectPreviousIsland, updateHouseCount, updatePopulation} from "./actions";
import {islandReducer} from "./reducers";
import {POPULATION_LEVELS} from "../../data/assets";

describe("islandReducer", () => {
    describe("create island", () => {
        test("should create new island state entry", () => {
            // Arrange
            const initialState = {...initialRootState};
            const firstIslandId = initialState.selectedIsland;
            const islandName = "Other";

            // Act
            let state = islandReducer(initialState, createIsland(islandName));

            // Assert
            expect(state.island.islandIds).toHaveLength(2);
            const newIslandId = state.island.islandIds[1];
            expect(state.island.islandsById[newIslandId]).toStrictEqual({
                id: newIslandId,
                name: islandName,
                population: state.island.islandsById[firstIslandId].population,
            });
        });
    });

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
            const islandId = state.island.islandIds[state.island.islandIds.length - 1];

            // Act
            state = islandReducer(state, deleteIsland(islandId));

            // Assert
            expect(state).toStrictEqual(initialState);
        });
    });

    describe("update house count", () => {
        it("should set the house count", () => {
            // Arrange
            const initialState = {...initialRootState};
            const newHouseCount = 42;
            const popLevel = POPULATION_LEVELS[0];

            // Act
            let state = islandReducer(initialState, updateHouseCount(initialState.selectedIsland, popLevel, newHouseCount));

            // Assert
            expect(state.island.islandsById[state.selectedIsland].population[popLevel].houses).toBe(newHouseCount);
        });
    });

    describe("update population", () => {
        it("should set population count", () => {
            // Arrange
            const initialState = {...initialRootState};
            const newPopulationCount = 42;
            const popLevel = POPULATION_LEVELS[0];

            // Act
            let state = islandReducer(initialState, updatePopulation(initialState.selectedIsland, popLevel, newPopulationCount));

            // Assert
            expect(state.island.islandsById[state.selectedIsland].population[popLevel].population).toBe(newPopulationCount);
        });
    });

    describe("rename island", () => {
        it("should change the island name", () => {
            // Arrange
            const initialState = initialRootState;
            const firstIslandId = initialState.island.islandIds[0];
            const newName = "Other";
            const renameAction = renameIsland(firstIslandId, newName);

            // Act
            let state = islandReducer(initialState, renameAction);

            // Assert
            expect(state.island.islandsById[firstIslandId].name).toBe(newName);
        });
    });

    describe('select next island', function () {
        it('should select the next island, if there are multiple', function () {
            // Arrange
            const initialState = initialRootState;
            let state = islandReducer(initialState, createIsland("Other"));
            const otherIslandId = state.island.islandIds[1];

            // Act
            state = islandReducer(state, selectNextIsland());

            // Assert
            expect(state.selectedIsland).toBe(otherIslandId);
        });
        it('should do nothing, if there is only one island', function () {
            // Arrange
            const initialState = initialRootState;

            // Act
            let state = islandReducer(initialState, selectNextIsland());

            // Assert
            expect(state).toBe(initialState);
        });
    });
    describe('select previous island', function () {
        it('should select the previous island, if there are multiple', function () {
            // Arrange
            const initialState = initialRootState;
            let state = islandReducer(initialState, createIsland("Other"));
            state = islandReducer(state, createIsland("Other2"));
            const otherIslandId = state.island.islandIds[2];

            // Act
            state = islandReducer(state, selectPreviousIsland());

            // Assert
            expect(state.selectedIsland).toBe(otherIslandId);
        });
        it('should do nothing, if there is only one island', function () {
            // Arrange
            const initialState = initialRootState;

            // Act
            let state = islandReducer(initialState, selectPreviousIsland());

            // Assert
            expect(state).toBe(initialState);
        });
    });
});