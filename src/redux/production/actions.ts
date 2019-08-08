import {ProductionActionTypes, UPDATE_FACTORY_COUNT} from "./types";

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
