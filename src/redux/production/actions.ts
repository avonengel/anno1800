import {ProductionActionTypes, UPDATE_FACTORY_COUNT, UPDATE_FACTORY_PRODUCTIVITY} from "./types";
import {action} from "typesafe-actions";

export function updateFactoryCount(islandId: number, factoryId: number, count: number): ProductionActionTypes {
    return {
        type: UPDATE_FACTORY_COUNT,
        payload: {
            islandId,
            factoryId,
            count,
        }
    }
}

export const updateFactoryProductivity = (islandId: number, factoryId: number, productivity: number) => action(UPDATE_FACTORY_PRODUCTIVITY, {islandId, factoryId, productivity});
