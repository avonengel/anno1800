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

export const UPDATE_HOUSES = 'UPDATE_HOUSES';
export const UPDATE_POPULATION = 'UPDATE_POPULATION';

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

export type IslandActionTypes = UpdateHousesAction | UpdatePopulationAction;
