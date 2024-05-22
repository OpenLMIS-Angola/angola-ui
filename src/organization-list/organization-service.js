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
     * @name organization-list.organizationService
     * 
     * @description
     * Responsible for retrieving organizations from the server.
     */
    angular
        .module('organization-list')
        .service('organizationService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {
        var resource = $resource(referencedataUrlFactory('/api/organizations/:id'), {}, {
            getOrganizations: {
                url: referencedataUrlFactory('/api/organizations'),
                method: 'GET',
                isArray: true
            },
            createNewOrganization: {
                url: referencedataUrlFactory('/api/organizations'),
                method: 'POST'
            },
            updateOrganization: {
                method: 'PUT'
            }
        });

        return {
            getOrganizations: getOrganizations,
            createNewOrganization: createNewOrganization,
            updateOrganization: updateOrganization
        };

        /**
         * @ngdoc method
         * @name organization-list.organizationService
         * @methodOf organization-list.organizationService
         * 
         * @description
         * Retrieves organizations from the server.
         */
        function getOrganizations(searchParams) {
            return resource.getOrganizations(searchParams).$promise;
        }

        /**
         * @ngdoc method
         * @name organization-list.organizationService
         * @methodOf organization-list.organizationService
         * 
         * @description
         * Creates a new organization.
         * 
         * @param {Object} organization The organization to create.
         * 
         * @returns {Promise} A promise that will be resolved with the created organization.
         */
        function createNewOrganization(organization) {
            return resource.createNewOrganization(null, organization).$promise;
        }

        /**
         * @ngdoc method
         * @name organization-list.organizationService
         * @methodOf organization-list.organizationService
         * 
         * @description
         * Updates an organization.
         * 
         * @param {Object} organization The organization to update.
         * 
         * @returns {Promise} A promise that will be resolved with the updated organization.
         */
        function updateOrganization(organization) {
            return resource.updateOrganization({
                id: organization.id
            }, organization).$promise;
        }

    }
})();
