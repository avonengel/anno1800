import {ActionType} from 'typesafe-actions';

export type RootAction = ActionType<typeof import('./actions').default>
    & ActionType<typeof import('./islands/actions').default>
    & ActionType<typeof import('./production/actions').default>
    & ActionType<typeof import('./trade/actions').default>;

declare module 'typesafe-actions' {
    interface Types {
        RootAction: RootAction;
    }
}