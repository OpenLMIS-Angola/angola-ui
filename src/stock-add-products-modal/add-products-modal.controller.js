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
     * @name stock-add-products-modal.controller:AddProductsModalController
     *
     * @description
     * Manages Add Products Modal.
     */
    angular
        .module('stock-add-products-modal')
        .controller('AddProductsModalController', controller);

    // AO-384: added hasPermissionToAddNewLot and selectedItems
    controller.$inject = ['availableItems', 'messageService', 'modalDeferred', 'orderableGroupService',
        '$scope', 'MAX_INTEGER_VALUE', 'hasPermissionToAddNewLot', 'selectedItems', 'alertService'];

    function controller(availableItems, messageService, modalDeferred, orderableGroupService,
                        $scope, MAX_INTEGER_VALUE, hasPermissionToAddNewLot, selectedItems, alertService) {
    // AO-384: ends here

        var vm = this;

        vm.$onInit = onInit;
        vm.orderableSelectionChanged = orderableSelectionChanged;
        vm.addOneProduct = addOneProduct;
        vm.removeAddedProduct = removeAddedProduct;
        vm.validate = validate;
        vm.confirm = confirm;
        vm.lotChanged = lotChanged;

        // AO-384: changed name from items to availableItems, removed hasLot
        /**
         * @ngdoc property
         * @propertyOf stock-add-products-modal.controller:AddProductsModalController
         * @name availableItems
         * @type {Array}
         *
         * @description
         * All products available for users to choose from.
         */
        vm.availableItems = undefined;
        // AO-384: ends here

        /**
         * @ngdoc property
         * @propertyOf stock-add-products-modal.controller:AddProductsModalController
         * @name addedItems
         * @type {Array}
         *
         * @description
         * Products that users have chosen in this modal.
         */
        vm.addedItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-add-products-modal.controller:AddProductsModalController
         * @name selectedOrderableHasLots
         * @type {boolean}
         *
         * @description
         * True if selected orderable has lots defined.
         */
        vm.selectedOrderableHasLots = undefined;

        // AO-384: added newLot that holds new lot info
        /**
         * @ngdoc property
         * @propertyOf stock-add-products-modal.controller:AddProductsModalController
         * @name newLot
         * @type {Object}
         *
         * @description
         * Holds new lot object.
         */
        vm.newLot = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-add-products-modal.controller:AddProductsModalController
         * @name hasPermissionToAddNewLot
         * @type {boolean}
         *
         * @description
         * True when user has permission to add new lots.
         */
        vm.hasPermissionToAddNewLot = undefined;
        // AO-384: ends here

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AddProductsModalController.
         */
        function onInit() {
            // AO-384: renamed to availableItems, removed hasLot
            vm.orderableGroups = orderableGroupService.groupByOrderableId(availableItems);
            vm.availableItems = availableItems;
            // AO-384: ends here
            vm.addedItems = [];
            vm.selectedOrderableHasLots = false;

            // AO-384: added newLot that holds new lot info and if user has permission
            vm.hasPermissionToAddNewLot = hasPermissionToAddNewLot;
            vm.canAddNewLot = false;
            initiateNewLotObject();
            // AO-384: ends here

            modalDeferred.promise.catch(function() {
                vm.addedItems.forEach(function(item) {
                    item.quantity = undefined;
                    item.quantityInvalid = undefined;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name orderableSelectionChanged
         *
         * @description
         * Reset form status and change content inside lots drop down list.
         */
        function orderableSelectionChanged() {
            //reset selected lot, so that lot field has no default value
            vm.selectedLot = null;

            // AO-384: cleared new lot object and disabled adding new lot
            vm.canAddNewLot = false;
            initiateNewLotObject();
            // AO-384: ends here

            //same as above
            $scope.productForm.$setUntouched();

            //make form good as new, so errors won't persist
            $scope.productForm.$setPristine();

            // AO-384: added newLot that holds new lot info
            vm.lots = orderableGroupService.lotsOf(vm.selectedOrderableGroup, true);
            // AO-384: ends here
            vm.selectedOrderableHasLots = vm.lots.length > 0;
        }

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name addOneProduct
         *
         * @description
         * Add the currently selected product into the table beneath it for users to do further actions.
         */
        function addOneProduct() {
            //AO-474: Displaying error message when user is not allowed to add the lot
            if (!vm.hasPermissionToAddNewLot) {
                alertService.error(messageService.get('stockManagement.addingLotNotAllowed'));
            }
            //AO-474 ends here

            var selectedItem;

            // AO-384: saving new lot
            if (vm.selectedOrderableGroup && vm.selectedOrderableGroup.length) {
                vm.newLot.tradeItemId = vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem;
            }

            if (vm.newLot.lotCode) {
                selectedItem = orderableGroupService
                    .addItemWithNewLot(vm.newLot, vm.selectedOrderableGroup[0]);
            } else {
            // AO-384: ends here
                selectedItem = orderableGroupService
                    .findByLotInOrderableGroup(vm.selectedOrderableGroup, vm.selectedLot);
            }

            if (selectedItem && !vm.addedItems.includes(selectedItem)) {
                vm.addedItems.push(selectedItem);
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name removeAddedProduct
         *
         *
         * @description
         * Removes an already added product and reset its quantity value.
         */
        function removeAddedProduct(item) {
            item.quantity = undefined;
            item.quantityMissingError = undefined;
            vm.addedItems.splice(vm.addedItems.indexOf(item), 1);
        }

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name validate
         *
         * @description
         * Validate if quantity is filled in by user.
         */
        function validate(item) {
            if (!item.quantity) {
                item.quantityInvalid = messageService.get('stockAddProductsModal.required');
            } else if (item.quantity > MAX_INTEGER_VALUE) {
                item.quantityInvalid = messageService.get('stockmanagement.numberTooLarge');
            } else {
                item.quantityInvalid = undefined;
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-add-products-modal.controller:AddProductsModalController
         * @name confirm
         *
         * @description
         * Confirm added products and close modal. Will not close modal if any quantity not filled in.
         */
        function confirm() {
            //some items may not have been validated yet, so validate all here.
            vm.addedItems.forEach(function(item) {
                vm.validate(item);
            });

            $scope.$broadcast('openlmis-form-submit');

            var noErrors = _.all(vm.addedItems, function(item) {
                return !item.quantityInvalid;
            });
            if (noErrors) {
                // AO-384: adding new lot items to physical inventory items
                vm.addedItems.forEach(function(item) {
                    if (item.$isNewItem) {
                        selectedItems.push(item);
                    }
                });
                modalDeferred.resolve();
            }
        }

        // AO-384: when lot selection is changed
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name lotChanged
         *
         * @description
         * Allows inputs to add missing lot to be displayed.
         */
        function lotChanged() {
            vm.canAddNewLot = vm.selectedLot &&
                vm.selectedLot.lotCode === messageService.get('orderableGroupService.addMissingLot');
            initiateNewLotObject();
        }

        function initiateNewLotObject() {
            vm.newLot = {
                active: true
            };
        }
        // AO-384: ends here
    }
})();
