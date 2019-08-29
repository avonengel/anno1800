import {FACTORIES} from "./factories";

export interface FactoryAsset {
    guid: number;
    name?: string;
    baseGuid?: number;
    associatedRegions: string;
    cycleTime?: number;
    inputs?: number[];
    output?: number;
}

const assetsById = new Map(FACTORIES.map(asset => [asset.guid, asset]));

export enum Region {
    OLD_WORLD = "Moderate",
    NEW_WORLD = "Colony01",
}

export class Factory {

    constructor(asset: FactoryAsset) {
        this.guid = asset.guid;
        this.associatedRegions = asset.associatedRegions;
        if (asset.baseGuid) {
            const baseAsset = assetsById.get(asset.baseGuid);
            if (baseAsset) {
                this.setValues(baseAsset);
            }
        }
        this.setValues(asset);
    }

    private setValues(asset: FactoryAsset) {
        if (asset.cycleTime) {
            this.cycleTime = asset.cycleTime;
        }
        if (asset.inputs) {
            this.inputs = asset.inputs;
        }
        if (asset.name) {
            this.name = asset.name;
        }
        if (asset.output) {
            this.output = asset.output;
        }
    }

    associatedRegions: string = "";
    cycleTime: number = 30;
    guid: number;
    inputs: number[] = [];
    name: string = ""; // TODO figure out how to properly do this without useless defaults
    output: number = 0;

    get isOldWorld(): boolean {
        return (this.associatedRegions.indexOf(Region.OLD_WORLD) >= 0);
    }

    get isNewWorld(): boolean {
        return (this.associatedRegions.indexOf(Region.NEW_WORLD) >= 0);
    }
}

export const ALL_FACTORIES = FACTORIES.map(asset => new Factory(asset));
export const FACTORIES_BY_ID = new Map(ALL_FACTORIES.map(factory => [factory.guid, factory]));
