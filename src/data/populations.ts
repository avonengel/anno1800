export interface PopulationLevelRaw {
    Name: string;
    Inputs: PopulationInput[];
}

const BASE_SUPPLY_WEIGHT = 5;

export function getPopulation(level: PopulationLevelRaw, houses: number, enabledProducts: number[]): number {
    const popPerHouse = level.Inputs.filter(input => enabledProducts.includes(input.ProductID))
        .reduce((current: number, input: PopulationInput) => current + input.SupplyWeight, BASE_SUPPLY_WEIGHT);

    return popPerHouse * houses;
}

export interface PopulationInput {
    ProductID: number;
    Amount: number;
    SupplyWeight: number;
    MoneyValue: number;
}

export const OBREROS = "Obreros";
export const JORNALEROS = "Jornaleros";
export const INVESTORS = "Investors";
export const ENGINEERS = "Engineers";
export const ARTISANS = "Artisans";
export const WORKERS = "Workers";
export const FARMERS = "Farmers";
export const POPULATION_LEVELS = [FARMERS, WORKERS, ARTISANS, ENGINEERS, INVESTORS, JORNALEROS, OBREROS];

export function getPopulationLevelByName(name: string) {
    return RAW_DATA.find(raw => raw.Name === name);
}

const RAW_DATA: PopulationLevelRaw[] = [
    {
        // ATTENTION: Amount needs to be multiplied by 6 in order to have consumption per head per minute
        "Name": FARMERS,
        "Inputs": [
            {"ProductID": 120020, "Amount": 0.0, "SupplyWeight": 5, "MoneyValue": 0},
            {"ProductID": 1010200, "Amount": 0.0004166667, "SupplyWeight": 3, "MoneyValue": 10},
            {"ProductID": 1010216, "Amount": 0.000555556, "SupplyWeight": 0, "MoneyValue": 30},
            {"ProductID": 1010237, "Amount": 0.000512821, "SupplyWeight": 2, "MoneyValue": 30}
        ],
    },
    {
        "Name": WORKERS,
        "Inputs": [
            {"ProductID": 120020, "Amount": 0.0, "SupplyWeight": 5, "MoneyValue": 0},
            {"ProductID": 1010200, "Amount": 0.0008333334, "SupplyWeight": 3, "MoneyValue": 10},
            {"ProductID": 1010216, "Amount": 0.001111112, "SupplyWeight": 0, "MoneyValue": 30},
            {"ProductID": 1010237, "Amount": 0.001025642, "SupplyWeight": 2, "MoneyValue": 30},
            {"ProductID": 1010238, "Amount": 0.000333334, "SupplyWeight": 3, "MoneyValue": 20},
            {"ProductID": 1010213, "Amount": 0.00030303, "SupplyWeight": 3, "MoneyValue": 20},
            {"ProductID": 1010203, "Amount": 0.000138889, "SupplyWeight": 2, "MoneyValue": 20},
            {"ProductID": 1010214, "Amount": 0.00025641, "SupplyWeight": 0, "MoneyValue": 50},
            {"ProductID": 1010351, "Amount": 0.0, "SupplyWeight": 2, "MoneyValue": 0}
        ],
    },
    {
        "Name": ARTISANS,
        "Inputs": [
            {"ProductID": 1010238, "Amount": 0.000666667, "SupplyWeight": 6, "MoneyValue": 40},
            {"ProductID": 1010213, "Amount": 0.000606061, "SupplyWeight": 6, "MoneyValue": 40},
            {"ProductID": 1010203, "Amount": 0.000277778, "SupplyWeight": 4, "MoneyValue": 40},
            {"ProductID": 1010214, "Amount": 0.000512821, "SupplyWeight": 0, "MoneyValue": 100},
            {"ProductID": 1010351, "Amount": 0.0, "SupplyWeight": 4, "MoneyValue": 0},
            {"ProductID": 1010217, "Amount": 0.00017094, "SupplyWeight": 4, "MoneyValue": 20},
            {"ProductID": 1010206, "Amount": 0.00047619, "SupplyWeight": 2, "MoneyValue": 40},
            {"ProductID": 1010257, "Amount": 0.000952381, "SupplyWeight": 0, "MoneyValue": 50},
            {"ProductID": 1010247, "Amount": 0.000444444, "SupplyWeight": 2, "MoneyValue": 60},
            {"ProductID": 1010353, "Amount": 0.0, "SupplyWeight": 2, "MoneyValue": 0}
        ],
    },
    {
        "Name": ENGINEERS,
        "Inputs": [
            {"ProductID": 1010217, "Amount": 0.00034188, "SupplyWeight": 12, "MoneyValue": 40},
            {"ProductID": 1010206, "Amount": 0.000952381, "SupplyWeight": 6, "MoneyValue": 80},
            {"ProductID": 1010257, "Amount": 0.001904762, "SupplyWeight": 0, "MoneyValue": 100},
            {"ProductID": 1010247, "Amount": 0.000888889, "SupplyWeight": 6, "MoneyValue": 120},
            {"ProductID": 1010353, "Amount": 0.0, "SupplyWeight": 6, "MoneyValue": 0},
            {"ProductID": 120030, "Amount": 0.000148148, "SupplyWeight": 4, "MoneyValue": 50},
            {"ProductID": 1010245, "Amount": 0.000416667, "SupplyWeight": 0, "MoneyValue": 70},
            {"ProductID": 120032, "Amount": 0.000784314, "SupplyWeight": 2, "MoneyValue": 40},
            {"ProductID": 1010246, "Amount": 0.000130719, "SupplyWeight": 0, "MoneyValue": 90},
            {"ProductID": 1010354, "Amount": 0.0, "SupplyWeight": 2, "MoneyValue": 0},
            {"ProductID": 1010208, "Amount": 0.000208333, "SupplyWeight": 2, "MoneyValue": 70}
        ],
    },
    {
        "Name": INVESTORS,
        "Inputs": [
            {"ProductID": 120030, "Amount": 0.000296296, "SupplyWeight": 16, "MoneyValue": 100},
            {"ProductID": 1010245, "Amount": 0.000833333, "SupplyWeight": 0, "MoneyValue": 140},
            {"ProductID": 120032, "Amount": 0.001568627, "SupplyWeight": 8, "MoneyValue": 80},
            {"ProductID": 1010246, "Amount": 0.000261438, "SupplyWeight": 0, "MoneyValue": 180},
            {"ProductID": 1010354, "Amount": 0.0, "SupplyWeight": 8, "MoneyValue": 0},
            {"ProductID": 1010208, "Amount": 0.000416667, "SupplyWeight": 8, "MoneyValue": 140},
            {"ProductID": 120016, "Amount": 0.000392, "SupplyWeight": 2, "MoneyValue": 50},
            {"ProductID": 1010259, "Amount": 0.00037037, "SupplyWeight": 2, "MoneyValue": 50},
            {"ProductID": 1010258, "Amount": 0.000888889, "SupplyWeight": 2, "MoneyValue": 50},
            {"ProductID": 1010250, "Amount": 0.000350877, "SupplyWeight": 0, "MoneyValue": 250},
            {"ProductID": 1010248, "Amount": 0.0, "SupplyWeight": 0, "MoneyValue": 150},
            {"ProductID": 1010225, "Amount": 0.000111111, "SupplyWeight": 4, "MoneyValue": 300}
        ],
    },
    {
        "Name": JORNALEROS,
        "Inputs": [
            {"ProductID": 120020, "Amount": 0.0, "SupplyWeight": 5, "MoneyValue": 0},
            {"ProductID": 120033, "Amount": 0.00047619, "SupplyWeight": 3, "MoneyValue": 25},
            {"ProductID": 1010257, "Amount": 0.000238095, "SupplyWeight": 0, "MoneyValue": 25},
            {"ProductID": 120043, "Amount": 0.000416667, "SupplyWeight": 2, "MoneyValue": 25}
        ],
    },
    {
        "Name": OBREROS,
        "Inputs": [
            {"ProductID": 120020, "Amount": 0.0, "SupplyWeight": 5, "MoneyValue": 0},
            {"ProductID": 120033, "Amount": 0.000952381, "SupplyWeight": 3, "MoneyValue": 25},
            {"ProductID": 1010257, "Amount": 0.000476191, "SupplyWeight": 0, "MoneyValue": 25},
            {"ProductID": 120043, "Amount": 0.000833333, "SupplyWeight": 2, "MoneyValue": 25},
            {"ProductID": 120035, "Amount": 0.00047619, "SupplyWeight": 4, "MoneyValue": 10},
            {"ProductID": 120032, "Amount": 0.000196079, "SupplyWeight": 2, "MoneyValue": 10},
            {"ProductID": 120037, "Amount": 0.000444444, "SupplyWeight": 2, "MoneyValue": 10},
            {"ProductID": 1010214, "Amount": 0.000444444, "SupplyWeight": 0, "MoneyValue": 30},
            {"ProductID": 1010259, "Amount": 0.000185185, "SupplyWeight": 0, "MoneyValue": 35},
            {"ProductID": 1010206, "Amount": 0.000416667, "SupplyWeight": 2, "MoneyValue": 25}
        ],
    },

];