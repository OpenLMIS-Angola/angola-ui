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
     * @name supplier-list.controller:SupplierListController
     *
     * @description
     * Controller for managing suppliers list view.
     */

    angular
        .module('supplier-list')
        .controller('SupplierListController', controller);

    controller.$inject = ['$state', '$stateParams', 'suppliersData', 'TABLE_CONSTANTS'];

    function controller($state, $stateParams, suppliersData, TABLE_CONSTANTS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.onSearch = onSearch;
        vm.redirectToAddSupplier = redirectToAddSupplier;

        /**
         * @ngdoc property
         * @propertyOf supplier-list.controller:SupplierListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for supplier list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf supplier-list.controller:SupplierListController
         * @name supplierName
         * @type {String}
         *
         * @description
         * Contains name param for searching suppliers.
         */
        vm.supplierName = undefined;

        /**
         * @ngdoc property
         * @propertyOf supplier-list.controller:SupplierListController
         * @name suppliers
         * @type {Array}
         *
         * @description
         * Contains list of suppliers.
         */
        vm.suppliers = undefined;

        /**
         * @ngdoc method
         * @methodOf supplier-list.controller:SupplierListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SupplierListController.
         */
        function onInit() {
            vm.suppliers = suppliersData;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf supplier-list.controller:SupplierListController
         * @name onSearch
         *
         * @description
         * Reloads page with new search parameters.
         */
        function onSearch() {
            var stateParams = angular.copy($stateParams);

            stateParams.name = vm.supplierName;

            $state.go($state.current, stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf supplier-list.controller:SupplierListController
         * @name redirectToAddSupplier
         *
         * @description
         * Redirects the user to the add supplier page.
         */
        function redirectToAddSupplier() {
            $state.go('openlmis.administration.suppliers.add');
        }

        /**
         * @ngdoc method
         * @methodOf supplier-list.controller:SupplierListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the supplier list table.
         */
        function getTableConfig() {
            return {
                caption: 'supplierList.noSuppliers',
                displayCaption: !vm.suppliers || vm.suppliers.length === 0,
                isSelectable: false,
                //TODO: Adjust columns after BE is ready
                columns: [
                    {
                        header: 'supplierList.column.name',
                        propertyPath: 'name',
                        template: function(item) {
                            return item.name;
                        }
                    },
                    {
                        header: 'supplierList.column.code',
                        propertyPath: 'code',
                        template: function(item) {
                            return item.code;
                        }
                    },
                    {
                        header: 'supplierList.column.active',
                        propertyPath: 'isActive',
                        template: '<i ng-class="{\'icon-ok\': item.active}"></i>'
                    }
                ],
                actions: {
                    header: 'supplierList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.suppliers.edit({id:\'' + item.id + '\'})';
                            },
                            text: 'supplierList.action.edit'
                        }
                    ]
                },
                data: vm.suppliers
            };
        }
    }
})();
