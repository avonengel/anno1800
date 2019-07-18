export const PopulationLevels = [
    "Farmers",
    "Workers",
    "Artisans",
];
export interface Island {
    name: string;
    id: number;
    population: { [level: string]: number }
}

export interface IslandState {
    islandsById: { [id: number]: Island };
    islandIds: number[];
}

export const ADD_ISLAND = 'ADD_ISLAND';
export const DELETE_ISLAND = 'DELETE_ISLAND';

interface AddIslandAction {
    type: typeof ADD_ISLAND;
    name: string;
}

interface DeleteIslandAction {
    type: typeof DELETE_ISLAND;
    id: number;
}

export type IslandActionTypes = AddIslandAction | DeleteIslandAction;
