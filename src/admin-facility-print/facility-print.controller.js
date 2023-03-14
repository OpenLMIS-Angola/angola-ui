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

// AO-744: Extend Admin Products and Facilities pages with print option
(function() {
    'use strict';
    /**
     * @ngdoc controller
     * @name admin-facility-print.controller:FacilityPrintController
     *
     * @description
     * Provides methods for Print modal. Allows to generate reports in 
     * excel, csv and pdf formats
     */
    angular
        .module('admin-facility-print')
        .controller('FacilityPrintController', FacilityPrintController);

    FacilityPrintController.$inject = [
        '$state', '$stateParams', 'openlmisUrlFactory',
        'stateTrackerService', '$window', 'accessTokenFactory'
    ];

    function FacilityPrintController($state, $stateParams, openlmisUrlFactory,
                                     stateTrackerService, $window, accessTokenFactory) {
        var vm = this;

        vm.$onInit = onInit;
        vm.print = print;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc method
         * @methodOf admin-facility-print.controller:FacilityPrintController
         * @name $onInit
         *
         * @description
         * Initialization method of the FacilityPrintController.
         */
        function onInit() {
            vm.facilityName = $stateParams.name;
            vm.geographicZone = $stateParams.zoneId;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-print.controller:FacilityPrintController
         * @name print
         *
         * @description
         * Print and generate report in chosen format.
         */
        function print() {
            var facilityName = vm.facilityName ? vm.facilityName : '';
            var geographicZone =  vm.geographicZone ? vm.geographicZone : '';
            var downloadOption = vm.downloadOption === 'excel' ? 'xlsx' : vm.downloadOption;
            var reportUrl = '/api/reports/templates/angola/4053ba54-02ad-4848-887a-67e769844088' +
            '/' + downloadOption + '?facility_name=' + facilityName +
            '&geographic_zone_id=' + geographicZone;
            var url = accessTokenFactory.addAccessToken(
                openlmisUrlFactory(reportUrl)
            );
            this.tab = $window.open('', '_blank');
            this.tab.location.href = url;
        }
    }
})();
// AO-744: ends here
