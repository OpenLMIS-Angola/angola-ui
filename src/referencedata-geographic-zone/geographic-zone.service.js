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
     * @name referencedata-geographic-zone.geographicZoneService
     *
     * @description
     * Responsible for retrieving all geographic zone information from server.
     */
    angular
        .module('referencedata-geographic-zone')
        .service('geographicZoneService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/geographicZones/:id'), {}, {
            getAll: {
                url: referencedataUrlFactory('/api/geographicZones'),
                method: 'GET'
            },
            search: {
                url: referencedataUrlFactory('/api/geographicZones/search'),
                method: 'POST'
            },
            create: {
                url: referencedataUrlFactory('/api/geographicZones'),
                method: 'POST'
            }
        });

        this.get = get;
        this.getAll = getAll;
        this.search = search;
        this.create = createGeoZone;

        /**
         * @ngdoc method
         * @methodOf referencedata-geographic-zone.geographicZoneService
         * @name get
         *
         * @description
         * Gets geographic zone by id.
         *
         * @param  {String}  id the geographic zone UUID
         * @return {Promise}    the geographic zone object
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-geographic-zone.geographicZoneService
         * @name getAll
         *
         * @description
         * Gets all geographic zones.
         *
         * @param  {Object}  paginationParams the pagination params: page and size
         * @return {Promise}                   the paginated object of all geographic zones
         */
        function getAll(paginationParams) {
            return resource.getAll(paginationParams).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-geographic-zone.geographicZoneService
         * @name search
         *
         * @description
         * Searches Geographic Zones using given parameters.
         *
         * @param  {Object}  params the pagination and query parameters
         * @return {Promise}        the requested page of filtered geographic zones
         */
        function search(params) {
            var paginationParams = {
                    page: params.page,
                    size: params.size,
                    sort: params.sort
                },
                queryParams = angular.copy(params);

            delete queryParams.page;
            delete queryParams.size;
            delete queryParams.sort;

            return resource.search(paginationParams, queryParams).$promise;
        }

        function createGeoZone(geoZone) {
            return resource.create(geoZone).$promise;
        }
    }
})();
