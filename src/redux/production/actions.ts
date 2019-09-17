import {createCustomAction} from "typesafe-actions";

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
