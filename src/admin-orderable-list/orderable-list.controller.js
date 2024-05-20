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
     * @name admin-orderable-list.controller:OrderableListController
     *
     * @description
     * Controller for managing orderables list screen.
     */
    angular
        .module('admin-orderable-list')
        .controller('OrderableListController', controller);

    controller.$inject = ['$state', '$stateParams', 'orderables', 'programs', 'canAdd', 'TABLE_CONSTANTS'];

    function controller($state, $stateParams, orderables, programs, canAdd, TABLE_CONSTANTS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.search = search;
        vm.goToPrintOrderablePage = goToPrintOrderablePage;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name orderables
         * @type {Array}
         *
         * @description
         * Contains filtered orderables.
         */
        vm.orderables = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name programs
         * @type {Array}
         *
         * @description
         * Contains list of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name code
         * @type {String}
         *
         * @description
         * Contains code param for searching orderables.
         */
        vm.code = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name name
         * @type {String}
         *
         * @description
         * Contains name param for searching orderables.
         */
        vm.name = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name program
         * @type {String}
         *
         * @description
         * Contains program code param for searching orderables.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-list.controller:OrderableListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds orderables table configuration.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-orderable-list.controller:OrderableListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableListController.
         */
        function onInit() {
            vm.orderables = orderables;
            vm.programs = programs;

            vm.code = $stateParams.code;
            vm.name = $stateParams.name;
            vm.program = $stateParams.program;

            vm.canAdd = canAdd;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-list.controller:OrderableListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.code = vm.code;
            stateParams.name = vm.name;
            stateParams.program = vm.program;

            $state.go('openlmis.administration.orderables', stateParams, {
                reload: true
            });
        }

        // AO-744: Extend Admin Products and Facilities pages with print option
        /**
         * @ngdoc method
         * @methodOf admin-orderable-list.controller:OrderableListController
         * @name goToPrintOrderablePage
         *
         * @description
         * Takes the user to the print orderable page.
         */
        function goToPrintOrderablePage() {
            $state.go('openlmis.administration.orderables.print');
        }
        // AO-744: ends here

        /**
         * @ngdoc method
         * @methodOf admin-orderable-list.controller:OrderableListController
         * @name getTableConfig
         *
         * @description
         * prepares the table config for orerables table
         */
        function getTableConfig() {
            return {
                caption: 'adminOrderableList.products.error',
                displayCaption: !vm.orderables || vm.orderables.length === 0,
                columns: [
                    {
                        header: 'adminOrderableList.code',
                        propertyPath: 'productCode'
                    },
                    {
                        header: 'adminOrderableList.name',
                        propertyPath: 'fullProductName'
                    },
                    {
                        header: 'adminOrderableList.description',
                        propertyPath: 'description'
                    },
                    {
                        header: 'adminOrderableList.isQuarantined',
                        propertyPath: 'quarantined',
                        sortable: false,
                        template: function(orderable) {
                            return '<i ng-class="{\'icon-ok\': ' + orderable.quarantined + '}"></i>';
                        }
                    }
                ],
                actions: {
                    header: 'adminOrderableList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminOrderableList.edit',
                            redirectLink: function(item) {
                                return '.edit.general({id: \'' + item.id + '\'})';
                            }
                        }
                    ]
                },
                data: vm.orderables
            };
        }
    }

})();
