import {RootState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UpdateHousesAction} from "../islands/types";
import {getPopulationLevelByName} from "../../data/populations";
import {Consumption, FactoryState, UPDATE_FACTORY_COUNT, UPDATE_FACTORY_PRODUCTIVITY} from "./types";
import {getFactoryById} from "../../data/factories";
import {getFactoryStateById} from "../selectors";

const initialProductState = {
    factoryConsumers: {},
    populationConsumers: {},
    producers: {},
};

export function populationConsumptionReducer(state: RootState, action: AnyAction): RootState {
    if (action.type === UPDATE_HOUSES) {
        const updateHousesAction: UpdateHousesAction = action as UpdateHousesAction;
        const {islandId} = updateHousesAction;
        if (!!state.island) {
            const level = getPopulationLevelByName(updateHousesAction.level);
            const people = state.island.islandsById[islandId].population[updateHousesAction.level].population;
            if (level) {
                const products = {...state.products};
                const islandProductStates = {...products[islandId]} || {};
                products[islandId] = islandProductStates;

                // const islandProductStates = oldProductStates ? new Map(oldProductStates) : new Map();
                level.Inputs.forEach((input) => {
                    let productState = {...(islandProductStates[input.ProductID] || initialProductState)}; //islandProductStates.get(input.ProductID) || initialProductState(input.ProductID);
                    islandProductStates[input.ProductID] = productState;
                    productState.populationConsumers = {...productState.populationConsumers};
                    productState.populationConsumers[level.Name] = input.Amount * people;
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
    if (action.type === UPDATE_FACTORY_COUNT || action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId} = action.payload;
        const factories = {...state.factories};
        const islandFactories = {...factories[islandId]};
        factories[islandId] = islandFactories;
        const factoryState = {...(islandFactories[factoryId] || initialFactoryState)};
        islandFactories[factoryId] = factoryState;

        if (action.type === UPDATE_FACTORY_COUNT) {
            factoryState.buildingCount = action.payload.count;
        } else {
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
    if (action.type === UPDATE_FACTORY_COUNT || action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId} = action.payload;
        // recompute production for factoryId
        const factoryState = getFactoryStateById(state, islandId, factoryId);
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
