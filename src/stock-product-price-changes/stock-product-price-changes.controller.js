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

    controller.$inject = ['productPriceChanges'];

    function controller(productPriceChanges) {
        var vm = this;

        vm.$onInit = onInit;
        vm.productPriceChanges = [];
        vm.displayedLineItems = [];

        function onInit() {

            var items = [];
            // angular.forEach(stockCard.lineItems, function(lineItem) {
            //     if (lineItem.stockAdjustments.length > 0) {
            //         angular.forEach(lineItem.stockAdjustments.slice().reverse(), function(adjustment, i) {
            //             var lineValue = angular.copy(lineItem);
            //             if (i !== 0) {
            //                 lineValue.stockOnHand = previousSoh;
            //             }
            //             lineValue.reason = adjustment.reason;
            //             lineValue.quantity = adjustment.quantity;
            //             lineValue.stockAdjustments = [];
            //             items.push(lineValue);
            //             previousSoh = lineValue.stockOnHand - getSignedQuantity(adjustment);
            //         });
            //     } else {
            //         items.push(lineItem);
            //     }
            // });

            vm.productPriceChanges = productPriceChanges;
            vm.productPriceChanges.lineItems = items;
        }

    }
})();
