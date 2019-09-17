import {createCustomAction} from "typesafe-actions";

export const enablePublicService = createCustomAction('publicservices/ENABLE',
    type => (islandId: number, publicServiceId: number) => ({
        type,
        payload: {
            islandId,
            publicServiceId,
        }
    }));

export const disablePublicService = createCustomAction('publicservices/DISABLE',
    type => (islandId: number, publicServiceId: number) => ({
        type,
        payload: {
            islandId,
            publicServiceId,
        }
    }));
