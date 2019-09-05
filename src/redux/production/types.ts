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

export type Consumption = number;

export interface FactoryState {
    readonly buildingCount: number;
    readonly productivity: number;
}

export type Production = number;

export interface ProductState {
    factoryConsumers: { [factoryId: number]: Consumption };
    populationConsumers: { [level: string] : Consumption};
    producers: { [factoryId: number]: Production };
    exports: { [tradeId: number]: Consumption};
    imports: { [tradeId: number]: Production};
}
