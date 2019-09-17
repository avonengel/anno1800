export interface PublicServiceState {
    enabledPublicServices: number[];
}

export interface PublicServiceStateByIslandId {
    byIslandId: {[islandId: number]: PublicServiceState }
}
