import {AnyAction, Reducer} from "redux";

const initialState = {};

const IdentityReducer: Reducer<typeof initialState, AnyAction> = (state, action) => {
    if (state === undefined) {
        return initialState;
    }
    return state;
};
export default IdentityReducer;