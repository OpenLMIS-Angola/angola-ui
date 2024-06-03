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
     * @name order-view.controller:OrderViewController
     *
     * @description
     * Responsible for managing Order View. Exposes facilities/programs to populate selects and
     * fetches data to populate grid.
     */
    angular
        .module('order-view')
        .controller('OrderViewController', controller);

    controller.$inject = [
        'supplyingFacilities', 'requestingFacilities', 'programs', 'requestingFacilityFactory',
        'loadingModalService', 'notificationService', 'fulfillmentUrlFactory', 'orders',
        'orderService', 'orderStatusFactory', 'canRetryTransfer', '$stateParams', '$filter', '$state', '$scope',
        'ORDER_STATUSES', 'TABLE_CONSTANTS', 'orderRequisitionStatus'
    ];

    function controller(supplyingFacilities, requestingFacilities, programs, requestingFacilityFactory,
                        loadingModalService, notificationService, fulfillmentUrlFactory, orders, orderService,
                        orderStatusFactory, canRetryTransfer, $stateParams, $filter, $state, $scope, ORDER_STATUSES,
                        TABLE_CONSTANTS, orderRequisitionStatus) {

        var vm = this;

        vm.$onInit = onInit;
        vm.loadOrders = loadOrders;
        vm.getPrintUrl = getPrintUrl;
        vm.getDownloadUrl = getDownloadUrl;
        vm.retryTransfer = retryTransfer;
        vm.redirectToOrderEdit = redirectToOrderEdit;
        vm.getOrderStatus = ORDER_STATUSES.getStatusMessage;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name supplyingFacilities
         * @type {Array}
         *
         * @description
         * The list of all supplying facilities available to the user.
         */
        vm.supplyingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * The list of requesting facilities available to the user.
         */
        vm.requestingFacilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name periodStartDate
         * @type {Object}
         *
         * @description
         * The beginning of the period to search for orders.
         */
        vm.periodStartDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name periodEndDate
         * @type {Object}
         *
         * @description
         * The end of the period to search for orders.
         */
        vm.periodEndDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name programs
         * @type {Array}
         *
         * @description
         * The list of all programs available to the user.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name orders
         * @type {Array}
         *
         * @description
         * Holds orders that will be displayed on screen.
         */
        vm.orders = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name canRetryTransfer
         * @type {Boolean}
         *
         * @description
         * Becomes true if user has permission to retry transfer of failed order.
         */
        vm.canRetryTransfer = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name orderStatuses
         * @type {Array}
         *
         * @description
         * Contains a list of possible order statuses to allow filtering.
         */
        vm.orderStatuses = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Contains config for orders list table
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name requisitionStatuses
         * 
         * @description
         * An array of order requisition statuses.
         */
        vm.requisitionStatuses = undefined;

        /**
         * @ngdoc property
         * @propertyOf order-view.controller:OrderViewController
         * @name requisitionStatus
         * 
         * @description
         * Filter for requisition status.
         */
        vm.requisitionStatus = undefined;

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.supplyingFacilities = supplyingFacilities;
            vm.requestingFacilities = requestingFacilities;
            vm.canRetryTransfer = canRetryTransfer;
            vm.programs = programs;
            vm.orderStatuses = orderStatusFactory.getAll();
            vm.requisitionStatuses = orderRequisitionStatus;
            vm.withRequisitionStatus = vm.requisitionStatuses[0].value;
            vm.withoutRequisitionStatus = vm.requisitionStatuses[1].value;

            vm.orders = orders;

            if ($stateParams.requisitionless) {
                vm.requisitionStatus = $stateParams.requisitionless === 'true'
                    ? vm.withoutRequisitionStatus : vm.withRequisitionStatus;
            }

            if ($stateParams.supplyingFacilityId) {
                vm.supplyingFacility = $filter('filter')(vm.supplyingFacilities, {
                    id: $stateParams.supplyingFacilityId
                })[0];
            }

            if ($stateParams.requestingFacilityId) {
                vm.requestingFacility = $filter('filter')(vm.requestingFacilities, {
                    id: $stateParams.requestingFacilityId
                })[0];
            }

            if ($stateParams.programId) {
                vm.program = $filter('filter')(vm.programs, {
                    id: $stateParams.programId
                })[0];
            }

            if ($stateParams.periodStartDate) {
                vm.periodStartDate = $stateParams.periodStartDate;

            }

            if ($stateParams.periodEndDate) {
                vm.periodEndDate = $stateParams.periodEndDate;
            }

            if ($stateParams.status) {
                vm.status = vm.orderStatuses.filter(function(status) {
                    return $stateParams.status === status.value;
                })[0];
            }

            vm.tableConfig = getTableConfig();
            $scope.$watch(function() {
                return vm.supplyingFacility;
            }, function(newValue, oldValue) {
                if (newValue && hasSupplyingFacilityChange(newValue, oldValue)) {
                    loadRequestingFacilities(vm.supplyingFacility.id);
                    vm.tableConfig = getTableConfig();
                }
                if (!newValue) {
                    vm.requestingFacilities = undefined;
                }
            }, true);
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected supplying facility, requesting
         * facility and program.
         *
         * @return {Array} the list of matching orders
         */
        function loadOrders() {
            var stateParams = angular.copy($stateParams);

            stateParams.supplyingFacilityId = vm.supplyingFacility ? vm.supplyingFacility.id : null;
            stateParams.requestingFacilityId = vm.requestingFacility ? vm.requestingFacility.id : null;
            stateParams.programId = vm.program ? vm.program.id : null;
            stateParams.status = vm.status ? vm.status.value : null;
            stateParams.periodStartDate = vm.periodStartDate ? $filter('isoDate')(vm.periodStartDate) : null;
            stateParams.periodEndDate = vm.periodEndDate ? $filter('isoDate')(vm.periodEndDate) : null;
            stateParams.sort = 'createdDate,desc';
            stateParams.requisitionless = handleRequisitionStatus(vm.requisitionStatus);

            $state.go('openlmis.orders.view', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name handleRequisitionStatus
         * @param {String} reqStatus the requisition status to handle
         * 
         * @returns {Boolean} false if the requisition status is set to 'with requisition',
         * true if set to 'without requisition', null otherwise
         */
        function handleRequisitionStatus(reqStatus) {
            switch (reqStatus) {
            case vm.withRequisitionStatus:
                return false;
            case vm.withoutRequisitionStatus:
                return true;
            default:
                return null;
            }
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name getPrintUrl
         *
         * @description
         * Prepares a print URL for the given order.
         *
         * @param  {Object} order the order to prepare the URL for
         * @return {String}       the prepared URL
         */
        function getPrintUrl(order) {
            // Angola: custom order print url
            return fulfillmentUrlFactory(
                '/api/reports/templates/angola/9b8726b9-0de6-46eb-b5d0-d035d400a61e/pdf?order=' + order.id
            );
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name getDownloadUrl
         *
         * @description
         * Prepares a download URL for the given order.
         *
         * @param  {Object} order the order to prepare the URL for
         * @return {String}       the prepared URL
         */
        function getDownloadUrl(order) {
            // Angola: custom order download url
            return fulfillmentUrlFactory(
                '/api/reports/templates/angola/9b8726b9-0de6-46eb-b5d0-d035d400a61e/csv?order=' + order.id
            );
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name retryTransfer
         *
         * @description
         * For an order that failed to transfer correctly, retry the transfer of order file.
         *
         * @param  {Object} order the order to retry the transfer for
         */
        function retryTransfer(order) {
            loadingModalService.open();
            orderService.retryTransfer(order.id).then(function(response) {
                if (response.result) {
                    notificationService.success('orderView.transferComplete');
                    $state.reload();
                } else {
                    notificationService.error('orderView.transferFailed');
                }
            })
                .catch(function(error) {
                    notificationService.error(error.description);
                })
                .finally(loadingModalService.close);
        }

        function loadRequestingFacilities(supplyingFacilityId) {
            loadingModalService.open();
            requestingFacilityFactory.loadRequestingFacilities(supplyingFacilityId).then(function(facilities) {
                vm.requestingFacilities = facilities;
            })
                .finally(loadingModalService.close);
        }

        function hasSupplyingFacilityChange(newValue, oldValue) {
            return newValue.id !== $stateParams.supplyingFacilityId
                || (newValue.id === $stateParams.supplyingFacilityId &&
                    oldValue && oldValue.id !== $stateParams.supplyingFacilityId);
        }

        /**
         * @ngdoc method
         * @methodOf order-view.controller:OrderViewController
         * @name redirectToOrderEdit
         *
         * @description
         * Redirects to page with order edit
         *
         * @param  {String} orderId
         */
        function redirectToOrderEdit(orderId, isReadOnly) {
            $state.go(
                'openlmis.requisitions.orderCreate.table',
                {
                    orderId: orderId,
                    isReadOnly: isReadOnly
                }
            );
        }

        function getTableConfig() {
            return {
                caption: 'orderView.noOrdersFound',
                displayCaption: !vm.orders.length,
                columns: [
                    {
                        header: 'orderView.orderNumber',
                        propertyPath: 'orderCode'
                    },
                    {
                        header: 'orderView.facility',
                        propertyPath: 'facility.code',
                        template: function(item) {
                            return item.facility.code + ' - ' + item.facility.name;
                        }
                    },
                    {
                        header: 'orderView.district',
                        propertyPath: 'facility.geographicZone.name'
                    },
                    {
                        header: 'orderView.program',
                        propertyPath: 'program.name'
                    },
                    {
                        header: 'orderView.period',
                        propertyPath: 'processingPeriod.name'
                    },
                    {
                        header: 'orderView.startDate',
                        propertyPath: 'processingPeriod.startDate',
                        template: function(item) {
                            return item.processingPeriod ?
                                $filter('openlmisDate')(item.processingPeriod.startDate) : '';
                        }
                    },
                    {
                        header: 'orderView.endDate',
                        propertyPath: 'processingPeriod.endDate',
                        template: function(item) {
                            return item.processingPeriod ?
                                $filter('openlmisDate')(item.processingPeriod.endDate) : '';
                        }
                    },
                    {
                        header: 'orderView.status',
                        propertyPath: 'status',
                        template: function(item) {
                            return vm.getOrderStatus(item.status);
                        }
                    },
                    {
                        header: 'orderView.emergency',
                        propertyPath: 'emergency',
                        headerClasses: 'col-emergency',
                        template: function(item) {
                            return '<i ng-class="{\'icon-ok\':' + item.emergency + '}"></i>';
                        }
                    },
                    {
                        header: 'orderView.createdDate',
                        propertyPath: 'createdDate',
                        template: function(item) {
                            return item.createdDate ?
                                $filter('openlmisDate')(item.createdDate) : '';
                        }
                    },
                    {
                        header: 'orderView.lastUpdated',
                        propertyPath: 'lastUpdatedDate',
                        sortable: false,
                        template: function(item) {
                            return item.lastUpdatedDate ?
                                $filter('openlmisDate')(item.lastUpdatedDate) : '';
                        }
                    }
                ],
                actions: {
                    header: 'orderView.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.DOWNLOAD,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING;
                            },
                            classes: 'print',
                            onClick: function(item) {
                                vm.getPrintUrl(item);
                            },
                            text: 'orderView.print'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.DOWNLOAD,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING;
                            },
                            classes: 'download',
                            onClick: function(item) {
                                vm.getDownloadUrl(item);
                            },
                            text: 'orderView.download'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            displayAction: function(item) {
                                return item.status !== ORDER_STATUSES.CREATING &&
                                    vm.canRetryTransfer &&
                                    item.transferFailed();
                            },
                            classes: 'retry',
                            onClick: function(item) {
                                vm.retryTransfer(item);
                            },
                            text: 'orderView.retry'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            displayAction: function(item) {
                                return item.status === ORDER_STATUSES.CREATING;
                            },
                            classes: 'order-edit',
                            onClick: function(item) {
                                vm.redirectToOrderEdit(item.id, false);
                            },
                            text: 'orderView.edit'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            classes: 'order-view',
                            onClick: function(item) {
                                vm.redirectToOrderEdit(item.id, true);
                            },
                            text: 'orderView.view'
                        }
                    ]
                },
                data: vm.orders
            };
        }

    }

})();
