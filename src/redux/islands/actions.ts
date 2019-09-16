import {IslandActionTypes, UPDATE_HOUSES, UPDATE_POPULATION} from "./types";
import {createCustomAction, createStandardAction} from "typesafe-actions";

export const createIsland = createStandardAction("islands/CREATE")<string>();

export const deleteIsland = createStandardAction("islands/DELETE")<number>();

export const selectIsland = createStandardAction("islands/SELECT")<number>();

export function updateHouseCount(id: number, level: string, houses: number): IslandActionTypes {
    return {
        type: UPDATE_HOUSES,
        islandId: id,
        level,
        houses,
    }
}

export function updatePopulation(id: number, level: string, population: number): IslandActionTypes {
    return {
        type: UPDATE_POPULATION,
        islandId: id,
        level,
        population,
    }
}

export const renameIsland = createCustomAction("islands/RENAME",
    type => (islandId: number, name: string) => ({
        type,
        payload: {islandId, name}
    }));

export const selectPreviousIsland = createStandardAction("islands/SELECT_PREVIOUS")();
export const selectNextIsland = createStandardAction("islands/SELECT_NEXT")();
