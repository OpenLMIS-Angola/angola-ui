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
     * @name stock-price-changes:stockProductPriceChangesController
     *
     * @description
     * Controller in charge of displaying one product price changes.
     */
    angular
        .module('report-embedded')
        .controller('reportEmbeddedController', controller);

    controller.$inject = ['reportEmbeddedService', 'loadingModalService', '$state'];

    function controller(reportEmbeddedService, loadingModalService, $state) {
        var vm = this;

        vm.add = add;
        vm.openEmbeddedReport = openEmbeddedReport;

        vm.reportsList = undefined;

        function onInit() {
            loadingModalService.open();
            loadReports();
        }

        function loadReports() {

            var reportsList = {
                stocks: [],
                requisitions: [],
                orders: [],
                administrations: []
            };

            reportEmbeddedService.getAll()
                .then(function(reports) {
                    reports.content.forEach(function(report) {
                        if (report.category === 'Stock') {
                            reportsList.stocks.push(report);
                        }
                        if (report.category === 'Requisition') {
                            reportsList.requisitions.push(report);
                        }
                        if (report.category === 'Order') {
                            reportsList.orders.push(report);
                        }
                        if (report.category === 'Administration') {
                            reportsList.administrations.push(report);
                        }
                    });

                    vm.reportsList = reportsList;
                    loadingModalService.close();
                });
        }

        function add() {
            $state.go('openlmis.reports.embedded.add');
        }

        function openEmbeddedReport(id) {
            $state.go('openlmis.reports.embedded.view', {
                id: id
            });
        }

        vm.$onInit = onInit;
    }
})();