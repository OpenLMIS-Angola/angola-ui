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

    angular.module('report-embedded-list').config(routes);

    routes.$inject = ['$stateProvider', 'REPORT_RIGHTS'];

    function routes($stateProvider, REPORT_RIGHTS) {

        $stateProvider.state('openlmis.administration.embeddedReportsList', {
            showInNavigation: true,
            label: 'reportEmbeddedList.navRoute',
            url: '/reports?page&size&sort=name,asc',
            controller: 'reportEmbeddedListController',
            templateUrl: 'report-embedded-list/report-embedded-list.html',
            controllerAs: 'vm',
            accessRights: [REPORT_RIGHTS.EMBEDDED_REPORTS_VIEW],
            resolve: {
                EmbeddedReportsList: function(reportEmbeddedService, $stateParams) {
                    return reportEmbeddedService.getAll($stateParams)
                        .then(function(response) {
                            return response.content;
                        })
                        .catch(function(error) {
                            throw new Error('Error while fetching embedded reports: ' + error);
                        });
                }
            }
        });
    }

})();
