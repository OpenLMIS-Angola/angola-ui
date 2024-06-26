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
     * @name admin-lot-list.controller:LotListController
     *
     * @description
     * Controller for managing lot list screen.
     */
    angular
        .module('admin-lot-list')
        .controller('LotListController', controller);

    controller.$inject = ['$state', '$stateParams', 'lots', 'orderables', 'TABLE_CONSTANTS'];

    function controller($state, $stateParams, lots, orderables, TABLE_CONSTANTS) {

        var vm = this;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name lots
         * @type {Array}
         *
         * @description
         * Contains filtered lots.
         */
        vm.lots = [];

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name orderables
         * @type {Array}
         *
         * @description
         * Contains orderables visible in filter
         */
        vm.orderables = [];

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name includeQuarantined
         * 
         * @description
         * Include quarantined lots in the list. By default, quarantined lots are included.
         */
        vm.includeQuarantined = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name orderableId
         * @type {String}
         *
         * @description
         * Orderable id to filter by
         * When set to null, no lots are visible
         * When set to '*', all lots are visible
         * When set to uuid, lots for specific orderable are visible
         */
        vm.orderableId = null;

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name expirationDateFrom
         * @type {String}
         */
        vm.expirationDateFrom = null;

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name expirationDateTo
         * @type {String}
         */
        vm.expirationDateTo = null;

        // ANGOLASUP-715: Filtering by lot code
        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name lotCode
         * @type {String}
         */
        vm.lotCode = null;
        // ANGOLASUP-715: Ends here

        /**
         * @ngdoc property
         * @propertyOf admin-lot-list.controller:LotListController
         * @name tableConfig
         * @type {Object}
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-lot-list.controller:LotListController
         * @name search
         *
         * @description
         * Filters lots
         */
        vm.search = function() {
            var stateParams = angular.copy($stateParams);

            stateParams.includeQuarantined = vm.includeQuarantined;
            stateParams.orderableId = vm.orderableId;
            stateParams.expirationDateFrom = vm.expirationDateFrom;
            stateParams.expirationDateTo = vm.expirationDateTo;
            // ANGOLASUP-715: Filtering by lot code
            stateParams.lotCode = vm.lotCode;
            // ANGOLASUP-715: Ends here

            $state.go('openlmis.administration.lots', stateParams, {
                reload: true
            });
        };

        /**
         * @ngdoc method
         * @methodOf admin-lot-list.controller:LotListController
         * @name $onInit
         *
         * @description
         * Initializes controller
         */
        function onInit() {
            vm.lots = lots;
            vm.orderables = orderables;

            vm.includeQuarantined = $stateParams.includeQuarantined;
            vm.orderableId = $stateParams.orderableId;
            vm.expirationDateFrom = $stateParams.expirationDateFrom;
            vm.expirationDateTo = $stateParams.expirationDateTo;

            // ANGOLASUP-715: Filtering by lot code
            vm.lotCode = $stateParams.lotCode;
            // ANGOLASUP-715: Ends here

            vm.tableConfig = getTableConfig();
        }

        function getTableConfig() {
            return {
                caption: 'adminLotList.noLots',
                displayCaption: vm.lots.length === 0,
                columns: [
                    {
                        header: 'adminLotList.productCode',
                        propertyPath: 'productCode'
                    },
                    {
                        header: 'adminLotList.productName',
                        propertyPath: 'productName'
                    },
                    {
                        header: 'adminLotList.lotCode',
                        propertyPath: 'lotCode'
                    },
                    {
                        header: 'adminLotList.expirationDate',
                        propertyPath: 'expirationDate'
                    },
                    {
                        header: 'adminLotList.manufacturedDate',
                        propertyPath: 'manufacturedDate'
                    },
                    {
                        header: 'adminLotList.isQuarantined',
                        propertyPath: 'quarantined',
                        sortable: false,
                        template: function(lot) {
                            return '<i ng-class="{\'icon-ok\': ' + lot.quarantined + '}"></i>';
                        }
                    }
                ],
                actions: {
                    header: 'adminLotList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminLotList.edit',
                            redirectLink: function(item) {
                                return 'openlmis.administration.lots.edit({lotId: \'' + item.id + '\'})';
                            }
                        }
                    ]
                },
                data: vm.lots
            };
        }
    }

})();