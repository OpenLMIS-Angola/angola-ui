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
     * @name admin-orderable-print.controller:OrderablePrintController
     *
     * @description
     * Provides methods for Print modal. Allows to generate reports in 
     * excel, csv and pdf formats
     */
    angular
        .module('admin-orderable-print')
        .controller('OrderablePrintController', OrderablePrintController);

    OrderablePrintController.$inject = [
        '$state', '$stateParams', 'openlmisUrlFactory',
        'stateTrackerService', '$window', 'accessTokenFactory'
    ];

    function OrderablePrintController($state, $stateParams, openlmisUrlFactory,
                                      stateTrackerService, $window, accessTokenFactory) {
        var vm = this;

        vm.$onInit = onInit;
        vm.print = print;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;
        vm.downloadOption = 'pdf';

        /**
         * @ngdoc method
         * @methodOf admin-orderable-print.controller:OrderablePrintController
         * @name $onInit
         *
         * @description
         * Initialization method of the OrderablePrintController.
         */
        function onInit() {
            vm.code = $stateParams.code;
            vm.name = $stateParams.name;
            vm.program = $stateParams.program;
        }

        function print() {
            var code = $stateParams.code ? $stateParams.code : '';
            var name =  $stateParams.name ? $stateParams.name : '';
            var program = $stateParams.program ? $stateParams.program : '';
            var downloadOption = vm.downloadOption === 'excel' ? 'xlsx' : vm.downloadOption;
            var reportUrl = '/api/reports/templates/angola/571ee24d-df1b-4d57-ab5d-b88025116524' +
            '/' + downloadOption + '?name=' + name +
            '&&code=' + code + '&&program_code=' + program;
            var url = accessTokenFactory.addAccessToken(
                openlmisUrlFactory(reportUrl)
            );
            if (downloadOption === 'pdf') {
                this.tab = $window.open('', '_blank');
                this.tab.location.href = url;
            } else {
                var a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            vm.goToPreviousState();
        }
    }
})();
// AO-744: ends here
