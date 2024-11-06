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

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name offline-events-indicator.controller:OfflineEventsIndicatorController
     *
     * @description
     * Exposes count of the pending offline events or count of stock event sync errors.
     */
    angular
        .module('openlmis-offline-events-indicator')
        .controller('OfflineEventsIndicatorController', controller);

    controller.$inject = ['offlineEventsService', '$rootScope', '$state'];

    function controller(offlineEventsService, $rootScope, $state) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToPendingOfflineEventsPage = goToPendingOfflineEventsPage;
        vm.goToSynchronizationErrorsPage = goToSynchronizationErrorsPage;

        /**
         * @ngdoc property
         * @propertyOf offline-events-indicator.controller:OfflineEventsIndicatorController
         * @name pendingEventsCount
         * @type {Number}
         *
         * @description
         * Holds pending offline events count.
         */
        vm.pendingEventsCount;

        /**
         * @ngdoc property
         * @propertyOf offline-events-indicator.controller:OfflineEventsIndicatorController
         * @name offlineSyncErrorsCount
         * @type {Number}
         *
         * @description
         * Holds event synchronization errors count.
         */
        vm.offlineSyncErrorsCount;

        function onInit() {
            offlineEventsService.getCountOfPendingOfflineEvents()
                .then(function(result) {
                    vm.pendingEventsCount = result;
                });

            offlineEventsService.getCountOfSyncErrorEvents()
                .then(function(result) {
                    vm.offlineSyncErrorsCount = result;
                });
        }

        /**
         * @ngdoc method
         * @methodOf offline-events-indicator.controller:OfflineEventsIndicatorController
         * @name goToPendingOfflineEventsPage
         *
         * @description
         * Takes the user to the pending offline events page.
         */
        function goToPendingOfflineEventsPage() {
            $state.go('openlmis.pendingOfflineEvents');
        }

        /**
         * @ngdoc method
         * @methodOf offline-events-indicator.controller:OfflineEventsIndicatorController
         * @name goToSynchronizationErrorsPage
         *
         * @description
         * Takes the user to the synchronization errors page.
         */
        function goToSynchronizationErrorsPage() {
            $state.go('openlmis.eventsSynchronizationErrors');
        }

        $rootScope.$on('openlmis-referencedata.offline-events-indicator', function() {
            offlineEventsService.getCountOfPendingOfflineEvents()
                .then(function(result) {
                    vm.pendingEventsCount = result;
                });

            offlineEventsService.getCountOfSyncErrorEvents()
                .then(function(result) {
                    vm.offlineSyncErrorsCount = result;
                });
        });
    }

})();
