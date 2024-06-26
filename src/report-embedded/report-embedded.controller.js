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

    controller.$inject = ['loadingModalService', '$state', 'Categories', 'Reports'];

    function controller(loadingModalService, $state, Categories, Reports) {
        var vm = this;

        vm.$onInit = onInit;

        vm.openEmbeddedReport = openEmbeddedReport;

        vm.categories = Categories;
        vm.reports = Reports;
        vm.result = {};

        function onInit() {
            loadingModalService.open();
            sortReports();
        }

        function sortReports() {
            vm.categories.forEach(function(category) {
                vm.result[category.name] = [];
            });

            vm.reports.forEach(function(element) {
                var categoryName = element.category.name;
                if (vm.result[categoryName] && element.enabled) {
                    vm.result[categoryName].push(element);
                }
            });

            loadingModalService.close();
        }

        function openEmbeddedReport(id) {
            $state.go('openlmis.reports.embedded.view', {
                id: id
            });
        }
    }
})();