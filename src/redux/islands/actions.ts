import {ADD_ISLAND, DELETE_ISLAND, IslandActionTypes, UPDATE_HOUSES, UPDATE_POPULATION} from "./types";

export function createIsland(name: string): IslandActionTypes {
    return {
        type: ADD_ISLAND,
        name: name
    }
}

export function deleteIsland(id: number): IslandActionTypes {
    return {
        type: DELETE_ISLAND,
        id: id
    }
}

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
