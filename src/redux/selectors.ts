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

export function getProductById(store: AppState, islandId: number, productId: number): Readonly<ProductState> {
    if (!store.products) {
        return {
            productId: productId,
            producers: Map<number, Production>(),
            factoryConsumers: Map<number, Consumption>(),
            populationConsumers: Map<string, Consumption>(),
        };
    }
    return store.products.getIn([islandId, productId]);
}