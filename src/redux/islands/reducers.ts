import {ADD_ISLAND, DELETE_ISLAND, IslandState, PopulationState, UPDATE_HOUSES, UPDATE_POPULATION, UpdatePopulationAction} from "./types";
import {AnyAction} from "redux";
import {getHouses, getPopulation, getPopulationLevelByName, POPULATION_LEVELS} from "../../data/assets"
import {initialState as initialRootState, RootState} from "../store";
import {ProductState} from "../production/types";
import {getProduction} from "../production/reducers";

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
        },
    }
};

function getEnabledProducts(products: {[productId: number]: ProductState}) {
    if (!products) {
        return [];
    }
    const result = [];
    for (let productId in products) {
        const productState = products[productId];
        if (productState) {
            if (getProduction(productState) > 0) {
                // FIXME how to do this properly?
                result.push(Number(productId));
            }
        }
    }
    return result;
}

export function islandReducer(state: RootState = initialRootState, action: AnyAction): RootState {
    if (!state) {
        return initialRootState;
    }
    switch (action.type) {
        case DELETE_ISLAND:
            // TODO implement deletion
            return state;
        case ADD_ISLAND:
            const newId = Math.max(...state.island.islandIds) + 1;
            return {
                ...state,
                island: {
                    islandsById: {
                        ...state.island.islandsById,
                        [newId]: {
                            name: action.name,
                            id: newId,
                            population: newPopulationStateObject(),
                        }
                    },
                    islandIds: [...state.island.islandIds, newId]
                }
            };
        case UPDATE_HOUSES:
            const {islandId, level, houses} = action;
            const result = {
                ...state,
                island: {
                    ...state.island,
                    islandsById: {
                        ...state.island.islandsById,
                    }
                }
            };
            result.island.islandsById[islandId] = {
                ...state.island.islandsById[islandId],
            };
            result.island.islandsById[islandId].population = {
                ...result.island.islandsById[islandId].population,
            };
            const old = result.island.islandsById[islandId].population[level];
            const popLevel = getPopulationLevelByName(level);
            let population = old.population;
            if (popLevel) {
                population = getPopulation(popLevel, houses, getEnabledProducts(state.products[islandId]));
            }
            result.island.islandsById[islandId].population[level] = new PopulationState(level, houses, population);
            return result;
        case UPDATE_POPULATION:
            const popAction = action as UpdatePopulationAction;
            const islandState = {...state.island};
            islandState.islandsById = {...islandState.islandsById};
            islandState.islandsById[popAction.islandId] = {...islandState.islandsById[popAction.islandId]};
            islandState.islandsById[popAction.islandId].population = {...islandState.islandsById[popAction.islandId].population};
            islandState.islandsById[popAction.islandId].population[popAction.level] = {
                ...islandState.islandsById[popAction.islandId].population[popAction.level],
                population: popAction.population,
                houses: getHouses(getPopulationLevelByName(popAction.level), popAction.population, getEnabledProducts(state.products[popAction.islandId]))
            };

            return {...state, island: islandState};
        default:
            return state;
    }
}