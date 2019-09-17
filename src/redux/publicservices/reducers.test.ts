import {publicServiceReducer} from "./reducers";
import {initialState} from "../store";
import {disablePublicService, enablePublicService} from "./actions";
import {ALL_PUBLIC_SERVICES} from "../../data/assets";

describe('publicServiceReducer', () => {
    describe('enable public service', () => {
        it('should add the public service guid to enabledPublicServices', () => {
            // Arrange
            const islandId = initialState.selectedIsland;
            const publicService = ALL_PUBLIC_SERVICES[0];

            // Act
            let state = publicServiceReducer(initialState, enablePublicService(islandId, publicService.guid));

            // Assert
            expect(state.publicServices.byIslandId[islandId]).toBeDefined();
            expect(state.publicServices.byIslandId[islandId].enabledPublicServices).toContain(publicService.guid);
        });
    });
    describe('disable public service', () => {
        it('should remove the public service guid from enabledPublicServices', () => {
            // Arrange
            const islandId = initialState.selectedIsland;
            const publicService = ALL_PUBLIC_SERVICES[0];
            let state = publicServiceReducer(initialState, enablePublicService(islandId, publicService.guid));

            // Act
            state = publicServiceReducer(state, disablePublicService(islandId, publicService.guid));

            // Assert
            expect(state.publicServices.byIslandId[islandId]).toBeDefined();
            expect(state.publicServices.byIslandId[islandId].enabledPublicServices).not.toContain(publicService.guid);
        });
    });
});