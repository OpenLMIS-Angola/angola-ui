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
        .module('stock-adjustment-creation')
        .run(routes);

    routes.$inject = ['loginService', 'sourceDestinationService', 'facilityFactory', '$q', 'programService',
        'authorizationService'];

    function routes(loginService, sourceDestinationService, facilityFactory, $q, programService,
                    authorizationService) {

        loginService.registerPostLoginAction(function() {
            var userId = authorizationService.getUser().user_id;
            var userProgramsPromise = programService.getUserPrograms(userId);
            var homeFacilityPromise = facilityFactory.getUserHomeFacility();

            $q.all([userProgramsPromise, homeFacilityPromise]).then(function(responses) {
                var userProgramsIds = responses[0].map(function(program) {
                    return program.id;
                });
                var homeFacility = responses[1];
                sourceDestinationService.cacheDestinationsAndSources(userProgramsIds, homeFacility.id);
            });
        });

        // loginService.registerPostLogoutAction(function() {
        //     return wardService.clearWardsByFacilityOffline();
        // });
    }

})();
