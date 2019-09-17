import {FACTORIES} from "./factoryAssets";
import {PRODUCTS} from "./productAssets";
import {POPULATIONS} from "./populationAssets";
import {PUBLIC_SERVICES} from "./publicservices";

export interface PopulationAsset {
    name: string;
    guid: number;
    associatedRegions: string;
    inputs: PopulationInput[];
}

export interface PopulationInput {
    product: number;
    supplyWeight?: number;
    amount?: number;
    noWeightPopulationCount?: number;
}

export interface FactoryAsset {
    guid: number;
    name?: string;
    baseGuid?: number;
    associatedRegions: string;
    cycleTime?: number;
    inputs?: number[];
    output?: number;
}

export enum Region {
    OLD_WORLD = "Moderate",
    NEW_WORLD = "Colony01",
}


const factoryAssetsById = new Map(FACTORIES.map(asset => [asset.guid, asset]));

export class Factory {

    constructor(asset: FactoryAsset) {
        this.guid = asset.guid;
        this.associatedRegions = asset.associatedRegions;
        if (asset.baseGuid) {
            const baseAsset = factoryAssetsById.get(asset.baseGuid);
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

export function getFactoryById(factoryId: number) {
    const factory = FACTORIES_BY_ID.get(factoryId);
    if (factory === undefined) {
        throw Error(`Unknown Factory ID: ${factoryId}!`);
    }
    return factory;
}

export interface ProductAsset {
    guid: number;
    name: string;
    isAbstract?: boolean;
    civLevel?: number;
    productCategory?: number;
    categoryName?: string;
}

const productAssetsById = new Map(PRODUCTS.map(asset => [asset.guid, asset]));

export function getProductById(id: number): ProductAsset {
    const product = productAssetsById.get(id);
    if (product === undefined) {
        throw Error(`Unknown Product: ${id}!`);
    }
    return product;
}

export interface PublicServiceAsset {
    name?: string;
    guid: number;
    baseGuid?: number;
    associatedRegions: string;
    output?: number;
}
const publicServiceAssetsById = new Map(PUBLIC_SERVICES.map(asset => [asset.guid, asset]));

export class PublicService {

    constructor(asset: PublicServiceAsset) {
        this.guid = asset.guid;
        this.associatedRegions = asset.associatedRegions;
        if (asset.baseGuid) {
            const baseAsset = publicServiceAssetsById.get(asset.baseGuid);
            if (baseAsset) {
                this.setValues(baseAsset);
            }
        }
        this.setValues(asset);
    }

    private setValues(asset: PublicServiceAsset) {
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
export const ALL_PUBLIC_SERVICES = PUBLIC_SERVICES.map(asset => new PublicService(asset));
export const PUBLIC_SERVICES_BY_ID = new Map(ALL_PUBLIC_SERVICES.map(ps => [ps.guid, ps]));

const BASE_SUPPLY_WEIGHT = 5;

function getPopulationPerHouse(level: PopulationAsset, enabledProducts: number[]) {
    return level.inputs.filter(input => enabledProducts.includes(input.product))
        .filter(input => input.supplyWeight !== undefined)
        // @ts-ignore
        .reduce((current: number, input: PopulationInput) => current + input.supplyWeight, BASE_SUPPLY_WEIGHT);
}

export function getPopulation(level: PopulationAsset, houses: number, enabledProducts: number[]): number {
    return getPopulationPerHouse(level, enabledProducts) * houses;
}

export function getHouses(level: PopulationAsset, population: number, enabledProducts: number[]): number {
    return Math.ceil(population / getPopulationPerHouse(level, enabledProducts));
}

export const NEW_WORLD_POPULATION_LEVELS = POPULATIONS.filter(asset => asset.associatedRegions === Region.NEW_WORLD).map(asset => asset.name);
export const OLD_WORLD_POPULATION_LEVELS = POPULATIONS.filter(asset => asset.associatedRegions === Region.OLD_WORLD).map(asset => asset.name);
export const POPULATION_LEVELS = [...OLD_WORLD_POPULATION_LEVELS, ...NEW_WORLD_POPULATION_LEVELS];

export function getPopulationLevelByName(name: string): PopulationAsset {
    const level = POPULATIONS.find(asset => asset.name === name);
    if (level === undefined) {
        throw Error(`Unknown population level: ${name}!`);
    }
    return level;
}