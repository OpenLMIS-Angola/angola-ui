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
     * @name shipment-view.controller:ShipmentViewController
     *
     * @description
     * Responsible for managing shipment view screen.
     */
    angular
        .module('shipment-view')
        .controller('ShipmentViewController', ShipmentViewController);

    ShipmentViewController.$inject = [
        'shipment', 'loadingModalService', '$state', '$window', 'fulfillmentUrlFactory',
        'messageService', 'accessTokenFactory', 'updatedOrder', 'QUANTITY_UNIT', 'tableLineItems',
        'VVM_STATUS'
    ];

    function ShipmentViewController(shipment, loadingModalService, $state, $window,
                                    fulfillmentUrlFactory, messageService, accessTokenFactory,
                                    updatedOrder, QUANTITY_UNIT, tableLineItems, VVM_STATUS) {

        var vm = this;

        vm.$onInit = onInit;
        vm.showInDoses = showInDoses;
        vm.getSelectedQuantityUnitKey = getSelectedQuantityUnitKey;
        vm.getVvmStatusLabel = VVM_STATUS.$getDisplayName;
        vm.printShipment = printShipment;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name order
         * @type {Object}
         *
         * @description
         * Holds order that will be displayed on the screen.
         */
        vm.order = undefined;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name shipment
         * @type {Object}
         *
         * @description
         * Holds shipment that will be displayed on the screen.
         */
        vm.shipment = undefined;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name tableLineItems
         * @type {Array}
         *
         * @description
         * Holds line items to be displayed on the grid.
         */
        vm.tableLineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name quantityUnit
         * @type {Object}
         *
         * @description
         * Holds quantity unit.
         */
        vm.quantityUnit = undefined;

        /**
         * @ngdoc property
         * @propertyOf shipment-view.controller:ShipmentViewController
         * @name unitsOfOrderable
         * @type {Object}
         *
         * @description
         * Holds available units of orderable.
         */
        vm.unitsOfOrderable = undefined;

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.order = updatedOrder;
            vm.shipment = shipment;
            vm.tableLineItems = tableLineItems;
            vm.QUANTITY_UNIT = QUANTITY_UNIT;
            setGroupsTotalQuantity();
        }

        vm.confirm = function() {
            vm.shipment.lineItems.forEach(function(lineItem) {
                lineItem.unitOfOrderable = {
                    id: lineItem.unit.id
                };
            });

            vm.shipment.confirm();
        };

        function getGroupTotalQuantity(lineItemGroup) {
            return lineItemGroup.lineItems.reduce(function(total, item) {
                return total + item.shipmentLineItem.quantityShipped;
            }, 0);
        }

        function setGroupTotalQuantity(lineItemGroup) {
            var totalQuantity = 0;
            if (!lineItemGroup.lineItems || lineItemGroup.lineItems.length === 0) {
                return;
            }

            var firstItem = lineItemGroup.lineItems[0];

            if (lineItemGroup.isMainGroup && isGroup(firstItem)) {
                lineItemGroup.lineItems.forEach(function(itemGroup) {
                    totalQuantity += getGroupTotalQuantity(itemGroup);
                });
            } else {
                totalQuantity = getGroupTotalQuantity(lineItemGroup);
            }
            lineItemGroup.totalQuantity = totalQuantity;
        }

        function isGroup(lineItem) {
            return lineItem.shipmentLineItem === undefined;
        }

        function setGroupsTotalQuantity() {
            vm.tableLineItems.forEach(function(item) {
                if (isGroup(item)) {
                    setGroupTotalQuantity(item);
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name showInDoses
         *
         * @description
         * Returns whether the screen is showing quantities in doses.
         *
         * @return {boolean} true if the quantities are in doses, false otherwise
         */
        function showInDoses() {
            return vm.quantityUnit === QUANTITY_UNIT.DOSES;
        }

        function getQuantity(quantity, unitFactor) {
            if (showInDoses() && unitFactor) {
                return quantity * unitFactor;
            }

            return quantity;
        }

        function getTotalQuantity(lineItems) {
            return lineItems.reduce(function(total, lineItem) {
                var quantity = showInDoses() ? lineItem.quantityShipped : lineItem.packsQuantity;
                return total + quantity ? quantity : 0;
            }, 0);
        }

        vm.getGroupFillQuantity = function(tableLineItems) {
            var lineItems = tableLineItems.lineItems;
            var firstItem = lineItems[0];
            if (firstItem.shipmentLineItem) {
                return getTotalQuantity(lineItems);
            }
            return getTotalQuantity(firstItem.lineItems);
        };

        vm.getAvailableSoh = function(lineItem) {
            return getQuantity(lineItem.stockOnHand, lineItem.unit.factor);
        };

        vm.setItemQuantity = function(lineItem) {
            lineItem.quantityShipped = lineItem.packsQuantity * lineItem.unit.factor;
            setGroupsTotalQuantity();
        };

        vm.getRemainingSoh = function(lineItem) {
            var quantity = getQuantity(lineItem.quantityShipped, lineItem.unit.factor);
            return vm.getAvailableSoh(lineItem) - quantity;
        };

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name getSelectedQuantityUnitKey
         *
         * @description
         * Returns message key for selected quantity unit.
         */
        function getSelectedQuantityUnitKey() {
            return QUANTITY_UNIT.$getDisplayName(vm.quantityUnit);
        }

        /**
         * @ngdoc method
         * @methodOf shipment-view.controller:ShipmentViewController
         * @name printShipment
         *
         * @description
         * Prints the shipment.
         *
         * @return {Promise} the promise resolved when print is successful, rejected otherwise
         */
        function printShipment() {
            var popup = $window.open('', '_blank');
            popup.document.write(messageService.get('shipmentView.saveDraftPending'));

            return shipment.save()
                .then(function(response) {
                    popup.location.href = accessTokenFactory.addAccessToken(getPrintUrl(response.id));
                });
        }

        function getPrintUrl(shipmentId) {
            // ANGOLASUP-809: Fix error related to '404 Error: Generating Pick and Pack List'
            return fulfillmentUrlFactory(
                '/api/reports/templates/angola/583ccc35-88b7-48a8-9193-6c4857d3ff60/pdf?shipmentDraftId=' + shipmentId
            );
            // ANGOLASUP-809: Ends here
        }
    }
})();
