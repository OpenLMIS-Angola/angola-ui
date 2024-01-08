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
     * @name stock-price-changes.controller:StockPriceChangesListController
     *
     * @description
     * Controller responsible displaying Stock Card Summaries.
     */
    angular
        .module('stock-price-changes')
        .controller('StockPriceChangesController', controller);

    controller.$inject = [
        'loadingModalService', '$state', '$stateParams', 'StockCardSummaryRepositoryImpl', 'stockCardSummaries',
        'offlineService', '$scope', 'STOCKCARD_STATUS', 'messageService', 'paginationService'
    ];

    function controller(loadingModalService, $state, $stateParams, StockCardSummaryRepositoryImpl, stockCardSummaries,
                        offlineService, $scope, STOCKCARD_STATUS, messageService, paginationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.loadStockCardSummaries = loadStockCardSummaries;
        vm.viewSingleProduct = viewSingleProduct;
        vm.search = search;
        vm.offline = offlineService.isOffline;

        /**
         * @ngdoc property
         * @propertyOf stock-price-changes.controller:StockPriceChangesListController
         * @name productCode
         * @type {String}
         *
         */
        vm.productCode = $stateParams.productCode;

        /**
         * @ngdoc property
         * @propertyOf stock-price-changes.controller:StockPriceChangesListController
         * @name productName
         * @type {String}
         *
         */
        vm.productName = $stateParams.productName;

        /**
         * @ngdoc property
         * @propertyOf stock-price-changes.controller:StockPriceChangesListController
         * @name stockCardSummaries
         * @type {Array}
         *
         * @description
         * List of Stock Card Summaries.
         */
        vm.stockCardSummaries = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-price-changes.controller:StockPriceChangesListController
         * @name displayStockCardSummaries
         * @type {Array}
         *
         * @description
         *  Holds current display list of Stock Card Summaries.
         */
        vm.displayStockCardSummaries = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-price-changes.controller:StockPriceChangesListController
         * @name includeInactive
         * @type {Boolean}
         *
         * @description
         * When true shows inactive items
         */
        vm.includeInactive = $stateParams.includeInactive;

        /**
         * @ngdoc method
         * @methodOf stock-price-changes.controller:StockPriceChangesListController
         * @name getStockSummaries
         *
         * @description
         * Initialization method for StockPriceChangesListController.
         */
        function onInit() {
            vm.displayStockCardSummaries = angular.copy(stockCardSummaries);
            checkCanFulFillIsEmpty();
            paginationService.registerList(null, $stateParams, function() {
                return vm.displayStockCardSummaries;
            }, {
                paginationId: 'stockCardList'
            });
            $scope.$watchCollection(function() {
                return vm.pagedList;
            }, function(newList) {
                if (vm.offline()) {
                    vm.displayStockCardSummaries = newList;
                }
            }, true);
        }

        /**
         * @ngdoc method
         * @methodOf stock-price-changes.controller:StockPriceChangesListController
         * @name loadStockCardSummaries
         *
         * @description
         * Responsible for retrieving Stock Card Summaries based on selected program and facility.
         */
        function loadStockCardSummaries() {
            var stateParams = angular.copy($stateParams);

            stateParams.facility = vm.facility.id;
            stateParams.program = vm.program.id;
            stateParams.active = STOCKCARD_STATUS.ACTIVE;
            stateParams.supervised = vm.isSupervised;
            stateParams.productCode = vm.productCode;
            stateParams.productName = vm.productName;

            $state.go('openlmis.stockmanagement.stockPriceChanges', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-price-changes.controller:StockPriceChangesListController
         * @name viewSingleProduct
         *
         * @description
         * Go to the clicked stock card's page to view its details.
         *
         * @param {String} productId the Product UUID
         */
        function viewSingleProduct(productId) {
            $state.go('openlmis.stockmanagement.stockPriceChanges.singleProduct', {
                singleProductId: productId
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-price-changes.controller:StockPriceChangesListController
         * @name search
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.facility = vm.facility.id;
            stateParams.program = vm.program.id;
            stateParams.supervised = vm.isSupervised;
            stateParams.includeInactive = vm.includeInactive;
            stateParams.productCode = vm.productCode;
            stateParams.productName = vm.productName;
            stateParams.page = 0;
            stateParams.size = 10;

            $state.go('openlmis.stockmanagement.stockPriceChanges', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-price-changes.controller:StockPriceChangesListController
         * @name checkCanFulFillIsEmpty
         *
         * @description
         * Filters only not empty displayStockCardSummaries.
         */
        function checkCanFulFillIsEmpty() {
            vm.displayStockCardSummaries = vm.displayStockCardSummaries.filter(function(summary) {
                if (summary.canFulfillForMe.length !== 0) {
                    return summary;
                }
            });
        }
    }
})();
