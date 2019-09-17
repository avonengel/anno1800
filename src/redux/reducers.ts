import {isActionOf} from "typesafe-actions";
import {uploadState} from "./actions";
import {RootAction} from "./types";
import {RootState} from "./root-state";

export function stateUploadReducer(state: RootState, action: RootAction) {
    if (isActionOf(uploadState, action)) {
        const result = {...state};
        return Object.assign(result, action.payload);
    }
    return state;
}