import {
    ADD_ISLAND,
    DELETE_ISLAND,
    IslandState,
    PopulationState,
    UPDATE_HOUSES,
    UPDATE_POPULATION,
    UpdatePopulationAction
} from "./types";
import {getPopulation, getPopulationLevelByName, POPULATION_LEVELS} from "../../data/populations";
import {AnyAction} from "redux";

function newPopulationStateObject() {
    return POPULATION_LEVELS.reduce((map: { [level: string]: PopulationState }, level: string) => {
        map[level] = new PopulationState(level);
        return map;
    }, {});
}

export const initialState: IslandState = {
    islandIds: [1],
    islandsById: {
        1: {
            id: 1,
            name: "Ditchwater",
            population: newPopulationStateObject(),
        }
    }
};

export function islandReducer(state = initialState, action: AnyAction): IslandState {
    if (!state) {
        return initialState;
    }
    switch (action.type) {
        case DELETE_ISLAND:
            // TODO implement deletion
            return state;
        case ADD_ISLAND:
            const newId = Math.max(...state.islandIds) + 1;
            return {
                islandsById: {
                    ...state.islandsById,
                    [newId]: {
                        name: action.name,
                        id: newId,
                        population: newPopulationStateObject(),
                    }
                },
                islandIds: [...state.islandIds, newId]
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
        case UPDATE_POPULATION:
            const popAction = action as UpdatePopulationAction;
            const islandState = {...state};
            const islandsById = {...islandState.islandsById};
            islandState.islandsById = islandsById;
            const island = {...islandsById[popAction.islandId]};
            islandsById[popAction.islandId] = island;
            const islandPopulation = {...island.population};
            island.population = islandPopulation;
            const populationState = {...islandPopulation[popAction.level]};
            islandPopulation[popAction.level] = populationState;
            populationState.population = popAction.population;
            return islandState;
        default:
            return state;
    }
}