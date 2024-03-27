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
     * @name report.controller:ReportGenerateController
     *
     * @description
     * Controller for report options page.
     */
    angular
        .module('report')
        .controller('ReportGenerateController', controller);

    controller.$inject = [
        '$state', '$scope', '$window', 'report', 'reportFactory',
        'reportParamsOptions', 'reportUrlFactory', 'accessTokenFactory'
    ];

    function controller($state, $scope, $window, report, reportFactory,
                        reportParamsOptions, reportUrlFactory, accessTokenFactory) {
        var vm = this;

        vm.$onInit = onInit;

        vm.downloadReport = downloadReport;

        // ANGOLASUP-442: Added the ability to select multiple options in the filter using checkboxes
        vm.toggleSelection = toggleSelection;
        // ANGOLASUP-442: ends here

        vm.paramsInfo = {
            GeographicZone: 'report.geographicZoneInfo',
            DueDays: 'report.dueDaysInfo'
        };

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name report
         * @type {Object}
         *
         * @description
         * The object representing the selected report.
         */
        vm.report = report;

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name paramsOptions
         * @type {Array}
         *
         * @description
         * The param options for this report, by param. A param can have multiple options, for
         * example a period param, will have all available periods as options. Objects containing
         * 'value' and 'displayName' properties.
         */
        vm.paramsOptions = reportParamsOptions;

        // AO-685: Implement stock movement type picker
        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name stockMovementTypes
         * @type {Array}
         *
         * @description
         * The param options for parameters with 'movementtype' description
         */
        vm.stockMovementTypes = [
            {
                name: 'Saída',
                value: 'Issue'
            },
            {
                name: 'Entrada',
                value: 'Receive'
            }
        ];
        // AO-685: ends here

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name selectedParamsOptions
         * @type {Object}
         *
         * @description
         * The collection of selected options by param name.
         */
        vm.selectedParamsOptions = {};

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name selectedParamsDependencies
         * @type {Object}
         *
         * @description
         * The collection of parameter dependencies and their selected values.
         */
        vm.selectedParamsDependencies = {};

        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name format
         * @type {String}
         *
         * @description
         * The format selected for the report. Either 'pdf' (default), 'csv', 'xls' or 'html'.
         */
        vm.format = 'pdf';

        // ANGOLASUP-442: Added the ability to select multiple options in the filter using checkboxes
        /**
         * @ngdoc property
         * @propertyOf report.controller:ReportGenerateController
         * @name selectedCheckboxes
         * @type {Object}
         *
         * @description
         * The collection of checkboxes parameters dependencies and their selected values.
         */
        vm.selectedCheckboxes = {};
        // ANGOLASUP-442: ends here

        /**
         * @ngdoc method
         * @methodOf report.controller:ReportGenerateController
         * @name downloadReport
         *
         * @description
         * Downloads the report. Opens a new tab that redirects to the actual download report
         * url, passing selected param options as well as the selected format.
         */
        function downloadReport() {
            $window.open(
                accessTokenFactory.addAccessToken(
                    reportUrlFactory.buildUrl(
                        vm.report.$module,
                        vm.report,
                        vm.selectedParamsOptions,
                        vm.format
                    )
                ),
                '_blank'
            );
        }

        /**
         * @ngdoc method
         * @methodOf report.controller:ReportGenerateController
         * @name watchDependency
         *
         * @description
         * Sets up a watch on report parameter selection,
         * to update dependent parameters options based on it's value.
         *
         * @param   {Object}    param             the report parameter that needs to watch for
         *                                        dependency.
         * @param   {Object}    dep               the dependency object to set up watch for.
         */
        function watchDependency(param, dep) {
            var watchProperty = 'vm.selectedParamsOptions.' + dep.dependency;
            $scope.$watch(watchProperty, function(newVal) {
                vm.selectedParamsDependencies[dep.dependency] = newVal;
                if (newVal) {
                    reportFactory.getReportParamOptions(param, vm.selectedParamsDependencies)
                        .then(function(items) {
                            vm.paramsOptions[param.name] = items;
                        });
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf report.controller:ReportGenerateController
         * @name $onInit
         *
         * @description
         * Initialization method of the ReportGenerateController.
         */
        function onInit() {
            angular.forEach(report.templateParameters, function(param) {
                angular.forEach(param.dependencies, function(dependency) {
                    watchDependency(param, dependency);
                });
                // ANGOLASUP-442: Added the ability to select multiple options in the filter using checkboxes
                if (param.description === 'checkboxes') {
                    vm.selectedCheckboxes[param.name] = [];
                }
                // ANGOLASUP-442: ends here
            });
        }

        // ANGOLASUP-442: Added the ability to select multiple options in the filter using checkboxes
        /**
         * @ngdoc method
         * @methodOf report.controller:ReportGenerateController
         * @name toggleSelection
         *
         * @description
         * Adds selected checkboxes values ​​to dynamically created arrays 
         * and to the collection of selected options - selectedParamsOptions
         */
        function toggleSelection(selectedParamName, parameterName) {
            var idx = vm.selectedCheckboxes[parameterName].indexOf(selectedParamName.name);

            if (idx > -1) {
                vm.selectedCheckboxes[parameterName].splice(idx, 1);
            } else {
                vm.selectedCheckboxes[parameterName].push(selectedParamName.value);
            }
            vm.selectedParamsOptions[parameterName] = changeCommasToSemicolons(vm.selectedCheckboxes[parameterName]);
        }

        function changeCommasToSemicolons(text) {
            return text.toString().split(',')
                .join(';');
        }
        // ANGOLASUP-442: ends here
    }
})();