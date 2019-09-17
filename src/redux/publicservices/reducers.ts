import {createReducer} from "typesafe-actions";
import {disablePublicService, enablePublicService} from "./actions";
import iassign from "immutable-assign";
import {initialState} from "../root-state";

iassign.setOption({freezeOutput: false,
freeze: false,
freezeInput: false}); // FIXME this was necessary to avoid trouble with redux-persist. Is it disabled by default in production?
export const publicServiceReducer = createReducer(initialState)
    .handleAction(enablePublicService, (state, action) => {
        return iassign(state, s => s.publicServices.byIslandId[action.payload.islandId], publicServiceState => {
            if (!publicServiceState || !publicServiceState.enabledPublicServices) {
                return {enabledPublicServices: [action.payload.publicServiceId]};
            }
            const previousValue = publicServiceState.enabledPublicServices;
            if (previousValue.includes(action.payload.publicServiceId)) {
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
            if (!previousValue.includes(action.payload.publicServiceId)) {
                return publicServiceState;
            }
            return {
                ...publicServiceState,
                enabledPublicServices: previousValue.filter(value => value !== action.payload.publicServiceId),
            };
        });
    });