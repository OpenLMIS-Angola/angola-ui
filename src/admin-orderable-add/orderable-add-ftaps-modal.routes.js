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

    angular.module('admin-orderable-add').config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.orderables.ftap', {
            label: 'orderableAddFtaps.AddFtaps',
            url: '/:id/addFacilityTypeApprovedProducts',
            controller: 'OrderableEditFtapsListController',
            templateUrl: 'admin-orderable-add/orderable-add-ftaps-list.html',
            controllerAs: 'vm',
            nonTrackable: true,
            resolve: {
                originalOrderable: function(orderables, $stateParams, OrderableResource) {
                    var orderable = _.findWhere(orderables, {
                        id: $stateParams.id
                    });
                    return orderable ? orderable : new OrderableResource().get($stateParams.id);
                },
                orderable: resolveOrderable,
                ftaps: function(FacilityTypeApprovedProductRepository, orderable) {
                    return new FacilityTypeApprovedProductRepository().query({
                        orderableId: orderable.id
                    })
                        .then(function(ftaps) {
                            return ftaps.content;
                        });
                },
                facilityTypesMap: function(ftaps) {
                    return ftaps.reduce(function(facilityTypesMap, ftap) {
                        facilityTypesMap[ftap.facilityType.id] = ftap.facilityType.name;
                        return facilityTypesMap;
                    }, {});
                },
                ftapsMap: function(ftaps) {
                    return ftaps.reduce(function(ftapsMap, ftap) {
                        if (!ftapsMap[ftap.facilityType.id]) {
                            ftapsMap[ftap.facilityType.id] = [];
                        }
                        ftapsMap[ftap.facilityType.id].push(ftap);
                        return ftapsMap;
                    }, {});
                },
                canEdit: function(authorizationService, permissionService, ADMINISTRATION_RIGHTS) {
                    var user = authorizationService.getUser();
                    return permissionService
                        .hasPermissionWithAnyProgramAndAnyFacility(user.user_id, {
                            right: ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
                        })
                        .then(function() {
                            return true;
                        })
                        .catch(function() {
                            return false;
                        });
                }
            }
        });

        modalStateProvider.state('openlmis.administration.orderables.ftap.add', {
            controller: 'OrderableAddEditFtapsController',
            controllerAs: 'vm',
            templateUrl: 'admin-orderable-add/orderable-ftap-add.html',
            url: '/add',
            accessRights: [
                ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
            ],
            parentResolves: ['programs', 'canEdit'],
            nonTrackable: true,
            resolve: {
                successNotificationKey: function() {
                    return 'adminOrderableFtapAdd.ftapHasBeenCreatedSuccessfully';
                },
                errorNotificationKey: function() {
                    return 'adminOrderableFtapAdd.failedToCreateFtap';
                },
                facilityTypeApprovedProduct: function(orderable) {
                    return {
                        orderable: orderable,
                        active: true
                    };
                },
                facilityTypes: function(FacilityTypeResource) {
                    return new FacilityTypeResource().query()
                        .then(function(facilityTypes) {
                            return facilityTypes.content;
                        });
                },
                programOrderables: function(programs, orderable) {
                    return programs.reduce(function(programOrderables, program) {
                        orderable.programs.forEach(function(programOrderable) {
                            if (programOrderable.programId === program.id) {
                                programOrderables.push(program);
                            }
                        });
                        return programOrderables;
                    }, []);
                }
            }
        });

        function resolveOrderable(originalOrderable) {
            return angular.copy(originalOrderable);
        }
    }
})();