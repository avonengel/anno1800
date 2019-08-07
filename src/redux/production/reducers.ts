import {AppState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UpdateHousesAction} from "../islands/types";
import {getPopulationLevelByName} from "../../data/populations";
import {Consumption, Production, ProductState} from "./types";
import {Map} from 'immutable';

export function consumptionReducer(state: AppState, action: AnyAction): AppState {
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
                    result.products = Map<number,Map<number,ProductState>>()
                        .set(islandId, islandProductStates);
                }
            }
        }
        return result;
    }
    return state;
}