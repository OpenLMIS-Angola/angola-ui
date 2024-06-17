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

    angular.module('admin-orderable-edit').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS', 'selectProductsModalStateProvider'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS, selectProductsModalStateProvider) {

        $stateProvider
            .state('openlmis.administration.orderables.edit', {
                abstract: true,
                label: 'adminOrderableEdit.editProduct',
                url: '/:id',
                accessRights: [
                    ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE,
                    ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE
                ],
                areAllRightsRequired: false,
                views: {
                    '@openlmis': {
                        controller: 'OrderableEditController',
                        templateUrl: 'admin-orderable-edit/orderable-edit.html',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    originalOrderable: function(orderables, $stateParams, OrderableResource) {
                        var orderable = _.findWhere(orderables, {
                            id: $stateParams.id
                        });
                        return orderable ? orderable : new OrderableResource().get($stateParams.id);
                    },
                    orderable: resolveOrderable
                }
            });

        $stateProvider
            .state('openlmis.administration.orderables.edit.general', {
                url: '/general',
                controller: 'OrderableAddEditGeneralController',
                templateUrl: 'admin-orderable-edit/orderable-edit-general.html',
                controllerAs: 'vm',
                nonTrackable: true,
                resolve: {
                    successNotificationKey: function() {
                        return 'adminOrderableEdit.productHasBeenUpdatedSuccessfully';
                    },
                    errorNotificationKey: function() {
                        return 'adminOrderableEdit.failedToUpdateProduct';
                    },
                    orderableListRelativePath: function() {
                        return '^.^';
                    },
                    orderable: resolveOrderable
                }
            });

        $stateProvider
            .state('openlmis.administration.orderables.edit.programs', {
                url: '/programs',
                controller: 'OrderableEditProgramsController',
                templateUrl: 'admin-orderable-edit/orderable-edit-programs.html',
                controllerAs: 'vm',
                accessRights: [
                    ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE,
                    ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
                ],
                areAllRightsRequired: false,
                nonTrackable: true,
                resolve: {
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

        $stateProvider
            .state('openlmis.administration.orderables.edit.ftaps', {
                label: 'adminOrderableEdit.ftaps',
                url: '/facilityTypeApprovedProducts',
                controller: 'OrderableEditFtapsListController',
                templateUrl: 'admin-orderable-edit/orderable-edit-ftaps-list.html',
                controllerAs: 'vm',
                nonTrackable: true,
                resolve: {
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

        $stateProvider
            .state('openlmis.administration.orderables.edit.unitAssignment', {
                label: 'adminOrderableEdit.unitAssignment',
                url: '/unitAssignment',
                controller: 'OrderableEditUnitAssignmentController',
                templateUrl: 'admin-orderable-edit/orderable-edit-unit-assignment.html',
                controllerAs: 'vm',
                nonTrackable: true,
                resolve: {
                    orderable: resolveOrderable
                }
            });

        // This abstract states stores the list of children (also newly added) between the .edit state refreshes.
        $stateProvider
            .state('openlmis.administration.orderables.edit.kitUnpackList', {
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    cachedChildren: function(orderable) {
                        return orderable.children;
                    }
                }
            });

        selectProductsModalStateProvider
            .stateWithAddOrderablesChildState('openlmis.administration.orderables.edit.kitUnpackList.edit', {
                label: 'adminOrderableEdit.kitUnpackList',
                url: '/kitUnpackList?kitUnpackListPage&kitUnpackListSize',
                controller: 'OrderableEditKitUnpackListController',
                templateUrl: 'admin-orderable-edit/orderable-edit-kit-unpack-list.html',
                controllerAs: 'vm',
                nonTrackable: true,
                parentResolves: ['cachedChildren'],
                resolve: {
                    children: function($stateParams, cachedChildren, paginationService) {
                        var stateParams = angular.copy($stateParams);
                        stateParams.productName = undefined;
                        stateParams.productCode = undefined;
                        stateParams.name = undefined;
                        stateParams.code = undefined;

                        return paginationService.registerList(null, stateParams, function() {
                            return cachedChildren;
                        }, {
                            paginationId: 'kitUnpackList'
                        });
                    },
                    orderables: function(OrderableResource, children) {
                        var orderables = _.pluck(children, 'orderable'),
                            childrenIds = _.pluck(orderables, 'id');

                        if (!childrenIds.length) {
                            return [];
                        }
                        return new OrderableResource()
                            .query({
                                id: childrenIds
                            })
                            .then(function(orderables) {
                                return orderables.content;
                            });
                    },
                    orderablesMap: function(orderables) {
                        return orderables.reduce(function(orderablesMap, orderable) {
                            orderablesMap[orderable.id] = orderable;
                            return orderablesMap;
                        }, {});
                    }
                }
            });

        function resolveOrderable(originalOrderable) {
            return angular.copy(originalOrderable);
        }
    }
})();
