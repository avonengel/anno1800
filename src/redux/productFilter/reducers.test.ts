import {initialState} from "../root-state";
import {FILTERS} from "../../data/filterAssets";
import {updateFilter, updateFilterType} from "./actions";
import {productFilterReducer} from "./reducers";

describe('productFilterReducer', () => {
    describe('updateFilterType', () => {
        it('should set the filter type to the new value', () => {
            // Arrange
            let state = initialState;
            const selectedFilter = FILTERS[0];

            // Act
            state = productFilterReducer(state, updateFilterType(selectedFilter.guid));

            // Assert
            expect(state.productFilter.filterType).toBe(selectedFilter.guid);
        });
    });

    describe('updateFilter', () => {
        it('should set the filter to the new value', () => {
            // Arrange
            let state = initialState;
            const selectedFilterType = FILTERS[0];
            let filterName;
            for (let filter in selectedFilterType.options) {
                filterName = filter;
                break;
            }

            // Act
            state = productFilterReducer(state, updateFilter(filterName as string));

            // Assert
            expect(state.productFilter.filter).toBe(filterName);
        });
    });

});