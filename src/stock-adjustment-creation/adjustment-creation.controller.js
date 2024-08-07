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
     * @name stock-adjustment-creation.controller:StockAdjustmentCreationController
     *
     * @description
     * Controller for managing stock adjustment creation.
     */
    angular
        .module('stock-adjustment-creation')
        .controller('StockAdjustmentCreationController', controller);

    controller.$inject = [
        '$scope', '$state', '$stateParams', '$filter', 'confirmDiscardService', 'program', 'facility',
        'orderableGroups', 'reasons', 'confirmService', 'messageService', 'user', 'adjustmentType',
        'srcDstAssignments', 'stockAdjustmentCreationService', 'notificationService', 'offlineService',
        'orderableGroupService', 'MAX_INTEGER_VALUE', 'VVM_STATUS', 'loadingModalService', 'alertService',
        'dateUtils', 'displayItems', 'ADJUSTMENT_TYPE', 'UNPACK_REASONS', 'REASON_TYPES', 'STOCKCARD_STATUS',
        'hasPermissionToAddNewLot', 'LotResource', '$q', 'editLotModalService', 'moment',
        // ANGOLASUP-717: Create New Issue Report
        'accessTokenFactory', '$window', 'stockmanagementUrlFactory',
        // ANGOLASUP-717: ends here
        // AO-805: Allow users with proper rights to edit product prices
        'OrderableResource', 'permissionService', 'ADMINISTRATION_RIGHTS', 'authorizationService',
        // AO-805: Ends here
        'unitOfOrderableService', 'wardService', 'orderableGroupsByWard', 'WARDS_CONSTANTS', 'sourceDestinationService'
    ];

    function controller($scope, $state, $stateParams, $filter, confirmDiscardService, program,
                        facility, orderableGroups, reasons, confirmService, messageService, user,
                        adjustmentType, srcDstAssignments, stockAdjustmentCreationService, notificationService,
                        offlineService, orderableGroupService, MAX_INTEGER_VALUE, VVM_STATUS, loadingModalService,
                        alertService, dateUtils, displayItems, ADJUSTMENT_TYPE, UNPACK_REASONS, REASON_TYPES,
                        STOCKCARD_STATUS, hasPermissionToAddNewLot, LotResource, $q, editLotModalService, moment,
                        // ANGOLASUP-717: Create New Issue Report
                        // AO-805: Allow users with proper rights to edit product prices
                        accessTokenFactory, $window, stockmanagementUrlFactory, OrderableResource, permissionService,
                        ADMINISTRATION_RIGHTS, authorizationService, unitOfOrderableService, wardService,
                        orderableGroupsByWard, WARDS_CONSTANTS, sourceDestinationService) {
        // ANGOLASUP-717: ends here
        // AO-805: Ends here
        var vm = this;

        vm.previousAdded = {};
        vm.expirationDateChanged = expirationDateChanged;
        vm.newLotCodeChanged = newLotCodeChanged;
        vm.validateExpirationDate = validateExpirationDate;
        vm.lotChanged = lotChanged;
        vm.addProduct = addProduct;
        vm.hasPermissionToAddNewLot = hasPermissionToAddNewLot;
        // AO-805: Allow users with proper rights to edit product prices
        vm.editProductPriceAdjustmentTypes = ['receive', 'adjustment'];
        vm.hasPermissionToEditProductPrices = hasPermissionToEditProductPrices();
        // AO-805: Ends here

        // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name totalCost
         * @type {Number}
         *
         * @description
         * Holds total cost of adjustments line items
         */
        vm.totalCost = 0;
        // AO-804: Ends here

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name vvmStatuses
         * @type {Object}
         *
         * @description
         * Holds list of VVM statuses.
         */
        vm.vvmStatuses = VVM_STATUS;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name showReasonDropdown
         * @type {boolean}
         */
        vm.showReasonDropdown = true;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name showVVMStatusColumn
         * @type {boolean}
         *
         * @description
         * Indicates if VVM Status column should be visible.
         */
        vm.showVVMStatusColumn = false;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name offline
         * @type {boolean}
         *
         * @description
         * Holds information about internet connection
         */
        vm.offline = offlineService.isOffline;

        vm.key = function(secondaryKey) {
            return adjustmentType.prefix + 'Creation.' + secondaryKey;
        };

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name newLot
         * @type {Object}
         *
         * @description
         * Holds new lot object.
         */
        vm.newLot = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name newItemUnitId
         * @type {string}
         *
         * @description
         * Holds id of a unit which is added to a new product
         *
         */
        vm.newItemUnitId = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name unitsOfOrderable
         * @type {Object[]}
         *
         * @description
         * Holds possible units for orderable
         */
        vm.unitsOfOrderable = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name displayWardSelect
         * @type {boolean}
         *
         * @description
         * Holds information should the dialog used for ward selection be displayed
         */
        vm.displayWardSelect = false;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name homeFacilityWards
         * @type {Object[]}
         *
         * @description
         * Array of home facility wards
         */
        vm.homeFacilityWards = [];

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name productDestination
         * @type {Object}
         *
         * @description
         * It is either ward or a whole home facility. Based on user input during lineItem adding
         */
        vm.itemDestination = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name wardsValidSources
         * @type {Object[]}
         *
         * @description
         *
         * Valid sources for all wards
         */
        vm.wardsValidSources = undefined;

        // OAM-5: Lot code filter UI improvements.
        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name isExpired
         *
         * @description
         * Checks whether the expiration date of a particular LOT has been exceeded.
         */
        vm.isExpired = function(lot) {
            if (lot.expirationDate) {
                var currentDate = new Date();
                var currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                return lot.expirationDate < currentDay;
            }
            return false;
        };
        // OAM-5: Ends here.

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name search
         *
         * @description
         * It searches from the total line items with given keyword. If keyword is empty then all line
         * items will be shown.
         */
        vm.search = function() {
            vm.displayItems = stockAdjustmentCreationService.search(vm.keyword, vm.addedLineItems, vm.hasLot);

            $stateParams.addedLineItems = vm.addedLineItems;
            $stateParams.displayItems = vm.displayItems;
            $stateParams.keyword = vm.keyword;
            $stateParams.page = getPageNumber();
            $state.go($state.current.name, $stateParams, {
                reload: true,
                notify: false
            });
        };

        vm.getAddedUnitName = function() {
            return getUnitOfOrderableById(vm.newItemUnitId).name;
        };

        function getUnitOfOrderableById(unitId) {
            return vm.unitsOfOrderable.find(function(unit) {
                return unit.id === unitId;
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name addProduct
         *
         * @description
         * Add a product for stock adjustment.
         */
        function addProduct() {
            var selectedItem;

            if (vm.selectedOrderableGroup && vm.selectedOrderableGroup.length) {
                vm.newLot.tradeItemId = vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem;
            }

            if (vm.newLot.lotCode) {
                var createdLot = angular.copy(vm.newLot);
                selectedItem = orderableGroupService
                    .findByLotAndUnitInOrderableGroup(vm.selectedOrderableGroup, createdLot, true, vm.newItemUnitId);
                selectedItem.$isNewItem = true;
            } else {
                selectedItem = orderableGroupService
                    .findByLotAndUnitInOrderableGroup(vm.selectedOrderableGroup, vm.selectedLot, false,
                        vm.newItemUnitId);
            }

            var isWard = true;

            if (!vm.itemDestination) {
                vm.itemDestination = angular.copy(facility);
            }
            if (!vm.itemDestination || vm.itemDestination.id === facility.id) {
                isWard = false;
            }

            vm.newLot.expirationDateInvalid = undefined;
            vm.newLot.lotCodeInvalid = undefined;
            validateExpirationDate();
            validateLotCode(vm.addedLineItems, selectedItem);
            validateLotCode(vm.allItems, selectedItem);
            var noErrors = !vm.newLot.expirationDateInvalid && !vm.newLot.lotCodeInvalid;

            if (noErrors) {
                // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
                vm.addedLineItems.unshift(_.extend({
                    $errors: {},
                    $previewSOH: selectedItem.stockOnHand,
                    unitOfOrderableId: vm.newItemUnitId,
                    unit: getUnitOfOrderableById(vm.newItemUnitId),
                    price: getProductPrice(selectedItem),
                    totalPrice: 0,
                    destination: vm.itemDestination,
                    isWard: isWard
                },
                selectedItem, copyDefaultValue()));
                // AO-804: Ends here

                vm.previousAdded = vm.addedLineItems[0];

                vm.search();
            }
        }

        function copyDefaultValue() {
            var defaultDate;
            if (vm.previousAdded.occurredDate) {
                defaultDate = vm.previousAdded.occurredDate;
            } else {
                defaultDate = dateUtils.toStringDate(new Date());
            }

            return {
                assignment: vm.previousAdded.assignment,
                srcDstFreeText: vm.previousAdded.srcDstFreeText,
                reason: (adjustmentType.state === ADJUSTMENT_TYPE.KIT_UNPACK.state)
                    ? {
                        id: UNPACK_REASONS.KIT_UNPACK_REASON_ID
                    } : vm.previousAdded.reason,
                reasonFreeText: vm.previousAdded.reasonFreeText,
                occurredDate: defaultDate
            };
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name remove
         *
         * @description
         * Remove a line item from added products.
         *
         * @param {Object} lineItem line item to be removed.
         */
        vm.remove = function(lineItem) {
            var index = vm.addedLineItems.indexOf(lineItem);
            vm.addedLineItems.splice(index, 1);

            vm.search();
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name removeDisplayItems
         *
         * @description
         * Remove all displayed line items.
         */
        vm.removeDisplayItems = function() {
            confirmService.confirmDestroy(vm.key('clearAll'), vm.key('clear'))
                .then(function() {
                    vm.addedLineItems = _.difference(vm.addedLineItems, vm.displayItems);
                    vm.displayItems = [];
                });
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name getLineItemTotalQuantity
         *
         * @description
         * Calculates the total quantity of a line item. (mulitiplied by item quantity)
         */
        vm.getLineItemTotalQuantity = function(lineItem) {
            var itemQuantity = lineItem.quantity ? lineItem.quantity : 0;
            var factor = lineItem.unit ? lineItem.unit.factor : 1;
            return itemQuantity * factor;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateQuantity
         *
         * @description
         * Validate line item quantity and returns self.
         *
         * @param {Object} lineItem line item to be validated.
         */
        vm.validateQuantity = function(lineItem) {
            // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
            lineItem.totalPrice = 0;
            // AO-804: Ends here
            var validatedQuantity = vm.getLineItemTotalQuantity(lineItem);
            if (adjustmentType.state === ADJUSTMENT_TYPE.ISSUE.state &&
                    validatedQuantity > lineItem.$previewSOH && ((lineItem.reason &&
                    lineItem.reason.reasonType === REASON_TYPES.DEBIT) || !lineItem.reason)) {
                lineItem.$errors.quantityInvalid = messageService
                    .get('stockAdjustmentCreation.quantityGreaterThanStockOnHand');
            } else if (validatedQuantity > MAX_INTEGER_VALUE) {
                lineItem.$errors.quantityInvalid = messageService.get('stockmanagement.numberTooLarge');
            } else if (validatedQuantity >= 1) {
                lineItem.$errors.quantityInvalid = false;
                // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
                lineItem.totalPrice = calculateTotalPrice(lineItem);
                // AO-804: Ends here
            } else {
                lineItem.$errors.quantityInvalid = messageService.get(vm.key('positiveInteger'));
            }
            // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
            calculateTotalCost(vm.addedLineItems);
            // AO-804: Ends here
            return lineItem;
        };

        // AO-805: Allow users with proper rights to edit product prices
        vm.validatePrice = function(lineItem) {
            lineItem.totalPrice = 0;
            if (lineItem.price === '' || lineItem.price === null) {
                lineItem.$errors.priceInvalid = messageService.get('adjustmentCreation.numberEqualOrGreaterThan0');
            } else if (lineItem.price > MAX_INTEGER_VALUE) {
                lineItem.$errors.priceInvalid = messageService.get('stockmanagement.numberTooLarge');
            } else if (lineItem.price >= 0) {
                lineItem.$errors.priceInvalid = false;
                lineItem.totalPrice = calculateTotalPrice(lineItem);
            }
            calculateTotalCost(vm.addedLineItems);
            return lineItem;
        };
        // AO-805: Ends here

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateAssignment
         *
         * @description
         * Validate line item assignment and returns self.
         *
         * @param {Object} lineItem line item to be validated.
         */
        vm.validateAssignment = function(lineItem) {
            if (adjustmentType.state !== ADJUSTMENT_TYPE.ADJUSTMENT.state &&
                adjustmentType.state !== ADJUSTMENT_TYPE.KIT_UNPACK.state) {
                lineItem.$errors.assignmentInvalid = isEmpty(lineItem.assignment);
            }
            return lineItem;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateReason
         *
         * @description
         * Validate line item reason and returns self.
         *
         * @param {Object} lineItem line item to be validated.
         */
        vm.validateReason = function(lineItem) {
            if (adjustmentType.state === 'adjustment') {
                lineItem.$errors.reasonInvalid = isEmpty(lineItem.reason);
            }
            // AO-805: Allow users with proper rights to edit product prices
            if (lineItem.reason && lineItem.reason.debitReasonType) {
                lineItem.price = getProductPrice(lineItem);
                lineItem.totalPrice = calculateTotalPrice(lineItem);
                calculateTotalCost(vm.addedLineItems);
            }
            // AO-805: Ends here
            return lineItem;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name lotChanged
         *
         * @description
         * Allows inputs to add missing lot to be displayed.
         */
        function lotChanged() {
            vm.canAddNewLot = vm.selectedLot
                && vm.selectedLot.lotCode === messageService.get('orderableGroupService.addMissingLot');
            initiateNewLotObject();
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateDate
         *
         * @description
         * Validate line item occurred date and returns self.
         *
         * @param {Object} lineItem line item to be validated.
         */
        vm.validateDate = function(lineItem) {
            lineItem.$errors.occurredDateInvalid = isEmpty(lineItem.occurredDate);
            return lineItem;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name clearFreeText
         *
         * @description
         * remove free text from given object.
         *
         * @param {Object} obj      given target to be changed.
         * @param {String} property given property to be cleared.
         */
        vm.clearFreeText = function(obj, property) {
            obj[property] = null;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name submit
         *
         * @description
         * Submit all added items.
         */
        vm.submit = function() {
            $scope.$broadcast('openlmis-form-submit');
            if (validateAllAddedItems()) {
                var confirmMessage = messageService.get(vm.key('confirmInfo'), {
                    username: user.username,
                    number: vm.addedLineItems.length
                });
                confirmService.confirm(confirmMessage, vm.key('confirm')).then(confirmSubmit);
            } else {
                vm.keyword = null;
                reorderItems();
                alertService.error('stockAdjustmentCreation.submitInvalid');
            }
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name orderableSelectionChanged
         *
         * @description
         * Reset form status and change content inside lots drop down list.
         */
        vm.orderableSelectionChanged = function() {
            //reset selected lot, so that lot field has no default value
            vm.selectedLot = null;

            initiateNewLotObject();
            vm.canAddNewLot = false;

            //same as above
            $scope.productForm.$setUntouched();

            //make form good as new, so errors won't persist
            $scope.productForm.$setPristine();

            vm.lots = orderableGroupService.lotsOf(vm.selectedOrderableGroup, vm.hasPermissionToAddNewLot);
            // OAM-5: Lot code filter UI improvements.
            var currentDate = new Date();
            var currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

            var nonExpiredLots = [];
            var expiredLots = [];
            var lotsWithNoExpirationDate = [];
            var addLot = [];

            vm.lots.forEach(function(lot) {
                if (lot.lotCode === 'Add lot') {
                    addLot.push(lot);
                } else if (lot.expirationDate) {
                    var expirationDate = new Date(lot.expirationDate);
                    if (expirationDate >= currentDay) {
                        nonExpiredLots.push(lot);
                    } else {
                        expiredLots.push(lot);
                    }
                } else {
                    lotsWithNoExpirationDate.push(lot);
                }
            });

            nonExpiredLots.sort(function(lotA, lotB) {
                var lotAExptDate = new Date(lotA.expirationDate);
                var lotBExptDate = new Date(lotB.expirationDate);
                return lotAExptDate - lotBExptDate;
            });

            expiredLots.sort(function(lotA, lotB) {
                var lotAExptDate = new Date(lotA.expirationDate);
                var lotBExptDate = new Date(lotB.expirationDate);
                return lotAExptDate - lotBExptDate;
            });

            vm.lots = addLot.concat(lotsWithNoExpirationDate, nonExpiredLots, expiredLots);
            // OAM-5: ends here
            vm.selectedOrderableHasLots = vm.lots.length > 0;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name getStatusDisplay
         *
         * @description
         * Returns VVM status display.
         *
         * @param  {String} status VVM status
         * @return {String}        VVM status display name
         */
        vm.getStatusDisplay = function(status) {
            return messageService.get(VVM_STATUS.$getDisplayName(status));
        };

        // AO-805: Allow users with proper rights to edit product prices
        vm.canEditProductPrice = function(lineItem) {
            var hasProperPermission = vm.hasPermissionToEditProductPrices.$$state.value;
            var canEditProductPrice = vm.editProductPriceAdjustmentTypes.includes(adjustmentType.state) &&
                hasProperPermission;
            if (adjustmentType.state === 'adjustment') {
                var adjustmentReason = lineItem.reason;
                canEditProductPrice = adjustmentReason ? (adjustmentReason.reasonType === 'CREDIT')
                    && hasProperPermission : false;
            }
            return canEditProductPrice;
        };
        // AO-805: Ends here

        function isEmpty(value) {
            return _.isUndefined(value) || _.isNull(value);
        }

        function validateAllAddedItems() {
            _.each(vm.addedLineItems, function(item) {
                vm.validateQuantity(item);
                vm.validateDate(item);
                vm.validateAssignment(item);
                vm.validateReason(item);
                // AO-805: Allow users with proper rights to edit product prices
                vm.validatePrice(item);
                // AO-805: Ends here
            });
            return _.chain(vm.addedLineItems)
                .groupBy(function(item) {
                    return item.lot ? item.lot.id : item.orderable.id;
                })
                .values()
                .flatten()
                .all(isItemValid)
                .value();
        }

        function isItemValid(item) {
            return _.chain(item.$errors).keys()
                .all(function(key) {
                    return item.$errors[key] === false;
                })
                .value();
        }

        function reorderItems() {
            var sorted = $filter('orderBy')(vm.addedLineItems, ['orderable.productCode', '-occurredDate']);

            vm.displayItems = _.chain(sorted).groupBy(function(item) {
                return item.lot ? item.lot.id : item.orderable.id;
            })
                .sortBy(function(group) {
                    return _.every(group, function(item) {
                        return !item.$errors.quantityInvalid;
                    });
                })
                .flatten(true)
                .value();
        }

        function setLotPromisesAndErrorLots(distinctLots, lotPromises, errorLots) {
            var lotResource = new LotResource();

            distinctLots.forEach(function(lot) {
                lotPromises.push(lotResource.create(lot)
                    .then(function(createResponse) {
                        vm.addedLineItems.forEach(function(item) {
                            if (item.lot.lotCode === lot.lotCode) {
                                item.$isNewItem = false;
                                addItemToOrderableGroups(item);
                            }
                        });
                        return createResponse;
                    })
                    .catch(function(response) {
                        if (response.data.messageKey ===
                            'referenceData.error.lot.lotCode.mustBeUnique' ||
                            response.data.messageKey ===
                            'referenceData.error.lot.tradeItem.required') {
                            errorLots.push({
                                lotCode: lot.lotCode,
                                error: response.data.messageKey ===
                                'referenceData.error.lot.lotCode.mustBeUnique' ?
                                    'stockPhysicalInventoryDraft.lotCodeMustBeUnique' :
                                    'stockPhysicalInventoryDraft.tradeItemRequuiredToAddLotCode'
                            });
                        }
                    }));
            });

            return lotPromises;
        }

        function onSubmit() {
            loadingModalService.open();
            var addedLineItems = angular.copy(vm.addedLineItems);
            generateKitConstituentLineItem(addedLineItems);
            var lotPromises = [],
                errorLots = [],
                distinctLots = [];

            addedLineItems.forEach(function(lineItem) {
                lineItem.quantity = vm.getLineItemTotalQuantity(lineItem);

                if (lineItem.lot && lineItem.$isNewItem && _.isUndefined(lineItem.lot.id) &&
                !listContainsTheSameLot(distinctLots, lineItem.lot)) {
                    distinctLots.push(lineItem.lot);
                }
            });

            setLotPromisesAndErrorLots(distinctLots, lotPromises, errorLots);

            var productsWithPriceChanged = getProductsWithPriceChanged(addedLineItems);
            var lastProductWithPriceChanged = productsWithPriceChanged[productsWithPriceChanged.length - 1];
            var priceChangesPromises = [];

            if (!lastProductWithPriceChanged) {
                return createLotsAndSubmitAdjustments(addedLineItems, lotPromises, errorLots);
            }

            setProductPriceForProgram(lastProductWithPriceChanged, program);
            priceChangesPromises.push(updateProductPrice(lastProductWithPriceChanged.orderable,
                lastProductWithPriceChanged.price));

            return $q.all(priceChangesPromises).then(function() {
                return createLotsAndSubmitAdjustments(addedLineItems, lotPromises, errorLots);
            })
                .catch(function(errorResponse) {
                    loadingModalService.close();
                    $q.reject();
                    alertService.error(errorResponse.data.message);
                });
        }

        function confirmSubmit() {
            try {
                onSubmit();
            } catch (error) {
                loadingModalService.close();
                // eslint-disable-next-line no-console
                console.error(error.message);
                alertService.error('openlmisStateChangeError.internalApplicationError.message');
            }
        }

        function getLineItemsByDestinationMap(addedLineItems) {
            var addedLineItemsMap = {};
            addedLineItems.forEach(function(lineItem) {
                var destinationId = lineItem.destination.id;
                if (!addedLineItemsMap[destinationId]) {
                    addedLineItemsMap[destinationId] = [];
                }
                addedLineItemsMap[destinationId].push(lineItem);
            });
            return addedLineItemsMap;
        }

        function createLotsAndSubmitAdjustments(addedLineItems, lotPromises, errorLots) {
            return $q.all(lotPromises)
                .then(function(responses) {
                    if (errorLots !== undefined && errorLots.length > 0) {
                        return $q.reject();
                    }
                    responses.forEach(function(lot) {
                        addedLineItems.forEach(function(lineItem) {
                            if (lineItem.lot && lineItem.lot.lotCode === lot.lotCode
                                && lineItem.lot.tradeItemId === lot.tradeItemId) {
                                lineItem.lot = lot;
                            }
                        });
                        return addedLineItems;
                    });

                    handleAdjustmentSubmission(addedLineItems);
                })
                .catch(function(errorResponse) {
                    loadingModalService.close();
                    if (errorLots) {
                        var errorLotsReduced = errorLots.reduce(function(result, currentValue) {
                            if (currentValue.error in result) {
                                result[currentValue.error].push(currentValue.lotCode);
                            } else {
                                result[currentValue.error] = [currentValue.lotCode];
                            }
                            return result;
                        }, {});
                        for (var error in errorLotsReduced) {
                            alertService.error(error, errorLotsReduced[error].join(', '));
                        }
                        vm.selectedOrderableGroup = undefined;
                        vm.selectedLot = undefined;
                        vm.lotChanged();
                        return $q.reject(errorResponse.data.message);
                    }
                    alertService.error(errorResponse.data.message);
                });
        }

        function handleAdjustmentSubmission(addedLineItems) {
            if (adjustmentType.state === ADJUSTMENT_TYPE.RECEIVE.state) {
                return handleStockReceive(addedLineItems);
            }
            return submitAdjustment(addedLineItems);
        }

        function handleStockReceive(addedLineItems) {
            var lineItemsByDestinationMap = getLineItemsByDestinationMap(addedLineItems);
            var submitAdjustmentPromises = [];
            for (var key in lineItemsByDestinationMap) {
                var lineItemsGroup = lineItemsByDestinationMap[key];
                submitAdjustmentPromises.push(
                    getSubmitAdjustmentPromise(lineItemsGroup, lineItemsGroup[0].destination)
                );
            }

            return $q.all(submitAdjustmentPromises).then(function() {
                goToStockCardSummaries();
            });
        }

        function getSubmitAdjustmentPromise(addedLineItems, facility) {
            return stockAdjustmentCreationService.submitAdjustments(program.id, facility.id,
                addedLineItems, adjustmentType, user);
        }

        function submitAdjustment(addedLineItems) {
            return getSubmitAdjustmentPromise(addedLineItems, facility)
                // AO-668: ends here
                // ANGOLASUP-717: Create New Issue Report
                .then(function(stockEventId) {
                    if (adjustmentType.state === ADJUSTMENT_TYPE.ISSUE.state) {
                        confirmService.confirm('adjustmentCreation.printModal.label',
                            'stockPhysicalInventoryDraft.printModal.yes',
                            'stockPhysicalInventoryDraft.printModal.no')
                            .then(function() {
                                $window.open(accessTokenFactory.addAccessToken(getPrintUrl(stockEventId)),
                                    '_blank');
                            })
                            .finally(function() {
                                goToStockCardSummaries();
                            });
                    } else {
                        goToStockCardSummaries();
                    }
                    // ANGOLASUP-717: ends here
                }, function(errorResponse) {
                    loadingModalService.close();
                    alertService.error(errorResponse.data.message);
                });
        }

        vm.itemDestinationChanged = function() {
            if (vm.itemDestination) {
                vm.orderableGroups = vm.orderableGroupsByWard.find(function(obj) {
                    return obj.wardId === vm.itemDestination.id;
                }).orderableGroups;
                return;
            }

            vm.orderableGroups = orderableGroups;
            vm.selectedOrderableGroup = undefined;
        };

        // ANGOLASUP-717: Create New Issue Report
        function getPrintUrl(stockEventId) {
            var reportTemplateId = '79301ebf-1198-4a35-9d00-18c9fe450807';
            return stockmanagementUrlFactory('/api/reports/templates/angola/' + reportTemplateId
                + '/pdf?stockEventId=' + stockEventId);
        }

        function goToStockCardSummaries() {
            if (offlineService.isOffline()) {
                notificationService.offline(vm.key('submittedOffline'));
            } else {
                notificationService.success(vm.key('submitted'));
            }
            $state.go('openlmis.stockmanagement.stockCardSummaries', {
                facility: facility.id,
                program: program.id,
                active: STOCKCARD_STATUS.ACTIVE
            });
        }
        // ANGOLASUP-717: ends here

        function addItemToOrderableGroups(item) {
            vm.orderableGroups.forEach(function(array) {
                if (array[0].orderable.id === item.orderable.id) {
                    array.push(angular.copy(item));
                }
            });
        }

        function listContainsTheSameLot(list, lot) {
            var itemExistsOnList = false;
            list.forEach(function(item) {
                if (item.lotCode === lot.lotCode &&
                    item.tradeItemId === lot.tradeItemId) {
                    itemExistsOnList = true;
                }
            });
            return itemExistsOnList;
        }

        function generateKitConstituentLineItem(addedLineItems) {
            if (adjustmentType.state !== ADJUSTMENT_TYPE.KIT_UNPACK.state) {
                return;
            }

            //CREDIT reason ID
            var creditReason = {
                id: UNPACK_REASONS.UNPACKED_FROM_KIT_REASON_ID
            };

            var constituentLineItems = [];

            addedLineItems.forEach(function(lineItem) {
                lineItem.orderable.children.forEach(function(constituent) {
                    constituent.reason = creditReason;
                    constituent.occurredDate = lineItem.occurredDate;
                    constituent.quantity = lineItem.quantity * constituent.quantity;
                    constituentLineItems.push(constituent);
                });
            });

            addedLineItems.push.apply(addedLineItems, constituentLineItems);
        }

        function onInit() {
            var copiedOrderableGroups = angular.copy(orderableGroups);
            vm.allItems = _.flatten(copiedOrderableGroups);

            $state.current.label = messageService.get(vm.key('title'), {
                facilityCode: facility.code,
                facilityName: facility.name,
                program: program.name
            });

            unitOfOrderableService.getAll()
                .then(function(response) {
                    vm.unitsOfOrderable = response.content ? response.content : response;
                });

            initViewModel();
            initStateParams();

            $scope.$watch(function() {
                return vm.addedLineItems;
            }, function(newValue) {
                $scope.needToConfirm = newValue.length > 0;
                if (!vm.keyword) {
                    vm.addedLineItems = vm.displayItems;
                }
                $stateParams.addedLineItems = vm.addedLineItems;
                $stateParams.displayItems = vm.displayItems;
                $stateParams.keyword = vm.keyword;
                $state.go($state.current.name, $stateParams, {
                    reload: false,
                    notify: false
                });
            }, true);
            confirmDiscardService.register($scope, 'openlmis.stockmanagement.stockCardSummaries');

            $scope.$on('$stateChangeStart', function() {
                angular.element('.popover').popover('destroy');
            });
            // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
            calculateTotalCost(vm.addedLineItems);
            // AO-804: Ends here
        }

        function initViewModel() {
            //Set the max-date of date picker to the end of the current day.
            vm.maxDate = new Date();
            vm.maxDate.setHours(23, 59, 59, 999);

            vm.program = program;
            vm.facility = facility;
            vm.reasons = reasons;
            vm.showReasonDropdown = (adjustmentType.state !== ADJUSTMENT_TYPE.KIT_UNPACK.state);
            vm.srcDstAssignments = srcDstAssignments;
            vm.addedLineItems = $stateParams.addedLineItems || [];
            $stateParams.displayItems = displayItems;
            vm.displayItems = $stateParams.displayItems || [];
            vm.keyword = $stateParams.keyword;

            vm.orderableGroups = orderableGroups;
            vm.orderableGroupsByWard = orderableGroupsByWard;
            vm.hasLot = false;
            vm.orderableGroups.forEach(function(group) {
                vm.hasLot = vm.hasLot || orderableGroupService.lotsOf(group, hasPermissionToAddNewLot).length > 0;
            });

            // OAM-5: Lot code filter UI improvements.
            var collator = new Intl.Collator('pt', {
                numeric: true,
                sensitivity: 'base'
            });
            vm.orderableGroups.sort(function(a, b) {
                return collator.compare(a[0].orderable.fullProductName,
                    b[0].orderable.fullProductName);
            });
            // OAM-5: ends here

            setUpWards();
            vm.showVVMStatusColumn = orderableGroupService.areOrderablesUseVvm(vm.orderableGroups);
            vm.hasPermissionToAddNewLot = hasPermissionToAddNewLot;
            vm.canAddNewLot = false;
            initiateNewLotObject();
        }

        function setUpWards() {
            if (!vm.facility.geographicZone) {
                return;
            }

            wardService.getWardsByFacility({
                zoneId: vm.facility.geographicZone.id,
                sort: 'code,asc',
                type: WARDS_CONSTANTS.WARD_TYPE_CODE
            }).then(function(response) {
                var wards = response.content ? response.content : response;
                var disabledWardsNames = [];

                vm.homeFacilityWards = wards.filter(function(ward) {
                    if (ward.enabled) {
                        return true;
                    }
                    disabledWardsNames.push(ward.name);
                    return false;
                });

                vm.displayWardSelect = vm.homeFacilityWards.length > 0 &&
                    adjustmentType.state === ADJUSTMENT_TYPE.RECEIVE.state;

                if (vm.homeFacilityWards.length > 0) {
                    setUpWardsValidSources(disabledWardsNames);
                }
            });
        }

        function setUpWardsValidSources(disabledWardsNames) {
            var wardNames = vm.homeFacilityWards.map(function(ward) {
                return ward.name;
            });

            vm.srcDstAssignments = vm.srcDstAssignments.filter(function(assignment) {
                return !disabledWardsNames.includes(assignment.name);
            });

            wardNames.push(vm.facility.name);

            sourceDestinationService
                .getSourceAssignments(program.id, vm.homeFacilityWards[0].id)
                .then(function(wardsValidSources) {
                    vm.wardsValidSources = wardsValidSources.filter(function(assignment) {
                        return wardNames.includes(assignment.name);
                    });
                });
        }

        function initiateNewLotObject() {
            vm.newLot = {
                active: true
            };
        }

        function initStateParams() {
            $stateParams.page = getPageNumber();
            $stateParams.program = program;
            $stateParams.facility = facility;
            $stateParams.reasons = reasons;
            $stateParams.srcDstAssignments = srcDstAssignments;
            $stateParams.orderableGroups = orderableGroups;
        }

        function getPageNumber() {
            var totalPages = Math.ceil(vm.displayItems.length / parseInt($stateParams.size));
            var pageNumber = parseInt($state.params.page || 0);
            if (pageNumber > totalPages - 1) {
                return totalPages > 0 ? totalPages - 1 : 0;
            }
            return pageNumber;
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name editLot
         *
         * @description
         * Pops up a modal for users to edit lot for selected line item.
         *
         * @param {Object} lineItem line items to be edited.
         */
        vm.editLot = function(lineItem) {
            var oldLotCode = lineItem.lot.lotCode;
            var oldLotExpirationDate = lineItem.lot.expirationDate;
            editLotModalService.show(lineItem, vm.allItems, vm.addedLineItems).then(function() {
                $stateParams.displayItems = vm.displayItems;
                if (oldLotCode === lineItem.lot.lotCode
                    && oldLotExpirationDate !== lineItem.lot.expirationDate) {
                    vm.addedLineItems.forEach(function(item) {
                        if (item.lot && item.lot.lotCode === oldLotCode &&
                            oldLotExpirationDate === item.lot.expirationDate) {
                            item.lot.expirationDate = lineItem.lot.expirationDate;
                        }
                    });
                }
            });
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name canEditLot
         *
         * @description
         * Checks if user can edit lot.
         *
         * @param {Object} lineItem line item to edit
         */
        vm.canEditLot = function(lineItem) {
            return vm.hasPermissionToAddNewLot && lineItem.lot && lineItem.$isNewItem;
        };

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateExpirationDate
         *
         * @description
         * Validate if expirationDate is a future date.
         */
        function validateExpirationDate() {
            var currentDate = moment(new Date()).format('YYYY-MM-DD');

            if (vm.newLot.expirationDate && vm.newLot.expirationDate < currentDate) {
                vm.newLot.expirationDateInvalid = messageService.get('stockEditLotModal.expirationDateInvalid');
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name expirationDateChanged
         *
         * @description
         * Hides the error message if exists after changed expiration date.
         */
        function expirationDateChanged() {
            vm.newLot.expirationDateInvalid = undefined;
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name newLotCodeChanged
         *
         * @description
         * Hides the error message if exists after changed new lot code.
         */
        function newLotCodeChanged() {
            vm.newLot.lotCodeInvalid = undefined;
        }

        /**
         * @ngdoc method
         * @methodOf stock-adjustment-creation.controller:StockAdjustmentCreationController
         * @name validateLotCode
         *
         * @description
         * Validate if on line item list exists the same orderable with the same lot code
         */
        function validateLotCode(listItems, selectedItem) {
            if (selectedItem && selectedItem.$isNewItem) {
                listItems.forEach(function(lineItem) {
                    if (lineItem.orderable && lineItem.lot && selectedItem.lot &&
                        lineItem.orderable.productCode === selectedItem.orderable.productCode &&
                        selectedItem.lot.lotCode === lineItem.lot.lotCode &&
                        ((!lineItem.$isNewItem) || (lineItem.$isNewItem &&
                        selectedItem.lot.expirationDate !== lineItem.lot.expirationDate))) {
                        vm.newLot.lotCodeInvalid = messageService.get('stockEditLotModal.lotCodeInvalid');
                    }
                });
            }
        }

        // AO-804: Display product prices on Stock Issues, Adjustments and Receives Page
        function getProductPrice(lineItem) {
            if (!lineItem.orderable.programs) {
                return undefined;
            }
            var programOrderable = lineItem.orderable.programs.find(function(programOrderable) {
                return programOrderable.programId === program.id;
            });

            return programOrderable.pricePerPack;
        }

        function calculateTotalCost(items) {
            var sum = 0;
            if (items !== undefined) {
                items.forEach(function(lineItem) {
                    sum += lineItem.totalPrice;
                });
            }

            if (vm.totalCost !== sum) {
                vm.totalCost = sum;
            }
        }
        // AO-804: Ends here

        // AO-805: Allow users with proper rights to edit product prices
        function calculateTotalPrice(lineItem) {
            var lineItemTotalQuantity = vm.getLineItemTotalQuantity(lineItem);
            return lineItem.price && lineItem.quantity ? lineItem.price * lineItemTotalQuantity : 0;
        }

        function hasPermissionToEditProductPrices() {
            return permissionService.hasPermissionWithAnyProgramAndAnyFacility(
                authorizationService.getUser().user_id,
                {
                    right: ADMINISTRATION_RIGHTS.EDIT_PRODUCT_PRICE_STOCK_MANAGEMENT
                }
            )
                .then(function() {
                    return true;
                })
                .catch(function() {
                    return false;
                });
        }

        function getProductsWithPriceChanged(products) {
            return products.filter(function(product) {
                return product.price && product.price !== getProductPrice(product);
            });
        }

        function setProductPriceForProgram(lineItem, program) {
            var updatedLineItem = lineItem.orderable.programs.map(function(programOrderable) {
                if (programOrderable.programId === program.id) {
                    programOrderable.pricePerPack = parseFloat(lineItem.price);
                }
                return lineItem;
            });

            lineItem = updatedLineItem;
        }

        function updateProductPrice(product) {
            return new OrderableResource()
                .update(product);
        }
        // AO-805: Ends here

        onInit();
    }
})();