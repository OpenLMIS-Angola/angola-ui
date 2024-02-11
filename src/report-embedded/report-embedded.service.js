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
        .module('report-embedded')
        .factory('reportEmbeddedService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/embeddedReports'), {}, {
            get: {
                method: 'GET',
                url: openlmisUrlFactory('/api/embeddedReports/:id')
            },
            post: {
                method: 'POST',
                url: openlmisUrlFactory('/api/embeddedReports')
            },
            remove: {
                method: 'POST',
                url: openlmisUrlFactory('/api/embeddedReports/:id')
            },
            getAllByCategory: {
                method: 'POST',
                url: openlmisUrlFactory('/api/embeddedReports?category=:categoryName')
            }
        });

        return {
            get: get,
            getAll: getAll,
            post: post,
            remove: remove,
            getAllByCategory: getAllByCategory
        };

        function getAll() {
            return resource.getAll().$promise;
        }

        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        function post() {
            return resource.post().$promise;
        }

        function remove(id) {
            return resource.remove({
                id: id
            }).$promise;
        }

        function getAllByCategory(categoryName) {
            return resource.remove({
                categoryName: categoryName
            }).$promise;
        }

    }
})();