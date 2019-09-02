import {RootState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UPDATE_POPULATION} from "../islands/types";
import {getPopulationLevelByName} from "../../data/populations";
import {FactoryState} from "./types";
import {getFactoryStateByIdOrDefault} from "../selectors";
import {getType, isActionOf, isOfType} from "typesafe-actions";
import {FactoryActions, updateFactoryCount, updateFactoryProductivity} from "./actions";
import {FACTORIES_BY_ID} from "../../data/factoryTypes";
import {PopulationAsset} from "../../data/populationTypes";

const initialProductState = {
    factoryConsumers: {},
    populationConsumers: {},
    producers: {},
};

function getMaxPeoplePerHouse(level: PopulationAsset) {
    return level.inputs.reduce((acc, input) => acc + (input.supplyWeight || 0), 0);
}

export function populationConsumptionReducer(state: RootState, action: AnyAction): RootState {
    if (action.type === UPDATE_HOUSES || action.type === UPDATE_POPULATION) {
        const {islandId, level: levelName} = action;
        if (!!state.island) {
            const level = getPopulationLevelByName(levelName);
            const people = state.island.islandsById[islandId].population[levelName].population;
            if (level) {
                const products = {...state.products};
                const islandProductStates = {...products[islandId]} || {};
                products[islandId] = islandProductStates;

                level.inputs.forEach((input) => {
                    if (input.amount) {
                        let productState = {...(islandProductStates[input.product] || initialProductState)};
                        islandProductStates[input.product] = productState;
                        productState.populationConsumers = {...productState.populationConsumers};
                        productState.populationConsumers[level.name] = input.amount * people * 60 / getMaxPeoplePerHouse(level);
                    }
                });
                return {
                    ...state,
                    products
                };
            }
        }
    }
    return state;
}

const initialFactoryState: FactoryState = {
    buildingCount: 0,
    productivity: 1,
};

export function factoryReducer(state: RootState, action: AnyAction): RootState {
    if (isActionOf(FactoryActions, action)) {
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
    }
    return state;
}

export function factoryProductionConsumptionReducer(state: RootState, action: AnyAction) {
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
