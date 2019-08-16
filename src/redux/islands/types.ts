import {Action} from "redux";

export interface Island {
    name: string;
    id: number;
    population: { [level: string]: PopulationState }
}

export class PopulationState {
    // TODO: should this be in it's own reducer, or part of islandreducer?
    constructor(readonly level: string, readonly houses: number = 0, readonly population: number = 0) {
    }
}

export interface IslandState {
    islandsById: { [id: number]: Island };
    islandIds: number[];
}

export const ADD_ISLAND = 'ADD_ISLAND';
export const DELETE_ISLAND = 'DELETE_ISLAND';
export const UPDATE_HOUSES = 'UPDATE_HOUSES';
export const UPDATE_POPULATION = 'UPDATE_POPULATION';

export interface AddIslandAction extends Action {
    type: typeof ADD_ISLAND;
    name: string;
}

export interface DeleteIslandAction extends Action {
    type: typeof DELETE_ISLAND;
    id: number;
}

export interface UpdateHousesAction extends Action {
    type: typeof UPDATE_HOUSES;
    islandId: number;
    level: string;
    houses: number;
}
export interface UpdatePopulationAction extends Action {
    type: typeof UPDATE_POPULATION;
    islandId: number;
    level: string;
    population: number;
}

export type IslandActionTypes = AddIslandAction | DeleteIslandAction | UpdateHousesAction | UpdatePopulationAction;
