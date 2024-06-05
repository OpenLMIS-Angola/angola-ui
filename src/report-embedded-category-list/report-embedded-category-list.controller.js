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
     * @name report-embedded-category-list.controller:reportEmbeddedCategoriesListController
     *
     * @description
     * Controller for managing embedded reports list view.
     */

    angular
        .module('report-embedded-category-list')
        .controller('reportEmbeddedCategoriesListController', controller);

    controller.$inject = ['$state', 'EmbeddedReportCategoriesList', 'TABLE_CONSTANTS', 'confirmService',
        'reportEmbeddedService', 'messageService', 'loadingModalService', 'notificationService'];

    function controller($state, EmbeddedReportCategoriesList, TABLE_CONSTANTS, confirmService,
                        reportEmbeddedService, messageService, loadingModalService, notificationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.redirectToAddReportCategory = redirectToAddReportCategory;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for embedded report categories list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name categoryName
         * @type {String}
         *
         * @description
         * Contains name param for searching report.
         */
        vm.categoryName = undefined;

        /**
         * @ngdoc property
         * @propertyOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name reportCategoriesList
         * @type {Array}
         *
         * @description
         * Contains list of embedded report categories.
         */
        vm.reportCategoriesList = undefined;

        /**
         * @ngdoc method
         * @methodOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating reportEmbeddedCategoriesListController.
         */
        function onInit() {
            vm.reportCategoriesList = EmbeddedReportCategoriesList;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name redirectToAddReportCategory
         *
         * @description
         * Redirects the user to the add embedded report category page/modal.
         */
        function redirectToAddReportCategory() {
            $state.go('openlmis.administration.embeddedReportsCategoriesList.add');
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name deleteEmbeddedReportCategory
         *
         * @description
         * Delete embedded report category.
         */
        function deleteEmbeddedReportCategory(category) {
            var confirmMessage = messageService.get('reportEmbeddedCategoriesList.deleteReport.question', {
                categoryName: category.name
            });

            confirmService.confirm(confirmMessage, 'reportEmbeddedCategoriesList.delete').then(function() {
                var loadingPromise = loadingModalService.open();
                reportEmbeddedService.deleteReportCategory(category.id)
                    .then(function() {
                        loadingPromise.then(function() {
                            notificationService.success('reportEmbeddedCategoriesList.deleteReport.success');
                        });
                        $state.reload('openlmis.administration.embeddedReportsCategoriesList');
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('reportEmbeddedCategoriesList.deleteReport.fail');
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf report-embedded-category-list.controller:reportEmbeddedCategoriesListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the reports list table.
         */
        function getTableConfig() {
            return {
                caption: 'reportEmbeddedCategoriesList.noEmbeddedReportCategory',
                displayCaption: !vm.reportCategoriesList || vm.reportCategoriesList.length === 0,
                isSelectable: false,
                columns: [
                    {
                        header: 'reportEmbeddedCategoriesList.column.name',
                        propertyPath: 'name',
                        sortable: false,
                        template: function(item) {
                            return item.name;
                        }
                    }
                ],
                actions: {
                    header: 'reportEmbeddedCategoriesList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                deleteEmbeddedReportCategory(item);
                            },
                            classes: 'danger',
                            text: 'reportEmbeddedCategoriesList.action.delete'
                        }
                    ]
                },
                data: vm.reportCategoriesList
            };
        }
    }
})();
