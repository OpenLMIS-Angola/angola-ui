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

    angular
        .module('openlmis-home-alerts-panel')
        .controller('openlmisHomeAlertsPanelController', controller);

    controller.$inject = ['openlmisHomeAlertsPanelService'];

    function controller(openlmisHomeAlertsPanelService) {
        var $ctrl = this;
        $ctrl.requisitionsStatusesStats = undefined;
        $ctrl.ordersStatusesStats = undefined;
        $ctrl.requisitionsToBeCreated = undefined;

        $ctrl.$onInit = onInit;

        /*
         * {
                "facilityId": "71f77cac-fe68-4a07-856e-e85bd210f828",
                "requisitionsToBeCreated": 2,
                "statusesStats": {
                    "RELEASED_WITHOUT_ORDER": 0,
                    "RELEASED": 0,
                    "IN_APPROVAL": 0,
                    "SKIPPED": 0,
                    "INITIATED": 1,
                    "SUBMITTED": 0,
                    "APPROVED": 0,
                    "AUTHORIZED": 3,
                    "REJECTED": 0
                }
            }
         *
        * */
        function onInit() {
            openlmisHomeAlertsPanelService.getRequisitionsStatusesData()
                .then(function(requisitionsData) {
                    $ctrl.requisitionsStatusesStats = requisitionsData.statusesStats;
                    $ctrl.requisitionsToBeCreated = requisitionsData.requisitionsToBeCreated;
                    console.log(requisitionsData);
                });

            openlmisHomeAlertsPanelService.getOrdersStatusesData()
                .then(function(ordersData) {
                    $ctrl.ordersStatusesStats = ordersData.statusesStats;
                    console.log(ordersData);
                });
        }
    }
})();
