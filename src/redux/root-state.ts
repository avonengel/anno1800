import {IslandState} from "./islands/types";
import {FactoryState, ProductState} from "./production/types";
import {TradeState} from "./trade/reducers";
import {PublicServiceStateByIslandId} from "./publicservices/types";
import {newPopulationStateObject} from "./islands/reducers";

export interface RootState {
    readonly island: IslandState,
    readonly products: { [islandId: number]: { [productId: number]: ProductState } }
    readonly factories: { [islandId: number]: { [factoryId: number]: FactoryState } },
    readonly selectedIsland: number,
    readonly trades: TradeState,
    readonly publicServices: PublicServiceStateByIslandId,
    readonly productFilter: {
        filterType: number,
        filter: string,
    },
}

export const initialState: Readonly<RootState> = {
    island: {
        islandIds: [1],
        islandsById: {
            1: {
                id: 1,
                name: "Ditchwater",
                population: newPopulationStateObject(),
            },
        }
    },
    products: {},
    factories: {},
    selectedIsland: 1,
    trades: {
        tradesById: {},
        allTradeIds: [],
    },
    publicServices: {
        byIslandId: {}
    },
    productFilter: {
        filterType: 500514,
        filter: "All Goods",
    }
};