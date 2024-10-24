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
     * @name openlmis-home-page-report.controller:OpenlmisHomePageReportController      *
     * @description
     * Manages the openlmis-home-page-report component
     */
    angular
        .module('openlmis-home-page-report')
        .controller('OpenlmisHomePageReportController', OpenlmisHomePageReportController);

    OpenlmisHomePageReportController.$inject = ['reportEmbeddedService', '$sce'];

    function OpenlmisHomePageReportController(reportEmbeddedService, $sce) {
        var vm = this;
        var DASHBOARD_REPORT_URL = '3a792c67-1221-4d15-bbc9-cb3573b53e4c';
        vm.report = undefined;
        vm.$onInit = onInit;

        function onInit() {
            reportEmbeddedService.get(DASHBOARD_REPORT_URL).then(function(report) {
                vm.report = report;
                var trustedUrl = $sce.trustAsResourceUrl(vm.report.url);
                vm.report.url = trustedUrl;
            });
        }
    }
})();
