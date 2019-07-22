import {AppState} from "../store";
import {AnyAction} from "redux";
import {UPDATE_HOUSES, UpdateHousesAction} from "../islands/types";
import {getPopulationLevelByName} from "../../data/populations";

export function consumptionReducer(state: AppState, action: AnyAction): AppState {
    if (action.type === UPDATE_HOUSES) {
        const updateHousesAction: UpdateHousesAction = action as UpdateHousesAction;
        const result = {
            ...state,
            products: {
                ...state.products,
            }
        };
        if (state.island) {
            const level = getPopulationLevelByName(updateHousesAction.level);
            const people = state.island.islandsById[updateHousesAction.islandId].population[updateHousesAction.level].population;
            if (level) {
                // TODO: wtf, this is way too complicated!
                if (result.products === undefined) {
                    result.products = {};
                }
                if (result.products[updateHousesAction.islandId]) {
                    result.products[updateHousesAction.islandId] = {
                        ...state.products[updateHousesAction.islandId]
                    };
                } else {
                    result.products[updateHousesAction.islandId] = {};
                }
                level.Inputs.forEach(input => {
                    if (result.products[updateHousesAction.islandId][input.ProductID] === undefined) {
                        result.products[updateHousesAction.islandId][input.ProductID] = {
                            consumers: {},
                            producers: {},
                            productId: input.ProductID,
                        }
                    }
                    result.products[updateHousesAction.islandId][input.ProductID].consumers = {
                        ...result.products[updateHousesAction.islandId][input.ProductID].consumers
                    };
                    result.products[updateHousesAction.islandId][input.ProductID].consumers[level.consumerId] = {
                        owner: level.consumerId,
                        productId: input.ProductID,
                        consumptionPerMinute: input.Amount * people,
                    };
                });

            }
        }
        return result;
    }
    return state;
}