import {Map} from 'immutable';
export const UPDATE_FACTORY_COUNT = 'UPDATE_FACTORY_COUNT';
interface UpdateFactoryCountAction {
    type: typeof UPDATE_FACTORY_COUNT,
    payload: UpdateFactoryCountPayload
}
export interface UpdateFactoryCountPayload {
    islandId: number,
    factoryId: number,
    count: number,
}
export type ProductionActionTypes = UpdateFactoryCountAction
export interface Consumption {
    owner: number | String;
    productId: number;
    consumptionPerMinute: number;
}

export interface FactoryState {
    id: number;
    buildingCount: number;
    productivity: number;
}

export interface Production {
    owner: number;
    productId: number;
    productionPerMinute: number;
}

export interface ProductState {
    productId: number;
    factoryConsumers: Map<number, Consumption>;
    populationConsumers: Map<string, Consumption>;
    producers: Map<number, Production>;
}
