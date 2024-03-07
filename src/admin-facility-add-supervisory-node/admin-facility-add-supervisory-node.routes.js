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

    angular.module('admin-facility-add-supervisory-node').config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.facilities.facility.supervisoryNodes', {
            label: 'adminFacilityAddSupervisoryNode.addSupervisoryNode',
            url: '/addSupervisoryNode&facilityId=:facilityId',
            accessRights: [ADMINISTRATION_RIGHTS.FACILITIES_MANAGE],
            templateUrl: 'admin-facility-add-supervisory-node/admin-facility-add-supervisory-node.html',
            controller: 'AdminFacilitySupervisoryNodeAddController',
            controllerAs: 'vm',
            resolve: {
                supervisoryNodes: function(SupervisoryNodeResource) {
                    return new SupervisoryNodeResource().query()
                        .then(function(response) {
                            return response.content;
                        });
                },
                facilitiesMap: function(facilityService, ObjectMapper) {
                    return facilityService.getAllMinimal()
                        .then(function(facilities) {
                            return new ObjectMapper().map(facilities);
                        });
                },
                supervisoryNodesMap: function(supervisoryNodes, ObjectMapper) {
                    return new ObjectMapper().map(supervisoryNodes);
                }
            }
        });
    }
})();