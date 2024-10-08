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
     * @ngdoc service
     * @name referencedata-lot.lotService
     *
     * @description
     * Responsible for retrieving lots information from server.
     */
    angular
        .module('referencedata-lot')
        .service('lotService', service);

    service.$inject = [
        'LotResource', 'localStorageFactory', 'offlineService', '$q', 'alertService'
    ];

    function service(LotResource, localStorageFactory, offlineService, $q, alertService) {

        var lotsOffline = localStorageFactory('lots');
        var lotResource = new LotResource();

        this.query = query;
        this.clearLotsOffline = clearLotsOffline;
        this.cacheAllLots = cacheAllLots;

        /**
         * @ngdoc method
         * @methodOf referencedata-lot.lotService
         * @name query
         *
         * @description
         * Retrieves lots that match given params.
         * If user is online it stores lots into offline storage.
         *
         * @param  {String}  queryParams      the search parameters
         */
        function query(queryParams) {
            if (offlineService.isOffline()) {
                return getFromLocalStorage(queryParams);
            }

            return lotResource.query(queryParams)
                .then(function(lots) {
                    lotsOffline.putAll(lots.content);
                    return lots;
                });
        }

        function cacheAllLots() {
            return lotResource.query()
                .then(function(lots) {
                    lotsOffline.putAll(lots.content);
                    return lots;
                });
        }

        function getFromLocalStorage(queryParams) {
            var lots = {},
                paramName = Object.keys(queryParams)[0];
            lots.content = [];

            queryParams[paramName].forEach(function(param) {
                return getByParamFromLocalStorage(lots, paramName, param);
            });

            if (lots.content.length === 0) {
                alertService.error('referencedataLot.lotsEmpty.offlineMessage');
                return $q.reject();
            }

            return $q.resolve(lots);
        }

        function getByParamFromLocalStorage(lots, paramName, param) {
            if (paramName === 'tradeItemId') {
                var cachedLots = lotsOffline.search({
                    tradeItemId: param
                });
                cachedLots.forEach(function(offlineLot) {
                    lots.content.push(offlineLot);
                });

            } else {
                var offlineLot = lotsOffline.getBy(paramName, param);
                if (offlineLot) {
                    lots.content.push(offlineLot);
                }
            }
        }

        function clearLotsOffline() {
            lotsOffline.clearAll();
        }
    }
})();
