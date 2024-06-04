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
     * @name report-embedded-list.controller:ReportEmbeddedListController
     *
     * @description
     * Controller for managing embedded reports list view.
     */

    angular
        .module('report-embedded-list')
        .controller('reportEmbeddedListController', controller);

    controller.$inject = ['$state', 'EmbeddedReportsList', 'TABLE_CONSTANTS', 'confirmService',
        'reportEmbeddedService', 'messageService', 'loadingModalService', 'notificationService'];

    function controller($state, EmbeddedReportsList, TABLE_CONSTANTS, confirmService,
                        reportEmbeddedService, messageService, loadingModalService, notificationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.redirectToAddReport = redirectToAddReport;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-list.controller:ReportEmbeddedListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for organization list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-list.controller:ReportEmbeddedListController
         * @name reportName
         * @type {String}
         *
         * @description
         * Contains name param for searching report.
         */
        vm.reportName = undefined;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-list.controller:ReportEmbeddedListController
         * @name reportsList
         * @type {Array}
         *
         * @description
         * Contains list of embedded reports.
         */
        vm.reportsList = undefined;

        /**
         * @ngdoc method
         * @methodOf report-embedded-list.controller:ReportEmbeddedListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating reportEmbeddedListController.
         */
        function onInit() {
            vm.reportsList = EmbeddedReportsList;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-list.controller:ReportEmbeddedListController
         * @name redirectToAddReport
         *
         * @description
         * Redirects the user to the add embedded report page.
         */
        function redirectToAddReport() {
            $state.go('openlmis.administration.embeddedReportsList.add');
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-list.controller:ReportEmbeddedListController
         * @name deleteEmbeddedReport
         *
         * @description
         * Delete embedded report.
         */
        function deleteEmbeddedReport(report) {
            var confirmMessage = messageService.get('reportEmbeddedList.deleteReport.question', {
                reportName: report.name
            });

            confirmService.confirm(confirmMessage, 'reportEmbeddedList.delete').then(function() {
                var loadingPromise = loadingModalService.open();
                reportEmbeddedService.remove(report.id)
                    .then(function() {
                        loadingPromise.then(function() {
                            notificationService.success('reportEmbeddedList.deleteReport.success');
                        });
                        $state.reload('openlmis.administration.embeddedReportsList');
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('reportEmbeddedList.deleteReport.fail');
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-list.controller:ReportEmbeddedListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the reports list table.
         */
        function getTableConfig() {
            return {
                caption: 'reportEmbeddedList.noEmbeddedReport',
                displayCaption: !vm.reportsList || vm.reportsList.length === 0,
                isSelectable: false,
                columns: [
                    {
                        header: 'reportEmbeddedList.column.name',
                        propertyPath: 'name',
                        sortable: true,
                        template: function(item) {
                            return item.name;
                        }
                    },
                    {
                        header: 'reportEmbeddedList.column.category',
                        propertyPath: 'category',
                        sortable: true,
                        template: function(item) {
                            return item.category.name;
                        }
                    },
                    {
                        header: 'reportEmbeddedList.column.enabled',
                        propertyPath: 'enabled',
                        sortable: false,
                        template: '<i ng-class="{\'icon-ok\': item.enabled}"></i>'
                    }
                ],
                actions: {
                    header: 'reportEmbeddedList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.embeddedReportsList.edit({id:\'' + item.id + '\'})';
                            },
                            text: 'reportEmbeddedList.action.edit'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                deleteEmbeddedReport(item);
                            },
                            classes: 'danger',
                            text: 'reportEmbeddedList.action.delete'
                        }
                    ]
                },
                data: vm.reportsList
            };
        }
    }
})();
