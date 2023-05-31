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
     * @ngdoc controller
     * @name report.controller:ReportListController
     *
     * @description
     * Controller for report list view page.
     */
    angular
        .module('report')
        .controller('ReportListController', controller);

    controller.$inject = ['$state', 'reports', 'supersetReports', 'permissions', 'REPORT_RIGHTS'];

    function controller($state, reports, supersetReports, permissions,
                        REPORT_RIGHTS) {
        var vm = this;

        vm.hasRight = hasRight;

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name reports
         * @type {Array}
         *
         * @description
         * The list of all available reports.
         */
        vm.reports = reports;

        // ANGOLASUP-797: Catalogue and organize reports
        var reportsIds = {
            jasper: {
                stock: [
                    '1e0221c4-58f4-40b6-9cde-4b3781cea6a1', '097e109a-96e2-40f5-908a-6e770bf660d5',
                    'c7fbd171-2750-4fa4-a419-d72c03304c55', '06f75273-1964-4c7a-b06b-51dea8eb1109',
                    '9ae61a33-ea92-4492-917b-034015a6f94b', '33f166c5-bd42-4b64-895e-eb84718a4ac1',
                    '6c42a83b-a803-412e-a3ad-0e2ab97f03fd', 'b7249c89-8ba0-431b-8b75-052f84a77225',
                    'a525bbec-240e-4782-9cb3-1694fb6c45ee', '5de8cfb1-2c15-43ae-b240-a251ca3830f2',
                    'a565bb23-1d39-4a9a-8717-a7ff46706243', '2df95711-e025-414a-ba57-364831723764',
                    '1f838522-5705-434b-85d0-0b494752cbff', '01abd9cd-6763-4ad0-9a16-442965b40566',
                    '0e6d3515-e88e-4f1a-8e71-5b4613974954'
                ],
                requisition: [
                    '3ae277e4-fe3e-42fa-ac97-d43868c2e9d8', 'e8c66178-81b6-4b43-b8b9-b3206285fdc2',
                    '93d09638-4dc7-4c94-a9f2-e80b5c62408e', '3fafb1cb-659b-4182-8c84-6df209a0f8d5',
                    '3ac08504-08e1-4b31-8929-f4bfb9112f69'
                ],
                orders: [
                    'cdf0cc6c-52e7-485e-a375-60fd4a9951af'
                ],
                administration: [
                    'e1a2f89c-fa5e-40a6-bd1a-b43fdd570eb1', '5308cb58-a5b7-4741-a3d3-13fb24871bac'
                ]
            },
            superSet: {
                stock: [
                    'Stock Status', 'Stockouts', 'Consumption', 'Adjustments', 'Aggregate Consumption',
                    'Occurence of Adjustments', 'Stocks Summary', 'Stock on Hand per Institution',
                    'Comparison of Consumption by Region', 'Rupturas de Stock nas US',
                    'Rupturas de Stock por Produto', 'Expiry Dates'
                ],
                requisition: [
                    'Reporting Rate and Timeliness', 'Submission of Monthly Reports'
                ],
                orders: [
                    'Orders', 'Reported and Ordered Products'
                ],
                administration: [
                    'Administrative'
                ]
            }
        };

        var stockReports = {
            jasper: getJasperReports('stock'),
            superSet: getSuperSetReports('stock')
        };
        var requisitionReports = {
            jasper: getJasperReports('requisition'),
            superSet: getSuperSetReports('requisition')
        };
        var orderReports = {
            jasper: getJasperReports('orders'),
            superSet: getSuperSetReports('orders')
        };
        var administrationReports = {
            jasper: getJasperReports('administration'),
            superSet: getSuperSetReports('administration')
        };

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name stockReports
         * @type {Array}
         *
         * @description
         * The list of all available Stock reports.
         */
        vm.stockReports = stockReports;

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name requisitionReports
         * @type {Array}
         *
         * @description
         * The list of all available Requisition reports.
         */
        vm.requisitionReports = requisitionReports;

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name orderReports
         * @type {Array}
         *
         * @description
         * The list of all available Order reports.
         */
        vm.orderReports = orderReports;

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name administrationReports
         * @type {Array}
         *
         * @description
         * The list of all available Administration reports.
         */
        vm.administrationReports = administrationReports;
        // ANGOLASUP-797: Ends here

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name supersetReports
         * @type {Object}
         *
         * @description
         * Contains information about available superset reports.
         */
        vm.supersetReports = supersetReports.getReports();

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportListController
         * @name permissions
         * @type {Object}
         *
         * @description
         * Contains information about user report rights.
         */
        vm.permissions = permissions;

        /**
         * @ngdoc method
         * @methodOf report.controller:ReportListController
         * @name hasRight
         *
         * @description
         * Returns true if user has right to manage the proper report.
         *
         * @param {String}   rightName  the right name
         * @return {Boolean}            true if the user has the right, otherwise false
         */
        function hasRight(rightName) {
            return vm.permissions[rightName] || vm.permissions[REPORT_RIGHTS.REPORTS_VIEW];
        }

        // ANGOLASUP-797: Catalogue and organize reports
        function getJasperReports(category) {
            return reports.filter(function(report) {
                return reportsIds.jasper[category].includes(report.id);
            });
        }

        function getSuperSetReports(category) {
            return reports.filter(function(report) {
                return reportsIds.superSet[category].includes(report.id);
            });
        }
        // ANGOLASUP-797: Ends here
    }
})();
