import {FactoryState, ProductState} from "./types";
import {getFactoryStateByIdOrDefault} from "../selectors";
import {getType, isActionOf, isOfType} from "typesafe-actions";
import {updateFactoryCount, updateFactoryProductivity} from "./actions";
import {FACTORIES_BY_ID, getPopulationLevelByName} from "../../data/assets";
import iassign from "immutable-assign";
import {deleteIsland, updateHouseCount, updatePopulation} from "../islands/actions";
import {RootAction} from "../types";
import {RootState} from "../root-state";

const initialProductState = {
    factoryConsumers: {},
    populationConsumers: {},
    producers: {},
};

export function populationConsumptionReducer(state: RootState, action: RootAction): RootState {
    if (isActionOf([updateHouseCount, updatePopulation], action)) {
        const {islandId, level: levelName} = action;
        if (!!state.island) {
            const level = getPopulationLevelByName(levelName);
            const people = state.island.islandsById[islandId].population[levelName].population;
            const houses = state.island.islandsById[islandId].population[levelName].houses;
            if (level) {
                const products = {...state.products};
                const islandProductStates = {...products[islandId]} || {};
                products[islandId] = islandProductStates;

                level.inputs.forEach((input) => {
                    if (input.amount) {
                        let productState = {...(islandProductStates[input.product] || initialProductState)};
                        islandProductStates[input.product] = productState;
                        productState.populationConsumers = {...productState.populationConsumers};
                        if (input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < people) {
                            productState.populationConsumers[level.name] = input.amount * houses * 60;
                        } else {
                            productState.populationConsumers[level.name] = 0;
                        }
                    }
                });
                return {
                    ...state,
                    products
                };
            }
        }
    } else if (isActionOf(deleteIsland, action)) {
        const {[action.payload]: _, ...products} = state.products;
        return {
            ...state,
            products
        }
    }
    return state;
}

const initialFactoryState: FactoryState = {
    buildingCount: 0,
    productivity: 1,
};

export function factoryReducer(state: RootState, action: RootAction): RootState {
    if (isActionOf([updateFactoryCount, updateFactoryProductivity], action)) {
        const {islandId, factoryId} = action.payload;
        const factories = {...state.factories};
        const islandFactories = {...factories[islandId]};
        factories[islandId] = islandFactories;
        const factoryState = {...(islandFactories[factoryId] || initialFactoryState)};
        islandFactories[factoryId] = factoryState;

        if (isOfType(getType(updateFactoryCount), action)) {
            factoryState.buildingCount = action.payload.count;
        } else if (isOfType(getType(updateFactoryProductivity), action)) {
            factoryState.productivity = action.payload.productivity;
        }

        return {
            ...state,
            factories
        }
    } else if (isActionOf(deleteIsland, action)) {
        return iassign(state, state => state.factories, factoryState => {
            const {[action.payload]: _, ...result} = factoryState;
            return result;
        });
    }
    return state;
}

export function factoryProductionConsumptionReducer(state: RootState, action: RootAction) {
    if (isActionOf([updateFactoryCount, updateFactoryProductivity], action)) {
        const {islandId, factoryId} = action.payload;
        // recompute production for factoryId
        const factoryState = getFactoryStateByIdOrDefault(state, islandId, factoryId);
        const factoryDefinition = FACTORIES_BY_ID.get(factoryId);
        if (!factoryDefinition) {
            console.error("factoryProductionConsumptionReducer called with nonexistend factory ID", factoryId);
            return state;
        }
        const products = {...state.products};
        const islandProductMap = {...products[islandId as number]};
        products[islandId] = islandProductMap;

        if (factoryDefinition.output) {
            const productId = factoryDefinition.output;
            const productState = {...islandProductMap[productId]};
            islandProductMap[productId] = productState;
            let cycleTime = factoryDefinition.cycleTime;
            if (!cycleTime) {
                cycleTime = 30;
            }
            const productionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime);
            const producers = {...productState.producers};
            productState.producers = producers;
            producers[factoryId] = productionPerMinute;
        }
        // recompute consumption for factoryId
        if (factoryDefinition.inputs) {
            factoryDefinition.inputs.forEach(input => {
                const productId = input;
                const productState = {...islandProductMap[productId]};
                islandProductMap[productId] = productState;
                let cycleTime = factoryDefinition.cycleTime;
                if (!cycleTime) {
                    cycleTime = 30;
                }
                const consumptionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime);
                const consumers = {...productState.factoryConsumers};
                productState.factoryConsumers = consumers;
                consumers[factoryId] = consumptionPerMinute;
            });
        }
        return {
            ...state,
            products
        };
    }
    return state;
}

export function getProduction(productState: ProductState, excludedProducerId?: number): number {
    let production = 0;
    for (let factoryId in productState.producers) {
        if (Number(factoryId) !== excludedProducerId) {
            production += productState.producers[factoryId];
        }
    }
    for (let tradeId in productState.imports) {
        production += productState.imports[tradeId];
    }
    return production;
}