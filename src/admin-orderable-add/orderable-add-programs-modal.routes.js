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

        modalStateProvider.state('openlmis.administration.orderables.programs', {
            label: 'orderableAddPrograms.addProgram',
            url: '/:id/addPrograms',
            templateUrl: 'admin-orderable-add/orderable-add-programs-list.html',
            controller: 'OrderableEditProgramsController',
            controllerAs: 'vm',
            resolve: {
                originalOrderable: function(orderables, $stateParams, OrderableResource) {
                    var orderable = _.findWhere(orderables, {
                        id: $stateParams.id
                    });
                    return orderable ? orderable : new OrderableResource().get($stateParams.id);
                },
                orderable: resolveOrderable,
                programsMap: function(programs) {
                    return programs.reduce(function(programsMap, program) {
                        programsMap[program.id] = program;
                        return programsMap;
                    }, {});
                },
                programOrderables: function(orderable) {
                    return orderable.programs;
                },
                canEdit: function(authorizationService, permissionService, ADMINISTRATION_RIGHTS) {
                    var user = authorizationService.getUser();
                    return permissionService
                        .hasPermissionWithAnyProgramAndAnyFacility(user.user_id, {
                            right: ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE
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

        modalStateProvider.state('openlmis.administration.orderables.programs.add', {
            controller: 'OrderableProgramEditController',
            templateUrl: 'admin-orderable-add/orderable-program-add.html',
            url: '/add',
            controllerAs: 'vm',
            accessRights: [
                ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE,
                ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
            ],
            areAllRightsRequired: false,
            nonTrackable: true,
            resolve: {
                orderableDisplayCategories: function(OrderableDisplayCategoryResource) {
                    return new OrderableDisplayCategoryResource().query();
                },
                programOrderable: function($stateParams, programOrderables) {
                    var program = _.findWhere(programOrderables, {
                        programId: $stateParams.id
                    });
                    return program;
                },
                successNotificationKey: function(programOrderable) {
                    if (programOrderable) {
                        return 'adminOrderableProgram.save.success';
                    }
                    return 'adminOrderableProgram.create.success';
                },
                errorNotificationKey: function(programOrderable) {
                    if (programOrderable) {
                        return 'adminOrderableProgram.save.failure';
                    }
                    return 'adminOrderableProgram.create.failure';
                },
                filteredPrograms: function(programs, programOrderables) {
                    var programIds = programOrderables.map(function(programOrderable) {
                        return programOrderable.programId;
                    });
                    return programs.filter(function(program) {
                        return programIds.indexOf(program.id) === -1;
                    });
                }
            },
            parentResolves: ['orderable', 'programOrderables', 'canEdit', 'programs', 'programsMap']
        });

        function resolveOrderable(originalOrderable) {
            return angular.copy(originalOrderable);
        }
    }
})();