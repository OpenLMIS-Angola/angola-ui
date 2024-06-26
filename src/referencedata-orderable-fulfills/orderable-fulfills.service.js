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
     * @name referencedata-orderable-fulfills.orderableFulfillsService
     *
     * @description
     * Responsible for retrieving orderableFulFills information from server.
     */
    angular
        .module('referencedata-orderable-fulfills')
        .service('orderableFulfillsService', service);

    service.$inject = [
        'OrderableFulfillsResource', 'localStorageFactory', 'offlineService', '$q', 'alertService'
    ];

    function service(OrderableFulfillsResource, localStorageFactory, offlineService, $q, alertService) {

        var orderableFulfillsOffline = localStorageFactory('orderableFulfills');
        var orderableFulfillsResource = new OrderableFulfillsResource();

        this.query = query;
        this.clearOrderableFulfillsOffline = clearOrderableFulfillsOffline;

        /**
         * @ngdoc method
         * @methodOf referencedata-orderable-fulfills.orderableFulfillsService
         * @name query
         *
         * @description
         * Retrieves orderableFulFills that match given params.
         * If user is online it stores orderableFulFills into offline storage.
         *
         * @param  {String}  queryParams      the search parameters
         */
        function query(queryParams) {
            if (offlineService.isOffline()) {
                return getFromLocalStorage(queryParams);
            }

            return orderableFulfillsResource.query(queryParams)
                .then(function(orderableFulfills) {
                    var orderableFulfillsToStore = Object.keys(
                        orderableFulfills
                    ).map(function(item) {
                        if (!isPromiseAttribute(item)) {
                            var orderableFulfillJson = {
                                id: item
                            };
                            Object.entries(orderableFulfills[item]).forEach(
                                function(entry) {
                                    orderableFulfillJson[entry[0]] = entry[1];
                                }
                            );

                            return orderableFulfillJson;
                        }
                    });

                    orderableFulfillsOffline.putAll(orderableFulfillsToStore);

                    return orderableFulfills;
                });
        }

        function getFromLocalStorage(queryParams) {
            var orderableFulfills = [],
                paramName = Object.keys(queryParams)[0];

            queryParams[paramName].forEach(function(param) {
                var cachedOrderableFulfill = orderableFulfillsOffline.getBy(paramName, param);

                if (cachedOrderableFulfill) {
                    orderableFulfills[param] = cachedOrderableFulfill;
                }
            });

            if (Object.keys(orderableFulfills).length === 0) {
                alertService.error('referencedataOrderableFulfills.offlineMessage');
                return $q.reject();
            }
            return $q.resolve(orderableFulfills);
        }

        function clearOrderableFulfillsOffline() {
            return orderableFulfillsOffline.clearAll();
        }

        function isPromiseAttribute(item) {
            return item === '$promise' || item === '$resolved';
        }
    }
})();
