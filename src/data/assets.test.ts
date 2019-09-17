import {getPopulation, getPopulationLevelByName} from "./assets";

describe('getPopulation', () => {
    it('should compute 10 for full farmer house', () => {
        // Arrange
        const asset = getPopulationLevelByName("Farmers");
        const enabledProducts = asset.inputs.map(input => input.product);
        // Act
        const population = getPopulation(asset, 1, enabledProducts);

        // Assert
        expect(population).toBe(10);
    });  
    it('should compute 20 for full worker house', () => {
        // Arrange
        const asset = getPopulationLevelByName("Workers");
        const enabledProducts = asset.inputs.map(input => input.product);
        // Act
        const population = getPopulation(asset, 1, enabledProducts);

        // Assert
        expect(population).toBe(20);
    });
    it('should compute 30 for full artisan house', () => {
        // Arrange
        const asset = getPopulationLevelByName("Artisans");
        const enabledProducts = asset.inputs.map(input => input.product);
        // Act
        const population = getPopulation(asset, 1, enabledProducts);

        // Assert
        expect(population).toBe(30);
    });
    it('should compute 40 for full engineer house', () => {
        // Arrange
        const asset = getPopulationLevelByName("Engineers");
        const enabledProducts = asset.inputs.map(input => input.product);
        // Act
        const population = getPopulation(asset, 1, enabledProducts);

        // Assert
        expect(population).toBe(40);
    });
    it('should compute 50 for full investor house', () => {
        // Arrange
        const asset = getPopulationLevelByName("Investors");
        const enabledProducts = asset.inputs.map(input => input.product);
        // Act
        const population = getPopulation(asset, 1, enabledProducts);

        // Assert
        expect(population).toBe(50);
    });
});