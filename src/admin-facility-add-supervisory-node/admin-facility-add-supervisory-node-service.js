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
     * @name admin-facility-add-supervisory-node.AdminFacilityAddSupervisoryNodeService
     *
     * @description
     * Responsible for retrieving supervisory nodes from the server.
     */
    angular
        .module('admin-facility-add-supervisory-node')
        .service('AdminFacilityAddSupervisoryNodeService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/supervisoryNodes'), {}, {
            create: {
                url: referencedataUrlFactory('/api/supervisoryNodes'),
                method: 'POST'
            }
        });

        this.get = get;
        this.create = create;

        function get() {
            return resource.get().$promise;
        }

        function create(payload) {
            return resource.create(payload).$promise;
        }
    }

})();