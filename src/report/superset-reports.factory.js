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

    /**
     * @ngdoc object
     * @name report.supersetReports
     *
     * @description
     * This is constant defining available superset reports.
     */
    angular
        .module('report')
        .factory('supersetReports', supersetReports);

    supersetReports.$inject = ['SUPERSET_URL'];

    // ANGOLASUP-797: Catalogue and organize reports
    function supersetReports(SUPERSET_URL) {
        var reports = {};

        if (SUPERSET_URL.substr(0, 2) !== '${') {
            reports = {
                REPORTING_RATE_AND_TIMELINESS: createReport('reportingRateAndTimeliness',
                    SUPERSET_URL + '/superset/dashboard/taxa-de-submissao-de-relatorios/',
                    'REPORTING_RATE_AND_TIMELINESS_REPORT_VIEW', 'REQUISITION'),
                STOCK_STATUS: createReport('stockStatus',
                    SUPERSET_URL + '/superset/dashboard/estado-de-stocks/',
                    'STOCK_STATUS_REPORT_VIEW', 'STOCK'),
                STOCKOUTS: createReport('stockouts',
                    SUPERSET_URL + '/superset/dashboard/22/',
                    'STOCKOUTS_REPORT_VIEW', 'STOCK'),
                CONSUMPTION: createReport('consumption',
                    SUPERSET_URL + '/superset/dashboard/consumo/',
                    'CONSUMPTION_REPORT_VIEW', 'STOCK'),
                ORDERS: createReport('orders',
                    SUPERSET_URL + '/superset/dashboard/encomendas/',
                    'ORDERS_REPORT_VIEW', 'ORDER'),
                ADJUSTMENTS: createReport('adjustments',
                    SUPERSET_URL + '/superset/dashboard/ajustes/',
                    'ADJUSTMENTS_REPORT_VIEW', 'STOCK'),
                ADMINISTRATIVE: createReport('administrative',
                    SUPERSET_URL + '/superset/dashboard/administrativo/',
                    'ADMINISTRATIVE_REPORT_VIEW', 'ADMINISTRATION'),
                AGGREGATE_CONSUMPTION: createReport('aggregateConsumption',
                    SUPERSET_URL + '/superset/dashboard/consumo-agregado/',
                    'AGGREGATE_CONSUMPTION_REPORT_VIEW', 'STOCK'),
                REPORTED_AND_ORDERED_PRODUCTS: createReport('reportedAndOrderedProducts',
                    SUPERSET_URL + '/superset/dashboard/produtos-reportados-e-requisitados/',
                    'REPORTED_AND_ORDERED_PRODUCTS_REPORT_VIEW', 'ORDER'),
                OCCURRENCE_OF_ADJUSTMENTS: createReport('occurrenceOfAdjustments',
                    SUPERSET_URL + '/superset/dashboard/ocorrencia-de-ajustes/',
                    'OCCURRENCE_OF_ADJUSTMENTS_REPORT_VIEW', 'STOCK'),
                SUBMISSION_OF_MONTHLY_REPORTS: createReport('submissionOfMonthlyReports',
                    SUPERSET_URL + '/superset/dashboard/submissao-de-relatorios-mensais/',
                    'SUBMISSION_OF_MONTHLY_REPORTS_REPORT_VIEW', 'REQUISITION'),
                STOCKS_SUMMARY: createReport('stocksSummary',
                    SUPERSET_URL + '/superset/dashboard/resumo-de-stocks/',
                    'STOCK_SUMMARY_REPORT_VIEW', 'STOCK'),
                STOCK_ON_HAND_PER_INSTITUTION: createReport('stockOnHandPerInstitution',
                    SUPERSET_URL + '/superset/dashboard/21/',
                    'STOCK_ON_HAND_PER_INSTITUTION_REPORT_VIEW', 'STOCK'),
                COMPARISON_OF_CONSUMPTION_BY_REGION: createReport('comparisonOfConsumptionByRegion',
                    SUPERSET_URL + '/superset/dashboard/comparacao-de-consumos-por-regiao/',
                    'COMPARISON_OF_CONSUMPTION_BY_REGION', 'STOCK'),
                EXPIRY_DATES: createReport('expiryDates',
                    SUPERSET_URL + '/superset/dashboard/datas-de-expiracao/',
                    'EXPIRY_DATES_REPORT_VIEW', 'STOCK'),
                STOCKOUTS_IN_US: createReport('rupturasDeStockNasUS',
                    SUPERSET_URL + '/superset/dashboard/rupturas-de-stock-nas-us/',
                    'STOCKOUTS_IN_US_REPORT_VIEW', 'STOCK'),
                RAPTURAS_DE_STOCK_POR_PRODUTO_REPORT_VIEW: createReport('rupturasDeStockPorProduto',
                    SUPERSET_URL + '/superset/dashboard/rupturas-de-stock-por-produto/',
                    'RAPTURAS_DE_STOCK_POR_PRODUTO_REPORT_VIEW', 'STOCK')
            };
        }
        // ANGOLASUP-797: Ends here

        return {
            getReports: getReports,
            addReporingPages: addReporingPages
        };

        function addReporingPages($stateProvider) {
            if (angular.equals(reports, {})) {
                // nothing to do here
                return;
            }

            $stateProvider.state('openlmis.reports.list.superset', {
                abstract: true,
                url: '/superset',
                views: {
                    // we need the main page to flex to the window size
                    '@': {
                        templateUrl: 'openlmis-main-state/flex-page.html'
                    }
                }
            });

            Object.values(reports).forEach(function(report) {
                addReporingPage($stateProvider, report);
            });
        }

        function addReporingPage($stateProvider, report) {
            $stateProvider.state('openlmis.reports.list.superset.' + report.code, {
                url: '/' + report.code,
                label: 'report.superset.' + report.code,
                controller: 'SupersetReportController',
                templateUrl: 'report/superset-report.html',
                controllerAs: 'vm',
                resolve: {
                    reportUrl: function($sce) {
                        return $sce.trustAsResourceUrl(report.url);
                    },
                    reportCode: function() {
                        return report.code;
                    },
                    authorizationInSuperset: authorizeInSuperset
                }
            });
        }

        function getReports() {
            return reports;
        }

        // ANGOLASUP-797: Catalogue and organize reports
        function createReport(code, url, right, category) {
            return {
                code: code,
                url: url + '?standalone=true',
                right: right,
                category: category
            };
        }
        // ANGOLASUP-797: Ends here

        function authorizeInSuperset(loadingModalService, openlmisModalService, $q, $state, MODAL_CANCELLED) {
            loadingModalService.close();
            var dialog = openlmisModalService.createDialog({
                backdrop: 'static',
                keyboard: false,
                controller: 'SupersetOAuthLoginController',
                controllerAs: 'vm',
                templateUrl: 'report/superset-oauth-login.html',
                show: true
            });
            return dialog.promise
                .catch(function(reason) {
                    if (reason === MODAL_CANCELLED) {
                        $state.go('openlmis.reports.list');
                        return $q.resolve();
                    }
                    return $q.reject();
                });
        }
    }

})();