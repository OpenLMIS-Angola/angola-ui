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
        .module('admin-facility-type-list')
        .config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.facilityTypes', {
            showInNavigation: true,
            label: 'adminFacilityTypeList.facilityTypes',
            url: '/facilityTypes?page&size&sort',
            controller: 'FacilityTypeListController',
            templateUrl: 'admin-facility-type-list/facility-type-list.html',
            controllerAs: 'vm',
            accessRights: [ADMINISTRATION_RIGHTS.FACILITIES_MANAGE],
            resolve: {
                facilityTypes: function(paginationService, facilityTypeService, $stateParams) {
                    return paginationService.registerUrl($stateParams, function() {
                        if ($stateParams.sort === undefined) {
                            $stateParams.sort = 'displayOrder,asc';
                        }

                        return facilityTypeService.query($stateParams);
                    });
                }
            }
        });
    }
})();
