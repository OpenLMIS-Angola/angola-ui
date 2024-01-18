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
        .module('stock-price-changes')
        .config(routes);

    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
        $stateProvider.state('openlmis.stockmanagement.stockPriceChanges', {
            isOffline: true,
            url: '/stockPriceChanges'
                + '?facility&program&supervised&includeInactive'
                + '&productCode&productName&lotCode&stockCardListPage&stockCardListSize',
            label: 'stockPriceChanges.title',
            priority: 1,
            showInNavigation: true,
            views: {
                '@openlmis': {
                    controller: 'StockPriceChangesController',
                    controllerAs: 'vm',
                    templateUrl: 'stock-price-changes/stock-price-changes.html'
                }
            },
            accessRights: [STOCKMANAGEMENT_RIGHTS.PRICE_CHANGES_VIEW],
            resolve: {
                facilityProgramData: function(facilityProgramCacheService, offlineService, $q) {
                    if (offlineService.isOffline()) {
                        return facilityProgramCacheService
                            .loadData('openlmis.stockmanagement.stockCardSummaries');
                    }
                    return $q.resolve();
                },
                params: function($stateParams) {
                    var paramsCopy = angular.copy($stateParams);

                    paramsCopy.facilityId = $stateParams.facility;
                    paramsCopy.programId = $stateParams.program;
                    paramsCopy.includeInactive = $stateParams.includeInactive;

                    paramsCopy.orderableCode = $stateParams.productCode;
                    paramsCopy.orderableName = $stateParams.productName;
                    paramsCopy.nonEmptyOnly = true;

                    // size is set 2147483647, because StockCardSummaryRepository.query is taking default value 10
                    // which would have cut off the items if there were more than 10 of them
                    paramsCopy.size = 2147483647;

                    delete paramsCopy.facility;
                    delete paramsCopy.program;
                    delete paramsCopy.supervised;

                    return paramsCopy;
                },
                stockCardSummaries: function(StockCardSummaryRepository, StockCardSummaryRepositoryImpl,
                    $stateParams, params) {
                    if ($stateParams.program) {
                        return new StockCardSummaryRepository(new StockCardSummaryRepositoryImpl())
                            .query(params);
                    }
                }
            }
        });
    }
})();