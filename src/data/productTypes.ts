import {PRODUCTS} from "./products";

export interface ProductAsset {
    guid: number;
    name: string;
    isAbstract?: boolean;
    civLevel?: number;
    productCategory?: number;
    categoryName?: string;
}

const assetsById = new Map(PRODUCTS.map(asset => [asset.guid, asset]));
export function getProductById(id: number): ProductAsset {
    const product = assetsById.get(id);
    if (product === undefined) {
        throw Error(`Unknown Product: ${id}!`);
    }
    return product;
}