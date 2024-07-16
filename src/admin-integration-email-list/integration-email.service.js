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
        .module('admin-integration-email-list')
        .factory('integrationEmailService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/integrationEmails'), {}, {
            get: {
                method: 'GET',
                url: openlmisUrlFactory('/api/integrationEmails/:id')
            },
            getAll: {
                method: 'GET',
                url: openlmisUrlFactory('/api/integrationEmails')
            },
            add: {
                method: 'POST',
                url: openlmisUrlFactory('/api/integrationEmails')
            },
            update: {
                method: 'PUT',
                url: openlmisUrlFactory('/api/integrationEmails/:id')
            },
            remove: {
                method: 'DELETE',
                url: openlmisUrlFactory('/api/integrationEmails/:id')
            }
        });

        return {
            get: get,
            getAll: getAll,
            add: add,
            update: update,
            remove: remove
        };

        function getAll(paginationParams) {
            return resource.getAll(paginationParams).$promise;
        }

        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        function add(email) {
            return resource.add(email).$promise;
        }

        function update(email) {
            return resource.update({
                id: email.id
            }, email).$promise;
        }

        function remove(id) {
            return resource.remove({
                id: id
            }).$promise;
        }
    }
})();