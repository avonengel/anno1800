import {createStandardAction} from "typesafe-actions";

export const updateFilterType = createStandardAction('productFilter/UPDATE_FILTER_TYPE')<number>();

export const updateFilter = createStandardAction('productFilter/UPDATE_FILTER')<string>();
