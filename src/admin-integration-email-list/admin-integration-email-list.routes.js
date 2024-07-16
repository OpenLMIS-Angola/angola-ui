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

    angular.module('admin-integration-email-list').config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('openlmis.administration.adminIntegrationEmailList', {
            showInNavigation: true,
            label: 'adminIntegrationEmailList.integrationEmails',
            url: '/integrationEmails?page&size',
            controller: 'AdminIntegrationEmailListController',
            templateUrl: 'admin-integration-email-list/admin-integration-email-list.html',
            controllerAs: 'vm',
            resolve: {
                emails: function($q, paginationService, integrationEmailService, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        var deferred = $q.defer();
                        integrationEmailService.getAll({
                            page: stateParams.page,
                            size: stateParams.size
                        }).then(function(response) {
                            deferred.resolve(response);
                        }, deferred.reject);
                        return deferred.promise;
                    });
                }
            }
        });
    }
})();
