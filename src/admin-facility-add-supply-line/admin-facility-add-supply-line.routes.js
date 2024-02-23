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

    angular.module('admin-facility-add-supply-line').config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.facilities.facility.supplyLines', {
            label: 'adminFacilitySupplyLineAdd.addSupplyLine',
            url: '/addSupplyLine&facilityId=:facilityId&supervisoryNodeId=:supervisoryNodeId',
            accessRights: [ADMINISTRATION_RIGHTS.SUPPLY_LINES_MANAGE],
            controller: 'AddFacilitySupplyLineController',
            templateUrl: 'admin-facility-add-supply-line/admin-facility-add-supply-line.html',
            controllerAs: 'vm',
            resolve: {
                programs: function(programService) {
                    return programService.getAll();
                },
                facilities: function(facilityService) {
                    return facilityService.getAllMinimal();
                },
                supervisoryNodes: function(SupervisoryNodeResource) {
                    return new SupervisoryNodeResource().query()
                        .then(function(response) {
                            return response.content;
                        });
                }
            }
        });
    }
})();
