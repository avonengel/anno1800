import {ActionType} from 'typesafe-actions';
import * as islandActions from "./islands/actions";
import * as productActions from "./production/actions";
import * as tradeActions from "./trade/actions";


export type RootAction = ActionType<typeof islandActions>
    | ActionType<typeof productActions>
    | ActionType<typeof tradeActions>;

declare module 'typesafe-actions' {
    interface Types {
        RootAction: RootAction;
    }
}
