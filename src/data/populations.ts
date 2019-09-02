import {PopulationAsset, PopulationInput} from "./populationTypes";
import {POPULATIONS} from "./populationAssets";

const BASE_SUPPLY_WEIGHT = 5;

export function getPopulation(level: PopulationAsset, houses: number, enabledProducts: number[]): number {
    const popPerHouse = level.inputs.filter(input => enabledProducts.includes(input.product))
        .filter(input => input.supplyWeight !== undefined)
        // @ts-ignore
        .reduce((current: number, input: PopulationInput) => current + input.supplyWeight, BASE_SUPPLY_WEIGHT);

    return popPerHouse * houses;
}

export const OBREROS = "Obreros";
export const JORNALEROS = "Jornaleros";
export const INVESTORS = "Investors";
export const ENGINEERS = "Engineers";
export const ARTISANS = "Artisans";
export const WORKERS = "Workers";
export const FARMERS = "Farmers";
export const NEW_WORLD_POPULATION_LEVELS = [JORNALEROS, OBREROS];
export const OLD_WORLD_POPULATION_LEVELS = [FARMERS, WORKERS, ARTISANS, ENGINEERS, INVESTORS];
export const POPULATION_LEVELS = [...OLD_WORLD_POPULATION_LEVELS, ...NEW_WORLD_POPULATION_LEVELS];

export function getPopulationLevelByName(name: string) {
    return POPULATIONS.find(asset => asset.name === name);
}
