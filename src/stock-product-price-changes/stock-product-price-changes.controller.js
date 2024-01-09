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
        .module('stock-price-changes')
        .controller('stockProductPriceChangesController', controller);

    controller.$inject = ['productPriceChanges', 'stockCard', '$stateParams', 'facility', 'program'];

    function controller(productPriceChanges, stockCard, $stateParams, facility, program) {
        var vm = this;

        vm.$onInit = onInit;
        vm.productPriceChanges = [];
        vm.displayedLineItems = [];
        vm.stockCard = undefined;
        vm.facility = facility;
        vm.program = program;

        function onInit() {

            var items = [];

            angular.forEach(stockCard, function(lineItem) {
                if ($stateParams.singleProductId === lineItem.orderable.id) {
                    angular.forEach(lineItem.orderable.programs, function(program) {
                        if (program.programId === vm.program.id) {
                            vm.stockCard = lineItem;
                            angular.forEach(program.priceChanges, function(item) {
                                items.push(item);
                            });
                        }
                    });
                }
            });

            vm.productPriceChanges = productPriceChanges;
            vm.productPriceChanges.lineItems = items;
        }

    }
})();