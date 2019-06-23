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
        .module('angola-service-desk')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('openlmis.serviceDesk', {
            label: 'serviceDesk.contactSupport',
            showInNavigation: true,
            priority: -1000,
            controller: 'ServiceDeskController',
            controllerAs: 'vm',
            templateUrl: 'angola-service-desk/service-desk.html',
            url: '/service-desk',
            resolve: {
                issueTypes: function(ISSUE_TYPE) {
                    return new ISSUE_TYPE.toList();
                },
                priorities: function(PRIORITY_TYPE) {
                    return new PRIORITY_TYPE.toList();
                },
                impactTypes: function(IMPACT_TYPE) {
                    return new IMPACT_TYPE.toList();
                },
                user: function(currentUserService, UserRepository) {
                    return currentUserService.getUserInfo()
                        .then(function(user) {
                            return new UserRepository().get(user.id);
                        });
                }
            }
        });

    }

})();
