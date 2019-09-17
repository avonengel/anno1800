import {createReducer} from "typesafe-actions";
import {disablePublicService, enablePublicService} from "./actions";
import {initialState} from "../store";
import iassign from "immutable-assign";

export const publicServiceReducer = createReducer(initialState)
    .handleAction(enablePublicService, (state, action) => {
        return iassign(state, s => s.publicServices.byIslandId[action.payload.islandId], publicServiceState => {
            if (!publicServiceState || !publicServiceState.enabledPublicServices) {
                return {enabledPublicServices: [action.payload.publicServiceId]};
            }
            const previousValue = publicServiceState.enabledPublicServices;
            if (previousValue.some(value => value === action.payload.publicServiceId)) {
                return publicServiceState;
            }
            return {
                ...publicServiceState,
                enabledPublicServices: [...(previousValue), action.payload.publicServiceId],
            };
        });
    })
    .handleAction(disablePublicService, (state, action) => {
        return iassign(state, s => s.publicServices.byIslandId[action.payload.islandId], publicServiceState => {
            if (!publicServiceState || !publicServiceState.enabledPublicServices) {
                return publicServiceState;
            }
            const previousValue = publicServiceState.enabledPublicServices as number[];
            if (!previousValue.some(value => value === action.payload.publicServiceId)) {
                return publicServiceState;
            }
            return {
                ...publicServiceState,
                enabledPublicServices: previousValue.filter(value => value !== action.payload.publicServiceId),
            };
        });
    });