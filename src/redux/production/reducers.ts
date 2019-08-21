import {RootState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UPDATE_POPULATION} from "../islands/types";
import {getPopulationLevelByName, PopulationLevelRaw} from "../../data/populations";
import {FactoryState} from "./types";
import {getFactoryById} from "../../data/factories";
import {getFactoryStateByIdOrDefault} from "../selectors";
import {getType, isActionOf, isOfType} from "typesafe-actions";
import {FactoryActions, updateFactoryCount, updateFactoryProductivity} from "./actions";

const initialProductState = {
    factoryConsumers: {},
    populationConsumers: {},
    producers: {},
};

function getMaxPeoplePerHouse(level: PopulationLevelRaw) {
    return level.Inputs.reduce((acc, input) => acc + input.SupplyWeight, 0);
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

                level.Inputs.forEach((input) => {
                    let productState = {...(islandProductStates[input.ProductID] || initialProductState)};
                    islandProductStates[input.ProductID] = productState;
                    productState.populationConsumers = {...productState.populationConsumers};
                    productState.populationConsumers[level.Name] = input.Amount * people * 60 / getMaxPeoplePerHouse(level);
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
    if(isActionOf(FactoryActions, action)) {
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
        const factoryDefinition = getFactoryById(factoryId);
        const products = {...state.products};
        const islandProductMap = {...products[islandId as number]};
        products[islandId] = islandProductMap;

        factoryDefinition.Outputs.forEach(output => {
            const productId = output.ProductID;
            const productState = {...islandProductMap[productId]};
            islandProductMap[productId] = productState;
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const productionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * output.Amount;
            const producers = {...productState.producers};
            productState.producers = producers;
            producers[factoryId] = productionPerMinute;
        });
        // recompute consumption for factoryId
        factoryDefinition.Inputs.forEach(input => {
            const productId = input.ProductID;
            const productState = {...islandProductMap[productId]};
            islandProductMap[productId] = productState;
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const consumptionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * input.Amount;
            const consumers = {...productState.factoryConsumers};
            productState.factoryConsumers = consumers;
            consumers[factoryId] = consumptionPerMinute;
        });
        return {
            ...state,
            products
        };
    }
    return state;
}
