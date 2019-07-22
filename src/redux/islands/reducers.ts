import {ADD_ISLAND, DELETE_ISLAND, IslandActionTypes, IslandState, PopulationState, UPDATE_HOUSES} from "./types";
import {getPopulation, getPopulationLevelByName, POPULATION_LEVELS} from "../../data/populations";

function newPopulationStateObject() {
    return POPULATION_LEVELS.reduce((map: { [level: string]: PopulationState }, level: string) => {
        map[level] = new PopulationState(level);
        return map;
    }, {});
}

const initialState: IslandState = {
    islandIds: [1],
    islandsById: {
        1: {
            id: 1,
            name: "Ditchwater",
            population: newPopulationStateObject(),
        }
    }
};

export function islandReducer(state = initialState, action: IslandActionTypes): IslandState {
    if (!state) {
        return initialState;
    }
    switch (action.type) {
        case DELETE_ISLAND:
            // TODO implement deletion
            return state;
        case ADD_ISLAND:
            return {
                // TODO generate unique ID
                islandsById: {
                    ...state.islandsById,
                    42: {
                        name: action.name,
                        id: 42,
                        population: newPopulationStateObject(),
                    }
                },
                islandIds: [...state.islandIds, 42]
            };
        case UPDATE_HOUSES:
            const {islandId, level, houses} = action;
            const result = {
                ...state,
                islandsById: {
                    ...state.islandsById,
                }
            };
            result.islandsById[islandId] = {
                ...state.islandsById[islandId],
            };
            result.islandsById[islandId].population = {
                ...result.islandsById[islandId].population,
            };
            const old = result.islandsById[islandId].population[level];
            const popLevel = getPopulationLevelByName(level);
            let population = old.population;
            if (popLevel) {
                population = getPopulation(popLevel, houses, []);
            }
            result.islandsById[islandId].population[level] = new PopulationState(level, houses, population);
            return result;
        default:
            return state;
    }
}