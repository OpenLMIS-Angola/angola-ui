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
     * @name order-fulfillment.controller:OrderFulfillmentController
     *
     * @description
     * Responsible for managing Order Fulfillment screen.
     */
    angular
        .module('order-fulfillment')
        .controller('OrderFulfillmentController', controller);

    controller.$inject = [
        'orderingFacilities', 'programs', 'loadingModalService', 'orders',
        '$stateParams', '$state', 'ORDER_STATUS', '$filter', 'TABLE_CONSTANTS'
    ];

    function controller(orderingFacilities, programs, loadingModalService, orders,
                        $stateParams, $state, ORDER_STATUS, $filter, TABLE_CONSTANTS) {

        var vm = this;

        vm.$onInit = onInit;
        vm.loadOrders = loadOrders;

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * The list of requesting facilities available to the user.
         */
        vm.orderingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name programs
         * @type {Array}
         *
         * @description
         * The list of all programs available to the user.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name orderStatuses
         * @type {Array}
         *
         * @description
         * The list of available order statuses.
         */
        vm.orderStatuses = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name orders
         * @type {Array}
         *
         * @description
         * Holds orders that will be displayed on screen.
         */
        vm.orders = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name options
         * @type {Object}
         *
         * @description
         * Holds options for sorting order list.
         */
        vm.options = {
            'orderFulfillment.createdDateDesc': ['createdDate,desc'],
            'orderFulfillment.createdDateAsc': ['createdDate,asc']
        };

        /**
         * @ngdoc property
         * @propertyOf order-fulfillment.controller:OrderFulfillmentController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table configuration
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf order-fulfillment.controller:OrderFulfillmentController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            $state.go('openlmis.orders.fulfillment', $stateParams, {
                notify: false
            });

            vm.orderingFacilities = orderingFacilities;
            vm.orderStatuses = [ORDER_STATUS.FULFILLING, ORDER_STATUS.ORDERED];
            vm.programs = programs;

            vm.orders = orders;

            if ($stateParams.requestingFacilityId) {
                vm.orderingFacility = vm.orderingFacilities.filter(function(facility) {
                    return facility.id === $stateParams.requestingFacilityId;
                })[0];
            }

            if ($stateParams.status) {
                vm.orderStatus = $stateParams.status;
            }

            if ($stateParams.programId) {
                vm.program = vm.programs.filter(function(program) {
                    return program.id === $stateParams.programId;
                })[0];
            }

            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf order-fulfillment.controller:OrderFulfillmentController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected status, ordering facility and program.
         */
        function loadOrders() {
            var stateParams = angular.copy($stateParams);

            stateParams.status = vm.orderStatus ? vm.orderStatus : null;
            stateParams.requestingFacilityId = vm.orderingFacility ? vm.orderingFacility.id : null;
            stateParams.programId = vm.program ? vm.program.id : null;

            $state.go('openlmis.orders.fulfillment', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf order-fulfillment.controller:OrderFulfillmentController
         * @name getTableConfig
         *
         * @description prepares the config object for orders table
         *
         * @returns {Object} Table configuration object.
         */
        function getTableConfig() {
            return {
                caption: 'orderFulfillment.noOrdersFound',
                displayCaption: !vm.orders || vm.orders.length === 0,
                columns: [
                    {
                        header: 'orderFulfillment.emergency',
                        propertyPath: 'emergency',
                        template: function(item) {
                            return '<i ng-class="{\'icon-ok\': ' + item.emergency + '}"></i>';
                        }
                    },
                    {
                        header: 'orderFulfillment.orderNumber',
                        propertyPath: 'orderCode'
                    },
                    {
                        header: 'orderFulfillment.status',
                        propertyPath: 'status'
                    },
                    {
                        header: 'orderFulfillment.orderingFacility',
                        propertyPath: 'facility',
                        template: function(item) {
                            return $filter('facility')(item.facility);
                        }
                    },
                    {
                        header: 'orderFulfillment.program',
                        propertyPath: 'program.name'
                    },
                    {
                        header: 'orderFulfillment.period',
                        propertyPath: 'processingPeriod.name'
                    },
                    {
                        header: 'orderFulfillment.createdDate',
                        propertyPath: 'createdDate',
                        template: function(item) {
                            return $filter('openlmisDate')(item.createdDate);
                        }
                    }
                ],
                actions: {
                    header: 'orderFulfillment.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'orderFulfillment.continueFulfillment',
                            redirectLink: function(item) {
                                return 'openlmis.orders.shipmentView({id:\'' +
                                    item.id  + '\'})';
                            },
                            displayAction: function(item) {
                                return item.isFulfilling();
                            }
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'orderFulfillment.startFulfillment',
                            redirectLink: function(item) {
                                return 'openlmis.orders.shipmentView({id:\'' +
                                    item.id  + '\'})';
                            },
                            displayAction: function(item) {
                                return !item.isFulfilling();
                            }
                        }
                    ]
                },
                data: vm.orders
            };
        }
    }

})();
