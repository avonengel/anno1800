import {RootState} from "./store";
import {Island} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";

export const getIslandById = (store: RootState, islandId: number): Readonly<Island> => {
    return store.island.islandsById[islandId];
};

export function getFactoryStateById(store: RootState, islandId: number, factoryId: number): Readonly<FactoryState> {
    const factoryMap = getByIslandId(store.factories, islandId);
    const factoryState = factoryMap.get(factoryId);
    if (factoryState !== undefined) {
        return factoryState;
    }
    return {
        id: factoryId,
        buildingCount: 0,
        productivity: 1,
    };
}

function getByIslandId<K, V>(map: ReadonlyMap<number, ReadonlyMap<K, V>>, islandId: number) {
    if (map !== undefined) {
        const entry = map.get(islandId);
        if (entry !== undefined) {
            return entry;
        }
    }

    return new Map<K, V>();
}

function initialProductState(productId: number) {
    return {
        productId: productId,
        producers: {},
        factoryConsumers: {},
        populationConsumers: {},
    }
}

export function getProductStateById(store: RootState, islandId: number, productId: number): Readonly<ProductState> {
    const productMap = getByIslandId(store.products, islandId);
    const productState = productMap.get(productId);
    if (productState !== undefined) {
        return productState;
    }
    return initialProductState(productId);
}
