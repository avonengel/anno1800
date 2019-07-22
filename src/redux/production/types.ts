import {FactoryIngredient, getFactoryById} from "../../data/factories";

export interface Consumption {
    owner: number;
    productId: number;
    consumptionPerMinute: number;
}

export class FactoryState {
    id: number;
    buildingCount: number;
    productivity: number;

    constructor(id: number, buildingCount: number = 0, productivity: number = 100) {
        this.id = id;
        this.buildingCount = buildingCount;
        this.productivity = productivity;
    }

    getInputs(): { [productId: number]: Consumption } {
        const factoryRaw = getFactoryById(this.id);
        return factoryRaw.Inputs.reduce((map: { [productId: number]: Consumption }, input: FactoryIngredient) => {
            map[input.ProductID] = {
                owner: this.id,
                productId: input.ProductID,
                consumptionPerMinute: 60 / factoryRaw.CycleTime,
            };
            return map;
        }, {});
    }

    getOutputs(): { [productId: number]: Production } {
        const factoryRaw = getFactoryById(this.id);
        return factoryRaw.Outputs.reduce((map: { [productId: number]: Production }, output: FactoryIngredient) => {
            map[output.ProductID] = {
                owner: this.id,
                productId: output.ProductID,
                productionPerMinute: 60 / factoryRaw.CycleTime,
            };
            return map;
        }, {});
    }
}

// TODO design relationships between population, factories, products, consumption, production

export interface Production {
    owner: number;
    productId: number;
    productionPerMinute: number;
}

export interface ProductState {
    productId: number;
    consumers: { [consumerId: number]: Consumption };
    producers: { [producerId: number]: Production };
}
