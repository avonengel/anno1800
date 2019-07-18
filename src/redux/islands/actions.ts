import {ADD_ISLAND, DELETE_ISLAND, IslandActionTypes} from "./types";

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