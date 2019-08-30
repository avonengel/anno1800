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
