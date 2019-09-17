import {ActionType} from 'typesafe-actions';
import * as islandActions from "./islands/actions";
import * as productActions from "./production/actions";
import * as tradeActions from "./trade/actions";
import * as publicServiceActions from "./publicservices/actions";


export type RootAction = ActionType<typeof islandActions>
    | ActionType<typeof productActions>
    | ActionType<typeof tradeActions>
    | ActionType<typeof publicServiceActions>;

declare module 'typesafe-actions' {
    interface Types {
        RootAction: RootAction;
    }
}
