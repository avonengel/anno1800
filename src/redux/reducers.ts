import {RootState} from "./store";
import {isActionOf} from "typesafe-actions";
import {uploadState} from "./actions";
import {RootAction} from "./types";

export function stateUploadReducer(state: RootState, action: RootAction) {
    if (isActionOf(uploadState, action)) {
        const result = {...state};
        return Object.assign(result, action.payload);
    }
    return state;
}