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
     * @name admin-facility-view.wardService
     *
     * @description
     * Responsible for retrieving wards from the server.
     */
    angular
        .module('admin-facility-view')
        .service('wardService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/wards/:id'), {}, {
            getWardsByFacility: {
                url: referencedataUrlFactory('/api/wards'),
                method: 'GET',
                isArray: false
            },
            getAllWards: {
                url: referencedataUrlFactory('/api/wards'),
                method: 'GET',
                isArray: false
            },
            saveFacilityWards: {
                url: referencedataUrlFactory('/api/wards/saveAll'),
                method: 'PUT',
                isArray: true
            }
        });

        return {
            getWardsByFacility: getWardsByFacility,
            saveFacilityWards: saveFacilityWards,
            getAllWards: getAllWards
        };

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.wardService
         * @name getAllWards
         *
         * @description
         * Retrieves all available wards.
         *
         * @return {Promise}                   Array of all wards
         */
        function getAllWards() {
            return resource.getAllWards().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.wardService
         * @name getWardsByFacility
         *
         * @description
         * Retrieves wards for the facility.
         *
         * @param  {String}  facilityId        Facility UUID
         * @return {Promise}                   Array of wards
         */
        function getWardsByFacility(queryParams) {
            return resource.getWardsByFacility(queryParams).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.wardService
         * @name saveFacilityWards
         *
         * @description
         * Saves facility wards.
         *
         * @return {Promise}                   Saved wards promise
         */
        function saveFacilityWards(wards) {
            return resource.saveFacilityWards(wards).$promise;
        }
    }
})();