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
