import {ActionType, createReducer} from "typesafe-actions";
import {initialState, RootState} from "../root-state";
import {updateFilter, updateFilterType} from "./actions";
import iassign from "immutable-assign";
import {FILTERS} from "../../data/filterAssets";

export const productFilterReducer = createReducer(initialState)
    .handleAction(updateFilterType, (state: RootState, action: ActionType<typeof updateFilterType>) => {
        return iassign(state, (s: RootState) => s.productFilter, (filterConfig: {filterType: number, filter: string}) => {
            const selectedFilter = FILTERS.find(f => f.guid === action.payload);
            if (selectedFilter) {
                let firstFilter: string = "";
                for (let filter in selectedFilter.options) {
                    // TODO provide helper function via Filter class?
                    firstFilter = filter;
                    break;
                }
                return {
                    ...filterConfig,
                    filterType: action.payload,
                    filter: firstFilter,
                };
            }
            return {
                ...filterConfig,
                filterType: action.payload,
            }
        });
    })
    .handleAction(updateFilter, (state, action) => {
        return iassign(state, s => s.productFilter.filter, () => action.payload);
    });