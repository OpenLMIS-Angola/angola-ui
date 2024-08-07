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
     * @name stock-card-summary-list.controller:StockCardSummaryListController
     *
     * @description
     * Controller responsible displaying Stock Card Summaries.
     */
    angular
        .module('stock-card-summary-list')
        .controller('StockCardSummaryListController', controller);

    controller.$inject = [
        'loadingModalService', '$state', '$stateParams', 'StockCardSummaryRepositoryImpl', 'stockCardSummaries',
        'offlineService', '$scope', 'STOCKCARD_STATUS', 'messageService', 'paginationService', 'unitOfOrderableService',
        'selectedWard'
    ];

    function controller(loadingModalService, $state, $stateParams, StockCardSummaryRepositoryImpl, stockCardSummaries,
                        offlineService, $scope, STOCKCARD_STATUS, messageService, paginationService,
                        unitOfOrderableService, selectedWard) {
        var vm = this;

        vm.$onInit = onInit;
        vm.loadStockCardSummaries = loadStockCardSummaries;
        vm.viewSingleCard = viewSingleCard;
        vm.print = print;
        vm.search = search;
        vm.offline = offlineService.isOffline;
        vm.goToPendingOfflineEventsPage = goToPendingOfflineEventsPage;
        vm.setActiveDisplayType = setActiveDisplayType;
        vm.selectedWard = undefined;
        vm.currentlySelectedWardName = undefined;
        vm.PACKS_DISPLAY_TYPE = 'packs';
        vm.DOSES_DISPLAY_TYPE = 'doses';
        vm.activeDisplayType = vm.DOSES_DISPLAY_TYPE;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name stockCardSummaries
         * @type {Array}
         *
         * @description
         * List of Stock Card Summaries.
         */
        vm.stockCardSummaries = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name displayStockCardSummaries
         * @type {Array}
         *
         * @description
         *  Holds current display list of Stock Card Summaries.
         */
        vm.displayStockCardSummaries = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name includeInactive
         * @type {Boolean}
         *
         * @description
         * When true shows inactive items
         */
        vm.includeInactive = $stateParams.includeInactive;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name productCode
         * @type {String}
         *
         */
        vm.productCode = $stateParams.productCode;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name productName
         * @type {String}
         *
         */
        vm.productName = $stateParams.productName;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name lotCode
         * @type {String}
         *
         */
        vm.lotCode = $stateParams.lotCode;

        // AO-816: Add prices to the Stock On Hand view
        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name totalCost
         * @type {Number}
         *
         * @description
         * Holds total cost of adjustments line items
         */
        vm.totalCost = 0;
        // AO-816: Ends here

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name allUnitsOfOrderable
         * @type {Object[]}
         *
         * @description
         * Holds all available units of orderable
         */
        vm.allUnitsOfOrderable = undefined;

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name getStockSummaries
         *
         * @description
         * Initialization method for StockCardSummaryListController.
         */
        function onInit() {
            vm.selectedWard = selectedWard;
            if (selectedWard) {
                vm.currentlySelectedWardName = selectedWard.name;
            }
            // AO-816: Add prices to the Stock On Hand view
            stockCardSummaries.forEach(function(stockCardSummary) {
                stockCardSummary.orderable.unitPrice = getProductPrice(stockCardSummary);
                stockCardSummary.orderable.totalPrice = stockCardSummary.orderable.unitPrice *
                    stockCardSummary.stockOnHand;
            });

            calculateTotalCost(stockCardSummaries);
            // AO-816: Ends here
            vm.stockCardSummaries = stockCardSummaries;
            vm.displayStockCardSummaries = angular.copy(stockCardSummaries);
            checkCanFulFillIsEmpty();

            unitOfOrderableService.getAll().then(function(response) {
                vm.allUnitsOfOrderable = response.content ? response.content : response;
                vm.assignUnitsToCanFulfill(vm.displayStockCardSummaries);
            });

            paginationService.registerList(null, $stateParams, function() {
                return vm.displayStockCardSummaries;
            }, {
                paginationId: 'stockCardSummaries'
            });

            $scope.$watchCollection(function() {
                return vm.pagedList;
            }, function(newList) {
                if (vm.offline() && !!newList) {
                    vm.displayStockCardSummaries = newList;
                    vm.assignUnitsToCanFulfill(vm.displayStockCardSummaries);
                }
            }, true);
        }

        vm.assignUnitsToCanFulfill = function(stockCardSummaries) {
            stockCardSummaries.forEach(function(stockCardSummary) {
                stockCardSummary.canFulfillForMe.forEach(function(item) {
                    item.unit = getOrderableUnit(item.unitOfOrderable);
                    item.packsQuantity = item.stockOnHand / item.unit.factor;
                });
            });
        };

        vm.getSohForPacks = function(fulfills) {
            var factor = fulfills.orderable.unit ? fulfills.orderable.unit.factor : 1;
            return fulfills.stockOnHand / factor;
        };

        function getOrderableUnit(orderableUnit) {
            var defaultOrderableUnit = {
                name: '-',
                factor: 1
            };

            if (!orderableUnit) {
                return angular.copy(defaultOrderableUnit);
            }

            var unitOfOrderable = vm.allUnitsOfOrderable.find(function(unit) {
                return unit.id === orderableUnit.id;
            });

            return unitOfOrderable ? {
                name: unitOfOrderable.name,
                factor: unitOfOrderable.factor
            } : angular.copy(defaultOrderableUnit);
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name loadStockCardSummaries
         *
         * @description
         * Responsible for retrieving Stock Card Summaries based on selected program and facility.
         */
        function loadStockCardSummaries() {
            var stateParams = angular.copy($stateParams);

            stateParams.facility = vm.selectedWard ? vm.selectedWard.id : vm.facility.id;
            stateParams.program = vm.program.id;
            stateParams.active = STOCKCARD_STATUS.ACTIVE;
            stateParams.supervised = vm.isSupervised;

            stateParams.productName = vm.productName;
            stateParams.productCode = vm.productCode;
            stateParams.lotCode = vm.lotCode;
            stateParams.ward = vm.selectedWard ? vm.selectedWard.id : undefined;

            $state.go('openlmis.stockmanagement.stockCardSummaries', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name viewSingleCard
         *
         * @description
         * Go to the clicked stock card's page to view its details.
         *
         * @param {String} stockCardId the Stock Card UUID
         */
        function viewSingleCard(stockCardId) {
            $state.go('openlmis.stockmanagement.stockCardSummaries.singleCard', {
                stockCardId: stockCardId
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name print
         *
         * @description
         * Print SOH summary of current selected program and facility.
         */
        function print() {
            new StockCardSummaryRepositoryImpl().print(vm.program.id, vm.facility.id);
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
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
            stateParams.lotCode = vm.lotCode;
            stateParams.page = 0;
            stateParams.size = 10;

            $state.go('openlmis.stockmanagement.stockCardSummaries', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
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
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
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

        // AO-816: Add prices to the Stock On Hand view
        function getProductPrice(product) {
            var programOrderable = product.orderable.programs.find(function(programOrderable) {
                return programOrderable.programId === $stateParams.program;
            });

            return programOrderable.pricePerPack;
        }

        function calculateTotalCost(stockCardSummaries) {
            var sum = 0;
            stockCardSummaries.forEach(function(stockCardSummary) {
                sum += stockCardSummary.orderable.totalPrice;
            });

            vm.totalCost = sum;
        }

        function setActiveDisplayType(displayType) {
            if (displayType === vm.PACKS_DISPLAY_TYPE || displayType === vm.DOSES_DISPLAY_TYPE) {
                vm.activeDisplayType = displayType;
            } else {
                // eslint-disable-next-line no-console
                console.error('No such display type: ' + displayType);
            }
        }
    }
})();