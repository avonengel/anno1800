import {ADD_ISLAND, DELETE_ISLAND, IslandActionTypes, UPDATE_HOUSES} from "./types";

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
