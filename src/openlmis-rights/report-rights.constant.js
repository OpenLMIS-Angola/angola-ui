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
     * @name openlmis-rights.REPORT_RIGHTS
     *
     * @description
     * This is constant for report rights.
     */
    angular
        .module('openlmis-rights')
        .constant('REPORT_RIGHTS', rights());

    function rights() {
        return {
            REPORTS_VIEW: 'REPORTS_VIEW',
            REPORT_TEMPLATES_EDIT: 'REPORT_TEMPLATES_EDIT',
            REPORTING_RATE_AND_TIMELINESS_REPORT_VIEW: 'REPORTING_RATE_AND_TIMELINESS_REPORT_VIEW',
            STOCK_STATUS_REPORT_VIEW: 'STOCK_STATUS_REPORT_VIEW',
            STOCKOUTS_REPORT_VIEW: 'STOCKOUTS_REPORT_VIEW',
            CONSUMPTION_REPORT_VIEW: 'CONSUMPTION_REPORT_VIEW',
            ORDERS_REPORT_VIEW: 'ORDERS_REPORT_VIEW',
            ADJUSTMENTS_REPORT_VIEW: 'ADJUSTMENTS_REPORT_VIEW',
            ADMINISTRATIVE_REPORT_VIEW: 'ADMINISTRATIVE_REPORT_VIEW',
            EMBEDDED_REPORTS_VIEW: 'EMBEDDED_REPORTS_VIEW'
        };
    }

})();