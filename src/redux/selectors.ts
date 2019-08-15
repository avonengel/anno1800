import {RootState} from "./store";
import {Island} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";

export const getIslandById = (store: RootState, islandId: number): Readonly<Island> => {
    return store.island.islandsById[islandId];
};

export function getFactoryStateById(store: RootState, islandId: number, factoryId: number): Readonly<FactoryState> {
    const factoryMap = getByIslandId(store.factories, islandId);
    const factoryState = factoryMap[factoryId];
    if (factoryState !== undefined) {
        return factoryState;
    }
    return {
        buildingCount: 0,
        productivity: 1,
    };
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
};

export function getProductStateById(store: RootState, islandId: number, productId: number): Readonly<ProductState> {
    const productMap = getByIslandId(store.products, islandId);
    const productState = productMap[productId];
    if (productState !== undefined) {
        return productState;
    }
    return initialProductState;
}
