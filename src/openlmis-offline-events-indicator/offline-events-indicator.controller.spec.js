/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('OfflineEventsIndicatorController', function() {

    beforeEach(function() {
        module('openlmis-offline-events-indicator');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
            this.offlineEventsService = $injector.get('offlineEventsService');
        });

        this.pendingEventsCount = 2;
        this.offlineSyncErrorsCount = 1;

        spyOn(this.offlineEventsService, 'getCountOfPendingOfflineEvents')
            .andReturn(this.$q.resolve(this.pendingEventsCount));
        spyOn(this.offlineEventsService, 'getCountOfSyncErrorEvents')
            .andReturn(this.$q.resolve(this.offlineSyncErrorsCount));

        spyOn(this.$state, 'go').andReturn();

        this.vm = this.$controller('OfflineEventsIndicatorController');
    });

    describe('$onInit', function() {

        it('should expose pending offline events and offline sync errors', function() {
            this.vm.$onInit();
            this.$rootScope.$apply();

            expect(this.offlineEventsService.getCountOfPendingOfflineEvents).toHaveBeenCalled();
            expect(this.vm.pendingEventsCount).toEqual(this.pendingEventsCount);
            expect(this.offlineEventsService.getCountOfSyncErrorEvents).toHaveBeenCalled();
            expect(this.vm.offlineSyncErrorsCount).toEqual(this.offlineSyncErrorsCount);
        });

        it('should update offline events count and errors', function() {
            this.$rootScope.$emit('openlmis-referencedata.offline-events-indicator');
            this.$rootScope.$apply();

            expect(this.offlineEventsService.getCountOfPendingOfflineEvents).toHaveBeenCalled();
            expect(this.offlineEventsService.getCountOfSyncErrorEvents).toHaveBeenCalled();
        });

    });

    describe('goToPendingOfflineEventsPage', function() {

        it('should call state go method', function() {
            this.vm.goToPendingOfflineEventsPage();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.pendingOfflineEvents');
        });
    });

    describe('goToSynchronizationErrorsPage', function() {

        it('should call state go method', function() {
            this.vm.goToSynchronizationErrorsPage();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.eventsSynchronizationErrors');
        });
    });
});
