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
        .module('openlmis-unit-add')
        .service('unitOfOrderableService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory', 'offlineService',
        'localStorageFactory', '$q'];

    function service($resource, referencedataUrlFactory, offlineService, localStorageFactory, $q) {

        var allUnitOfOrderablesOffline = localStorageFactory('unitOfOrderables'),
            resource = $resource(referencedataUrlFactory('/api/unitOfOrderables'), {}, {
                getAll: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                }
            });

        return {
            getAll: getAll,
            create: create,
            clearCachedUnitOfOrderables: clearCachedUnitOfOrderables
        };

        function getAll() {
            if (offlineService.isOffline()) {
                return $q.resolve(allUnitOfOrderablesOffline.getAll());
            }

            return resource.getAll().$promise.then(function(response) {
                allUnitOfOrderablesOffline.putAll(response.content);
                return response.$promise;
            });
        }

        function create(unit) {
            return resource.create(unit).$promise;
        }

        function clearCachedUnitOfOrderables() {
            return allUnitOfOrderablesOffline.clearAll();
        }
    }
})();