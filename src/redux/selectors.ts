import {AppState} from "./store";
import {Island} from "./islands/types";
import {FactoryState} from "./production/types";

export const getIslandById = (store: AppState, islandId: number): Island => {
    return store.island.islandsById[islandId];
};

export function getFactoryStateById(store: AppState, islandId: number, factoryId: number): FactoryState {
    if(!store.factories) {
        return {
            buildingCount: 0,
            productivity: 1,
            id: factoryId,
        };
    }
    return store.factories.getIn([islandId, factoryId]);
}