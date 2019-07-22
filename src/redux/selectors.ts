import {AppState} from "./store";
import {Island} from "./islands/types";

export const getIslandById = (store: AppState, islandId: number): Island => {
    return store.island.islandsById[islandId];
};