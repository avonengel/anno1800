import {ADD_ISLAND, DELETE_ISLAND, IslandActionTypes, IslandState, PopulationLevels} from "./types";

const initialState: IslandState = {
    islandIds: [1],
    islandsById: {
        1: {
            id: 1,
            name: "Ditchwater",
            population: PopulationLevels.reduce((map: { [level: string]: number }, level: string) => {
                map[level] = 5;
                return map;
            }, {}),
        }
    }
};

export function islandReducer(state = initialState, action: IslandActionTypes): IslandState {
    switch (action.type) {
        case DELETE_ISLAND:
            // TODO implement deletion
            return state;
        case ADD_ISLAND:
            return {
                islandsById: {
                    ...state.islandsById,
                    42: {
                        name: action.name,
                        id: 42,
                        population: PopulationLevels.reduce((map: { [level: string]: number }, level: string) => {
                            map[level] = 0;
                            return map;
                        }, {}),
                    }
                },
                islandIds: [...state.islandIds, 42]
            };
        default:
            return state;
    }
}