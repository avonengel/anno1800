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

function mapToPublicServiceOutputs(enabledPublicServices: number[]) {
    const publicServiceOutputs = enabledPublicServices.map(guid => {
        const publicService = PUBLIC_SERVICES_BY_ID.get(guid);
        if (publicService) {
            return publicService.output;
        }
        return undefined;
    }).filter(v => v !== undefined);
    return publicServiceOutputs;
}

function getPopulationPerHouse(level: PopulationAsset, population: number, enabledProducts: number[], enabledPublicServices: number[]) {
    const publicServiceOutputs = mapToPublicServiceOutputs(enabledPublicServices);
    return level.inputs.filter(input => enabledProducts.includes(input.product) || publicServiceOutputs.includes(input.product))
        .filter(input => input.supplyWeight !== undefined)
        .filter(input => input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < population)
        // @ts-ignore
        .reduce((current: number, input: PopulationInput) => current + input.supplyWeight, 0);
}

export function getPopulation(level: PopulationAsset, houses: number, enabledProducts: number[], enabledPublicServices: number[] = []): number {
    const publicServiceOutputs = mapToPublicServiceOutputs(enabledPublicServices);
    const populationInputs = level.inputs.filter(input => enabledProducts.includes(input.product) || publicServiceOutputs.includes(input.product))
        .sort((a, b) => {
            if (a.noWeightPopulationCount === undefined && b.noWeightPopulationCount === undefined) {
                return 0;
            } else if (a.noWeightPopulationCount !== undefined && b.noWeightPopulationCount !== undefined) {
                return a.noWeightPopulationCount - b.noWeightPopulationCount;
            } else if (a.noWeightPopulationCount === undefined) {
                return -1;
            }
            return 1;
        });
    return populationInputs
        .reduce((current: number, input: PopulationInput) => {
            if (input.supplyWeight && (input.noWeightPopulationCount === undefined || input.noWeightPopulationCount < current)) {
                return current + input.supplyWeight * houses;
            }
            return current;
        }, 0);
}

export function getHouses(level: PopulationAsset, population: number, enabledProducts: number[], enabledPublicServices: number[] = []): number {
    // assume at least 5 population per house (5 is supplyWeight of Marketplace)
    const populationPerHouse = Math.max(5, getPopulationPerHouse(level, population, enabledProducts, enabledPublicServices));
    return Math.ceil(population / populationPerHouse);
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

export interface FilterAsset {
    guid: number;
    name: string;
    options: { [description: string]: number[] };
}