import {relevantFactoryStatesById} from "./ProductCard";
import {ALL_FACTORIES, Factory, getProductById} from "../data/assets";
import {initialState} from "../redux/store";
import {PRODUCTS} from "../data/productAssets";
import {FactoryState} from "../redux/production/types";

const coalProductId = 1010226;
const producingFactoriesByProductId = new Map(PRODUCTS.map(product => [product.guid, ALL_FACTORIES.filter(factory => factory.output === product.guid)]));

describe('relevantFactoryStatesById', () => {
    let factory: Factory;
    let factories: { [islandId: number]: { [factoryId: number]: FactoryState } };
    beforeEach(() => {
        const coalProducers = producingFactoriesByProductId.get(coalProductId);
        if (!coalProducers) {
            throw new Error('coal producers should be defined!');
        }
        factory = coalProducers[0];
        factories = {
            1: {
                [factory.guid]: {
                    buildingCount: 0,
                    productivity: 1,
                }
            },
            2: {}
        };
        relevantFactoryStatesById.resetRecomputations();
    });

    it('should return a Map containing factory states that produce the product', () => {


        // Act
        const factoryStatesById = relevantFactoryStatesById({...initialState, factories},
            {
                product: getProductById(coalProductId),
                islandId: 1,
            });

        // Assert
        expect(factoryStatesById.has(factory.guid)).toBe(true);
        expect(factoryStatesById.get(factory.guid)).toBe(factories[1][factory.guid]);
    });
    it('should not recompute if input did not change', () => {
        // Arrange
        const state = {...initialState, factories};
        const partialProps = {product: getProductById(coalProductId), islandId: 1};

        // Act
        relevantFactoryStatesById(state, partialProps);
        relevantFactoryStatesById(state, partialProps);

        // Assert
        expect(relevantFactoryStatesById.recomputations()).toBe(1);
    });
    it('should not recompute if unrelated input changed', () => {
        // Arrange
        const state = {...initialState, factories};
        const partialProps = {product: getProductById(coalProductId), islandId: 1};

        // Act
        relevantFactoryStatesById(state, partialProps);
        relevantFactoryStatesById({
            ...state,
            factories: {
                ...state.factories,
                3: {}
            }
        }, partialProps);

        // Assert
        expect(relevantFactoryStatesById.recomputations()).toBe(1);
    });
    it('should recompute if island ID changed', () => {
        // Arrange
        const state = {...initialState, factories};
        const partialProps = {product: getProductById(coalProductId), islandId: 1};

        // Act
        relevantFactoryStatesById(state, partialProps);
        relevantFactoryStatesById(state, {...partialProps, islandId: 2});

        // Assert
        expect(relevantFactoryStatesById.recomputations()).toBe(2);
    });
});