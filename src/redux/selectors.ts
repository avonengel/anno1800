import {AppState} from "./store";
import {Island} from "./islands/types";
import {Consumption, FactoryState, Production, ProductState} from "./production/types";
import {Map} from 'immutable';

export const getIslandById = (store: AppState, islandId: number): Readonly<Island> => {
    return store.island.islandsById[islandId];
};

export function getFactoryStateById(store: AppState, islandId: number, factoryId: number): Readonly<FactoryState> {
    if (!store.factories) {
        return {
            buildingCount: 0,
            productivity: 1,
            id: factoryId,
        };
    }
    return store.factories.getIn([islandId, factoryId]);
}

function initialProductState(productId: number) {
    return {
        productId: productId,
        producers: Map<number, Production>(),
        factoryConsumers: Map<number, Consumption>(),
        populationConsumers: Map<string, Consumption>(),
    }
};

export function getProductById(store: AppState, islandId: number, productId: number): Readonly<ProductState> {
    if (store.products === undefined || store.products === null) {
        return initialProductState(productId);
    }
    return getProductByIdFromProduct(store.products, islandId, productId);
}

export function getProductByIdFromProduct(products: Map<number, Map<number, ProductState>>, islandId: number, productId: number): Readonly<ProductState> {
    if (products === undefined || products === null) {
        return initialProductState(productId);
    }
    if (productId === 1010197) {
        console.log(`${islandId} ${productId} productState`, products.toJS());
    }
    const result = products.getIn([islandId, productId], initialProductState(productId));
    if (productId === 1010197) {
        console.log('result', result);
    }
    return result;
}

