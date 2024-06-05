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
        .module('report-embedded-edit')
        .config(routes);

    routes.$inject = ['$stateProvider', 'modalStateProvider'];

    function routes($stateProvider, modalStateProvider) {
        modalStateProvider.state('openlmis.administration.embeddedReportsList.edit', {
            url: '/edit/:id',
            label: 'adminReportEdit.title',
            controller: 'ReportEmbeddedEditController',
            controllerAs: 'vm',
            templateUrl: 'report-embedded-edit/report-embedded-edit.html',
            resolve: {
                embeddedReport: function($stateParams, reportEmbeddedService) {
                    return reportEmbeddedService.get($stateParams.id)
                        .then(function(response) {
                            return response;
                        })
                        .catch(function(error) {
                            throw new Error('Error while getting embedded report', error);
                        });
                },
                categories: function(reportEmbeddedService) {
                    return reportEmbeddedService.getReportCategories().then(function(categories) {
                        return categories;
                    });
                }
            }
        });
    }
})();