import {Store, StoreEnhancer} from "redux";
import {AutoRehydrateConfig, OnComplete, Persistor, PersistorConfig} from "redux-persist";

declare module "redux-persist-immutable" {
    export function autoRehydrate<State>(autoRehydrateConfig?: AutoRehydrateConfig): StoreEnhancer<State>;

    export function persistStore<State>(store: Store<State>, persistorConfig?: PersistorConfig, onComplete?: OnComplete<Partial<State>>): Persistor;
}