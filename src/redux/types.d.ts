import {Action, ActionType} from 'typesafe-actions';
import * as islandActions from "./islands/actions";
import * as productActions from "./production/actions";
import * as tradeActions from "./trade/actions";
import * as publicServiceActions from "./publicservices/actions";
import * as productFilterActions from "./productFilter/actions";


export type RootAction = ActionType<typeof islandActions>
    | ActionType<typeof productActions>
    | ActionType<typeof tradeActions>
    | ActionType<typeof publicServiceActions>
    | ActionType<typeof productFilterActions>;

declare module 'typesafe-actions' {
    interface Types {
        RootAction: RootAction;
    }
}
