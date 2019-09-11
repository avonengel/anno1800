import {RootState} from "./store";
import {Island} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";

export const getIslandById = (store: RootState, islandId: number): Readonly<Island> => {
    return store.island.islandsById[islandId];
};

export function getFactoryStateByIdOrDefault(store: RootState, islandId: number, factoryId: number): Readonly<FactoryState> {
    const factoryStateById = getFactoryStateById(store, islandId, factoryId);
    return factoryStateById || {buildingCount: 0, productivity: 1};
}

export function getFactoryStateById(store: RootState, islandId: number, factoryId: number): Readonly<FactoryState> | undefined {
    const factoryMap = getByIslandId(store.factories, islandId);
    return factoryMap[factoryId];
}

function getByIslandId<V>(map: { [islandId: number]: { [id: number]: V } }, islandId: number) {
    if (map !== undefined) {
        const entry = map[islandId];
        if (entry !== undefined) {
            return entry;
        }
    }
    return {};
}

const initialProductState = {
    producers: {},
    factoryConsumers: {},
    populationConsumers: {},
    exports: {},
    imports: {},
};

export function getProductStateByIdOrDefault(store: RootState, islandId: number, productId: number): Readonly<ProductState> {
    return getProductStateById(store, islandId, productId) || initialProductState;
}

export function getProductStateById(store: RootState, islandId: number, productId: number): Readonly<ProductState> | undefined {
    const productMap = getByIslandId(store.products, islandId);
    return productMap[productId];
}

export function getTradeIdsForIslandId(store: RootState, islandId: number): number[] {
    return store.trades.allTradeIds.filter(
        (tradeId) => store.trades.tradesById[tradeId].toIslandId === islandId || store.trades.tradesById[tradeId].fromIslandId === islandId
    );
}