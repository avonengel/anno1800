import {createCustomAction} from "typesafe-actions";

// export function updateFactoryCount(islandId: number, factoryId: number, count: number): ProductionActionTypes {
export const updateFactoryCount = createCustomAction('factories/UPDATE_COUNT', type =>
    (islandId: number, factoryId: number, count: number) => ({
        type,
        payload: {islandId, factoryId, count}
    })
);

export const updateFactoryProductivity = createCustomAction('factories/UPDATE_PRODUCTIVITY', type =>
    (islandId: number, factoryId: number, productivity: number) => ({
        type, payload: {islandId, factoryId, productivity}
    })
);

export const FactoryActions = [updateFactoryCount, updateFactoryProductivity];
//(islandId: number, factoryId: number, productivity: number) => action(UPDATE_FACTORY_PRODUCTIVITY, {islandId, factoryId, productivity});
