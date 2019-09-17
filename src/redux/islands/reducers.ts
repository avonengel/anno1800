import {IslandState, PopulationState} from "./types";
import {getHouses, getPopulation, getPopulationLevelByName, POPULATION_LEVELS} from "../../data/assets"
import {initialState as initialRootState} from "../store";
import {ProductState} from "../production/types";
import {getProduction} from "../production/reducers";
import {createReducer} from "typesafe-actions";
import {createIsland, deleteIsland, renameIsland, selectNextIsland, selectPreviousIsland, updateHouseCount, updatePopulation} from "./actions";
import iassign from "immutable-assign";

function newPopulationStateObject() {
    return POPULATION_LEVELS.reduce((map: { [level: string]: PopulationState }, level: string) => {
        map[level] = {level, houses: 0, population: 0};
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

function getEnabledProducts(products: { [productId: number]: ProductState }, excludedFactoryId?: number) {
    if (!products) {
        return [];
    }
    const result: number[] = [];
    for (let productId in products) {
        const productState = products[productId];
        if (productState) {
            if (getProduction(productState, excludedFactoryId) > 0) {
                result.push(Number(productId));
            }
        }
    }
    return result;
}

function selectNextIslandId(islandIds: number[], currentIslandId: number) {
    const currentIndex = islandIds.findIndex(value => value === currentIslandId);
    let selectedIsland = islandIds[0];
    if (currentIndex + 1 < islandIds.length) {
        selectedIsland = islandIds[currentIndex + 1];
    }
    return selectedIsland;
}

function selectPreviousIslandId(islandIds: number[], currentIslandId: number) {
    const currentIndex = islandIds.findIndex(value => value === currentIslandId);
    let selectedIsland = islandIds[islandIds.length - 1];
    if (currentIndex - 1 >= 0) {
        selectedIsland = islandIds[currentIndex - 1];
    }
    return selectedIsland;
}

// if (isActionOf(updateFactoryCount, action)) {
//     const {count, factoryId, islandId} = action.payload;
//     const factoryOutputProduct = getFactoryById(factoryId).output;
//     // TODO honor input.noSupplyWeightCount
//     // TODO there may be unwanted changes to population count: set population count manually, then start to add required factories in the tool -> population count is reset based on invalid house count computation from before!
//     // idea to solve that: add an 'Options' or 'Settings' card that contains a toggle to disable computing population from houses & available products. Might as well disable the house count in general
//     const affectedPopulationAssets = POPULATION_LEVELS
//         .filter(level => state.island.islandsById[islandId].population[level] !== undefined
//             && state.island.islandsById[islandId].population[level].population > 0)
//         .map(getPopulationLevelByName)
//         .filter(popAsset => popAsset.inputs.some(input => input.product === factoryOutputProduct && input.supplyWeight));
//     if (affectedPopulationAssets.length === 0) {
//         return state;
//     }
//     // get enabled products, but exclude the changed factory ID
//     const enabledProducts = getEnabledProducts(state.products[islandId], factoryId);
//     if (count > 0) {
//         // if factories will exist in new state, add enabled product ID locally
//         enabledProducts.push(factoryOutputProduct);
//     }
//     return iassign(state, (i, context) => i.island.islandsById[context.islandId].population, populations => {
//         affectedPopulationAssets.forEach(asset => {
//             populations[asset.name] = {
//                 ...populations[asset.name],
//                 population: getPopulation(asset, populations[asset.name].houses, enabledProducts),
//             };
//         });
//         return populations;
//     }, {islandId});
// }

export const islandReducer = createReducer(initialRootState)
    .handleAction(renameIsland, (state, action) => {
        const {islandId, name} = action.payload;
        return {
            ...state,
            island: {
                ...state.island,
                islandsById: {
                    ...state.island.islandsById,
                    [islandId]: {
                        ...state.island.islandsById[islandId],
                        name
                    }
                }
            }
        };
    })
    .handleAction(selectNextIsland, state => {
        const islandIds = state.island.islandIds;
        if (islandIds.length > 1) {
            const selectedIsland = selectNextIslandId(islandIds, state.selectedIsland);
            return {
                ...state,
                selectedIsland
            };
        }
        return state;
    })
    .handleAction(selectPreviousIsland, state => {
        const islandIds = state.island.islandIds;
        if (islandIds.length > 1) {
            let selectedIsland = selectPreviousIslandId(islandIds, state.selectedIsland);
            return {
                ...state,
                selectedIsland
            };
        }
        return state;
    })
    .handleAction(createIsland, (state, action) => {
        const newId = Math.max(...state.island.islandIds) + 1;
        return {
            ...state,
            island: {
                islandsById: {
                    ...state.island.islandsById,
                    [newId]: {
                        name: action.payload,
                        id: newId,
                        population: newPopulationStateObject(),
                    }
                },
                islandIds: [...state.island.islandIds, newId]
            }
        };
    })
    .handleAction(deleteIsland, (state, action) => {
        if (state.island.islandIds.length > 1) {
            const selectedIsland = action.payload === state.selectedIsland ? selectPreviousIslandId(state.island.islandIds, state.selectedIsland) : state.selectedIsland;
            const {[action.payload]: _, ...islandsById} = state.island.islandsById;
            const islandIds = state.island.islandIds.filter(islandId => islandId !== action.payload);
            return {
                ...state,
                island: {
                    islandIds,
                    islandsById
                },
                selectedIsland
            }
        }
        return state;
    })
    .handleAction(updateHouseCount, (state, action) => {
        const {islandId, level, houses} = action;
        let population = getPopulation(getPopulationLevelByName(level), houses, getEnabledProducts(state.products[islandId]));
        return iassign(state,
            state => state.island.islandsById[islandId].population[level],
            () => ({level, houses, population}));
    })
    .handleAction(updatePopulation, (state, action) => {
        const {islandId, level, population} = action;
        const houses = getHouses(getPopulationLevelByName(level), population, getEnabledProducts(state.products[islandId]));
        return iassign(state,
            state => state.island.islandsById[islandId].population[level],
            () => ({level, houses, population}));
    });
