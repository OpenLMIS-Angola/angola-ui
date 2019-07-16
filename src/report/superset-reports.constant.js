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
    * @name report.SUPERSET_REPORTS
    *
    * @description
    * This is constant defining available superset reports.
   */
    angular
        .module('report')
        .constant('SUPERSET_REPORTS', getReports())
        .constant('MODEL_CANCELLED', 'MODEL_CANCELLED');

    function getReports() {
        var supersetUrl = '${SUPERSET_URL}';
        if (supersetUrl.substr(0, 2) === '${') {
            supersetUrl = '';
        }

        return supersetUrl ? {
            REPORTING_RATE_AND_TIMELINESS: createReport('reportingRateAndTimeliness',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/taxa-de-submissao-de-relatorios/',
                'REPORTING_RATE_AND_TIMELINESS_REPORT_VIEW'),
            STOCK_STATUS: createReport('stockStatus',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/estado-de-stocks/',
                'STOCK_STATUS_REPORT_VIEW'),
            STOCKOUTS: createReport('stockouts',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/saídas-de-estoque/',
                'STOCKOUTS_REPORT_VIEW'),
            CONSUMPTION: createReport('consumption',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/consumo/',
                'CONSUMPTION_REPORT_VIEW'),
            ORDERS: createReport('orders',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/encomendas/',
                'ORDERS_REPORT_VIEW'),
            ADJUSTMENTS: createReport('adjustments',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/ajustes/',
                'ADJUSTMENTS_REPORT_VIEW'),
            ADMINISTRATIVE: createReport('administrative',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/administrativo/',
                'ADMINISTRATIVE_REPORT_VIEW'),
            AGGREGATE_CONSUMPTION: createReport('aggregateConsumption',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/consumo-agregado/',
                'AGGREGATE_CONSUMPTION_REPORT_VIEW'),
            REPORTED_AND_ORDERED_PRODUCTS: createReport('reportedAndOrderedProducts',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/produtos-reportados-e-requisitados/',
                'REPORTED_AND_ORDERED_PRODUCTS_REPORT_VIEW'),
            OCCURRENCE_OF_ADJUSTMENTS: createReport('occurrenceOfAdjustments',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/ocorrencia-de-ajustes/',
                'OCCURRENCE_OF_ADJUSTMENTS_REPORT_VIEW'),
            SUBMISSION_OF_MONTHLY_REPORTS: createReport('submissionOfMonthlyReports',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/submissao-de-relatorios-mensais/',
                'SUBMISSION_OF_MONTHLY_REPORTS_REPORT_VIEW'),
            STOCKS_SUMMARY: createReport('stocksSummary',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/resumo-de-stocks/',
                'STOCK_SUMMARY_REPORT_VIEW'),
            STOCK_ON_HAND_PER_INSTITUTION: createReport('stockOnHandPerInstitution',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/stock-disponível-por-instituicao/',
                'STOCK_ON_HAND_PER_INSTITUTION_REPORT_VIEW'),
            COMPARISON_OF_CONSUMPTION_BY_REGION: createReport('comparisonOfConsumptionByRegion',
                supersetUrl + '/login/openlmis?redirect_url=/superset/dashboard/comparacao-de-consumos-por-regiao/',
                'COMPARISON_OF_CONSUMPTION_BY_REGION')
        } : {};
    }

    function createReport(code, url, right) {
        return {
            code: code,
            url: url,
            right: right
        };
    }

})();
