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
        .module('stock-receive-creation')
        .config(routes);

    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS', 'SEARCH_OPTIONS', 'ADJUSTMENT_TYPE',
        'WARDS_CONSTANTS'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS, SEARCH_OPTIONS, ADJUSTMENT_TYPE,
                    WARDS_CONSTANTS) {
        $stateProvider.state('openlmis.stockmanagement.receive.creation', {
            isOffline: true,
            url: '/:programId/create?page&size&keyword',
            views: {
                '@openlmis': {
                    controller: 'StockAdjustmentCreationController',
                    templateUrl: 'stock-adjustment-creation/adjustment-creation.html',
                    controllerAs: 'vm'
                }
            },
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            params: {
                program: undefined,
                facility: undefined,
                stockCardSummaries: undefined,
                reasons: undefined,
                displayItems: undefined,
                addedLineItems: undefined,
                orderableGroups: undefined,
                srcDstAssignments: undefined
            },
            resolve: {
                program: function($stateParams, programService) {
                    if (!$stateParams.program) {
                        return programService.get($stateParams.programId);
                    }
                    return $stateParams.program;
                },
                facility: function($stateParams, facilityFactory) {
                    if (!$stateParams.facility) {
                        return facilityFactory.getUserHomeFacility();
                    }
                    return $stateParams.facility;
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                orderableGroups: function($stateParams, program, facility, orderableGroupService) {
                    if (!$stateParams.orderableGroups) {
                        $stateParams.orderableGroups = orderableGroupService
                            .findAvailableProductsAndCreateOrderableGroups(program.id, facility.id, true);
                    }
                    return $stateParams.orderableGroups;
                },
                orderableGroupsByWard: function(program, facility, orderableGroupService, $q, wardService) {
                    var searchParams = {
                        zoneId: facility.geographicZone.id,
                        sort: 'code,asc',
                        type: WARDS_CONSTANTS.WARD_TYPE_CODE

                    };

                    return wardService.getWardsByFacility(searchParams).then(function(response) {
                        var wards = response.content ? response.content : response;
                        var wardsOrderableGroupPromises = wards.map(function(ward) {
                            return orderableGroupService
                                .findAvailableProductsAndCreateOrderableGroups(program.id, ward.id, true);
                        });
                        return $q.all(wardsOrderableGroupPromises).then(function(responses) {
                            return responses.map(function(orderableGroups, i) {
                                return {
                                    wardId: wards[i].id,
                                    orderableGroups: orderableGroups
                                };
                            });
                        });
                    });
                },
                displayItems: function($stateParams, registerDisplayItemsService) {
                    return registerDisplayItemsService($stateParams);
                },
                reasons: function($stateParams, stockReasonsFactory, facility) {
                    if (_.isUndefined($stateParams.reasons)) {
                        return stockReasonsFactory.getReceiveReasons($stateParams.programId, facility.type.id);
                    }
                    return $stateParams.reasons;
                },
                adjustmentType: function() {
                    return ADJUSTMENT_TYPE.RECEIVE;
                },
                srcDstAssignments: function($stateParams, facility, sourceDestinationService) {
                    if (_.isUndefined($stateParams.srcDstAssignments)) {
                        $stateParams.srcDstAssignments = sourceDestinationService
                            .getSourceAssignments($stateParams.programId, facility.id);
                    }
                    return $stateParams.srcDstAssignments;
                },
                hasPermissionToAddNewLot: function(permissionService, ADMINISTRATION_RIGHTS, user) {
                    return permissionService.hasPermissionWithAnyProgramAndAnyFacility(user.user_id, {
                        right: ADMINISTRATION_RIGHTS.LOTS_MANAGE
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
    }
})();
