import {State} from "./store";
import {Island} from "./islands/types";

export const getIslandById = (store: State, islandId: number): Island => {
    return store.island.islandsById[islandId];
};