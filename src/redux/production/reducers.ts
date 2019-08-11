import {AppState} from "../store";
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

export function populationConsumptionReducer(state: AppState, action: AnyAction): AppState {
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
                        populationConsumers: productState.populationConsumers.set(level.Name, {
                            owner: level.Name,
                            productId: input.ProductID,
                            consumptionPerMinute: input.Amount * people,
                        }),
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

export function factoryReducer(state: Readonly<AppState>, action: AnyAction): AppState {
    if (action.type === UPDATE_FACTORY_COUNT) {
        const {islandId, factoryId, count} = action.payload;
        let factories = state.factories;
        if (!factories) {
            factories = Map<number, Map<number, FactoryState>>();
        }
        const factoryState = factories.getIn([islandId, factoryId], createFactoryState(factoryId));
        return {
            ...state,
            factories: factories.setIn([islandId, factoryId], {
                ...factoryState,
                buildingCount: count,
            }),
        };
    } else if (action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId, productivity} = action.payload;
        let factories = state.factories;
        if (!factories) {
            factories = Map<number, Map<number, FactoryState>>();
        }
        const factoryState = factories.getIn([islandId, factoryId], createFactoryState(factoryId));
        return {
            ...state,
            factories: factories.setIn([islandId, factoryId], {
                ...factoryState,
                productivity,
            }),
        };
    }
    return state;
}

export function factoryProductionConsumptionReducer(state: Readonly<AppState>, action: AnyAction) {
    if (action.type === UPDATE_FACTORY_PRODUCTIVITY || action.type === UPDATE_FACTORY_PRODUCTIVITY) {
        const {islandId, factoryId} = action.payload;
        // TODO: recompute production for factoryId
        const factoryState: FactoryState = state.factories.getIn([islandId, factoryId]);

        const factoryDefinition = getFactoryById(factoryId);
        const productionsToUpdate = factoryDefinition.Outputs.map(output => {
            const productId = output.ProductID;
            const productState = getProductById(state, islandId, productId);
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const productionPerMinute = factoryState.productivity * factoryState.buildingCount * (cycleTime / 60) * output.Amount;
            const producer = productState.producers.get(factoryId, {
                owner: factoryId,
                productId,
                productionPerMinute: 0
            } as Production);
            // TODO collect complete ProductState objects from this block
            return Object.assign({}, producer, {productionPerMinute});
        });
        // TODO: recompute consumption for factoryId
        const consumptionsToUpdate = factoryDefinition.Inputs.map(input => {
            const productId = input.ProductID;
            const productState = getProductById(state, islandId, productId);
            let cycleTime = factoryDefinition.CycleTime;
            if (cycleTime === 0) {
                cycleTime = 30;
            }
            const consumptionPerMinute = factoryState.productivity * factoryState.buildingCount * (cycleTime / 60) * input.Amount;
            const consumer = productState.factoryConsumers.get(factoryId, {
                owner: factoryId,
                productId,
                consumptionPerMinute: 0
            } as Consumption);
            return Object.assign({}, consumer, {consumptionPerMinute});
        });
        state.products.udpateIn([islandId, factoryId], (productState: ProductState) => {
            return {
                ...productState,
                factoryConsumers: productState.factoryConsumers.merge(factoryConsumers),
                producers: productState.producers.merge(producers),
            };
        });
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