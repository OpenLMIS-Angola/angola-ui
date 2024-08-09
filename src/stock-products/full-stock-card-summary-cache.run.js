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
        .module('stock-products')
        .run(routes);

    routes.$inject = ['loginService', 'StockCardSummaryResource', 'facilityFactory',
        'permissionService', 'STOCKMANAGEMENT_RIGHTS', '$q', 'WARDS_CONSTANTS', 'wardService'];

    function routes(loginService, StockCardSummaryResource, facilityFactory, permissionService,
                    STOCKMANAGEMENT_RIGHTS, $q, WARDS_CONSTANTS, wardService) {

        loginService.registerPostLoginAction(function(user) {
            var homeFacility;

            return facilityFactory.getUserHomeFacility()
                .then(function(facility) {
                    homeFacility = facility;
                    var searchParams = {
                        zoneId: homeFacility.geographicZone.id,
                        sort: 'code,asc',
                        type: WARDS_CONSTANTS.WARD_TYPE_CODE
                    };

                    return wardService.getWardsByFacility(searchParams).then(function(response) {
                        var wards = response.content ? response.content : response;
                        var programs = homeFacility.supportedPrograms;
                        programs.forEach(function(program) {
                            return permissionService.hasPermission(user.userId, {
                                right: STOCKMANAGEMENT_RIGHTS.STOCK_CARDS_VIEW,
                                programId: program.id,
                                facilityId: homeFacility.id
                            })
                                .then(function() {
                                    var facilityWithWards = wards.concat([homeFacility]);
                                    var cachePromisses = facilityWithWards.map(function(facility) {
                                        return getSummaryCachePromise(facility.id, program.id, user.userId);
                                    });
                                    return $q.all(cachePromisses).then(function(responses) {
                                        return responses;
                                    });
                                });
                        });
                    });

                })
                .catch(function() {
                    return $q.resolve();
                });
        });

        function getSummaryCachePromise(facilityId, programId, userId) {
            var resource = new StockCardSummaryResource();
            var docId = programId + '/' + facilityId + '/' + userId;
            var params = {
                programId: programId,
                facilityId: facilityId
            };

            return resource.query(params, docId);
        }
    }

})();