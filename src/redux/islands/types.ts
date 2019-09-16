export interface Island {
    name: string;
    id: number;
    population: { [level: string]: PopulationState }
}

export interface PopulationState {
    readonly level: string;
    readonly houses: number;
    readonly population: number;
}

export interface IslandState {
    islandsById: { [id: number]: Island };
    islandIds: number[];
}
