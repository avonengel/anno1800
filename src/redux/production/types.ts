import {Map, Record} from 'immutable';

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

export const UPDATE_FACTORY_PRODUCTIVITY = 'UPDATE_FACTORY_PRODUCTIVITY';

interface UpdateFactoryProductivityAction {
    type: typeof UPDATE_FACTORY_PRODUCTIVITY,
    payload: UpdateFactoryProductivityPayload
}

export interface UpdateFactoryProductivityPayload {
    islandId: number,
    factoryId: number,
    productivity: number,
}

export type ProductionActionTypes = UpdateFactoryCountAction | UpdateFactoryProductivityAction

export interface IConsumption {
    productId: number;
    consumptionPerMinute: number;
}

export class Consumption extends Record<IConsumption>({productId: 0, consumptionPerMinute: 0}) implements IConsumption {
    constructor(config: Partial<IConsumption>) {
        super(config);
    }
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
