import {PopulationLevelName, POPULATION_LEVELS} from "../../data/populations";

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

interface AddIslandAction {
    type: typeof ADD_ISLAND;
    name: string;
}

interface DeleteIslandAction {
    type: typeof DELETE_ISLAND;
    id: number;
}

interface UpdateHousesAction {
    type: typeof UPDATE_HOUSES;
    islandId: number;
    level: string;
    houses: number;
}

export type IslandActionTypes = AddIslandAction | DeleteIslandAction | UpdateHousesAction;
