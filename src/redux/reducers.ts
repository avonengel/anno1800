import {AnyAction} from "redux";
import {RootState} from "./store";
import {isActionOf} from "typesafe-actions";
import {uploadState} from "./actions";

export function stateUploadReducer(state: RootState, action: AnyAction) {
    if (isActionOf(uploadState, action)) {
        const result = {...state};
        return Object.assign(result, action.payload);
    }
    return state;
}