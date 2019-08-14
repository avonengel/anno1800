import {RootState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UpdateHousesAction} from "../islands/types";
import {getPopulationLevelByName} from "../../data/populations";
import {
    Consumption,
    FactoryState,
    Production,
    ProductState,
    UPDATE_FACTORY_COUNT,
    UPDATE_FACTORY_PRODUCTIVITY
} from "./types";
import {getFactoryById} from "../../data/factories";
import {getFactoryStateById, getProductStateById} from "../selectors";

function initialProductState(productId: number) {
    return {
        factoryConsumers: new Map<number, Consumption>(),
        populationConsumers: new Map<string, Consumption>(),
        producers: new Map<number, Production>(),
        productId: productId,
    };
}

export function populationConsumptionReducer(state: RootState, action: AnyAction): RootState {
    if (action.type === UPDATE_HOUSES) {
        const updateHousesAction: UpdateHousesAction = action as UpdateHousesAction;
        const {islandId} = updateHousesAction;
        if (!!state.island) {
            const level = getPopulationLevelByName(updateHousesAction.level);
            const people = state.island.islandsById[islandId].population[updateHousesAction.level].population;
            if (level) {
                const oldProductStates = state.products.get(islandId);

                const islandProductStates = oldProductStates ? new Map(oldProductStates) : new Map();
                level.Inputs.forEach((input) => {
                    let productState = islandProductStates.get(input.ProductID) || initialProductState(input.ProductID);

                    const populationConsumers = new Map(productState.populationConsumers).set(level.Name, {
                        productId: input.ProductID,
                        consumptionPerMinute: input.Amount * people,
                    });
                    islandProductStates.set(input.ProductID, {
                        ...productState,
                        populationConsumers: populationConsumers,
                    });
                });
                const products = state.products ? new Map(state.products) : new Map();
                products.set(islandId, islandProductStates);
                return {
                    ...state,
                    products
                };
            }
        }
    }
    return state;
}

function createFactoryState(factoryId: number): FactoryState {
    return {
        buildingCount: 0,
        id: factoryId,
        productivity: 1,
    };
}

export function factoryReducer(state: RootState, action: AnyAction): RootState {
    if (action.type === UPDATE_FACTORY_COUNT || action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId} = action.payload;
        const factories = state.factories ? new Map(state.factories) : new Map();
        const islandFactories = new Map(factories.get(factoryId));
        factories.set(islandId, islandFactories);
        const oldFactoryState = islandFactories.get(factoryId);
        const factoryState = oldFactoryState || createFactoryState(factoryId);

        if (action.type === UPDATE_FACTORY_COUNT) {
            islandFactories.set(factoryId, {
                ...factoryState,
                buildingCount: action.payload.count,
            });
        } else {
            islandFactories.set(factoryId, {
                ...factoryState,
                productivity: action.payload.productivity,
            });
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
        const products = state.products ? new Map(state.products) : new Map();
        const islandProductMap = new Map<number, ProductState>(products.get(islandId));

        factoryDefinition.Outputs.forEach(output => {
            const productId = output.ProductID;
            const productState = getProductStateById(state, islandId, productId);
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const productionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * output.Amount;
            const producers = {
                ...productState.producers,
            };
            producers[factoryId] = {
                owner: factoryId,
                productId,
                productionPerMinute
            };
            islandProductMap.set(productId, {
                ...productState,
                producers
            });
        });
        // recompute consumption for factoryId
        factoryDefinition.Inputs.forEach(input => {
            const productId = input.ProductID;
            const productState = getProductStateById(state, islandId, productId);
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const consumptionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * input.Amount;
            const consumers = {
                ...productState.factoryConsumers,
            };
            consumers[factoryId] = {
                productId,
                consumptionPerMinute
            };
            islandProductMap.set(productId, {
                ...productState,
                factoryConsumers: consumers
            });
        });
        return {
            ...state,
            products
        };
    }
    return state;
}
