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
import {Map} from 'immutable';
import {getFactoryById} from "../../data/factories";
import {getProductById} from "../selectors";

export function populationConsumptionReducer(state: RootState, action: AnyAction): RootState {
    if (action.type === UPDATE_HOUSES) {
        const updateHousesAction: UpdateHousesAction = action as UpdateHousesAction;
        const {islandId} = updateHousesAction;
        const result = {
            ...state,
        };
        if (state.island) {
            const level = getPopulationLevelByName(updateHousesAction.level);
            const people = state.island.islandsById[islandId].population[updateHousesAction.level].population;
            if (level) {
                let oldIslandProductStates = state.products ? state.products.get(islandId, Map<number, ProductState>()) : Map<number, ProductState>();
                const islandProductStates = level.Inputs.reduce((productStates, input) => {
                    const productState = productStates.get(input.ProductID, {
                        factoryConsumers: Map<number, Consumption>(),
                        populationConsumers: Map<string, Consumption>(),
                        producers: Map<number, Production>(),
                        productId: input.ProductID,
                    });
                    return productStates.set(input.ProductID, {
                        ...productState,
                        populationConsumers: productState.populationConsumers.set(level.Name, new Consumption({
                            productId: input.ProductID,
                            consumptionPerMinute: input.Amount * people,
                        })),
                    });
                }, oldIslandProductStates);
                if (result.products) {
                    result.products = result.products.set(islandId, islandProductStates);
                } else {
                    result.products = Map<number, Map<number, ProductState>>()
                        .set(islandId, islandProductStates);
                }
            }
        }
        return result;
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
    if (action.type === UPDATE_FACTORY_COUNT) {
        const {islandId, factoryId, count} = action.payload;
        let factories = state.factories;
        if (!factories) {
            factories = Map<number, Map<number, FactoryState>>();
        }
        const factoryState = factories.getIn([islandId, factoryId], createFactoryState(factoryId));
        return state.setIn('factories', factories.setIn([islandId, factoryId], {
            ...factoryState,
            buildingCount: count,
        }));
    } else if (action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId, productivity} = action.payload;
        let factories = state.factories;
        if (!factories) {
            factories = Map<number, Map<number, FactoryState>>();
        }
        const factoryState = factories.getIn([islandId, factoryId], createFactoryState(factoryId));
        return state.set('factories', factories.setIn([islandId, factoryId], {
            ...factoryState,
            productivity,
        }));
    }
    return state;
}

export function factoryProductionConsumptionReducer(state: RootState, action: AnyAction) {
    if (action.type === UPDATE_FACTORY_COUNT || action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId} = action.payload;
        // recompute production for factoryId
        const factoryState: FactoryState = state.factories.getIn([islandId, factoryId]);

        const factoryDefinition = getFactoryById(factoryId);
        const products = state.products.withMutations(products => {
            factoryDefinition.Outputs.forEach(output => {
                const productId = output.ProductID;
                const productState = getProductById(state, islandId, productId);
                let cycleTime = factoryDefinition.CycleTime;
                if (cycleTime === 0) {
                    cycleTime = 30;
                }
                const productionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * output.Amount;
                products.setIn([islandId, productId], {
                    ...productState,
                    producers: productState.producers.set(factoryId, {
                        owner: factoryId,
                        productId,
                        productionPerMinute
                    }),
                });
            });
            // recompute consumption for factoryId
            factoryDefinition.Inputs.forEach(input => {
                const productId = input.ProductID;
                const productState = getProductById(state, islandId, productId);
                let cycleTime = factoryDefinition.CycleTime;
                if (cycleTime === 0) {
                    cycleTime = 30;
                }
                const consumptionPerMinute = factoryState.productivity * factoryState.buildingCount * (60 / cycleTime) * input.Amount;
                products.setIn([islandId, productId], {
                    ...productState,
                    factoryConsumers: productState.factoryConsumers.set(factoryId, new Consumption({
                        productId,
                        consumptionPerMinute
                    })),
                });
            });
        });
        return {
            ...state,
            products
        };
    }
    return state;
}

// function getInputs(): { [productId: number]: Consumption } {
//     const factoryRaw = getFactoryById(this.id);
//     return factoryRaw.Inputs.reduce((map: { [productId: number]: Consumption }, input: FactoryIngredient) => {
//         map[input.ProductID] = {
//             owner: this.id,
//             productId: input.ProductID,
//             consumptionPerMinute: 60 / factoryRaw.CycleTime,
//         };
//         return map;
//     }, {});
// }
//
// function getOutputs(): { [productId: number]: Production } {
//     const factoryRaw = getFactoryById(this.id);
//     return factoryRaw.Outputs.reduce((map: { [productId: number]: Production }, output: FactoryIngredient) => {
//         map[output.ProductID] = {
//             owner: this.id,
//             productId: output.ProductID,
//             productionPerMinute: 60 / factoryRaw.CycleTime,
//         };
//         return map;
//     }, {});
// }