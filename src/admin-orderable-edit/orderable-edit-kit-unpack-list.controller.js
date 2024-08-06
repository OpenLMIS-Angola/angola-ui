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
     * @name admin-orderable-edit.controller:OrderableEditKitUnpackListController
     *
     * @description
     * Controller for managing orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditKitUnpackListController', controller);

    controller.$inject = [
        'selectProductsModalService', 'orderable', 'children', 'OrderableResource', 'orderablesMap',
        'FunctionDecorator', 'stateTrackerService'
    ];

    function controller(selectProductsModalService, orderable, children, OrderableResource, orderablesMap,
                        FunctionDecorator, stateTrackerService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToOrderableList = goToOrderableList;
        vm.addChild = addChild;
        vm.removeChild = removeChild;
        vm.saveOrderable = new FunctionDecorator()
            .decorateFunction(saveOrderable)
            .withSuccessNotification('adminOrderableEdit.kitUnpackListSavedSuccessfully')
            .withErrorNotification('adminOrderableEdit.failedToSaveKitUnpackList')
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditKitUnpackListController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.children = children;
            vm.orderablesMap = orderablesMap;
            vm.unitOfOrderables = orderable.units;
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name addChild
         *
         * @description
         * Method that displays a modal for selecting and adding a orderable to the UI
         */
        function addChild() {
            selectProducts({
                selections: vm.orderablesMap
            })
                .then(addToOrderablesMap)
                .then(updateChildrenList);
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name removeChild
         *
         * @description
         * Method that removes kit constituent from the kit orderable
         *
         * @param {Object} a single child or kit constituent to be removed
         */
        function removeChild(child) {
            if (vm.children.indexOf(child) > -1) {
                vm.children.splice(vm.children.indexOf(child), 1);
            }

            vm.orderable.children = vm.children;

            Object.keys(vm.orderablesMap).forEach(function(key) {
                if (key === child.orderable.id) {
                    delete vm.orderablesMap[child.orderable.id];
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name goToOrderableList
         *
         * @description
         * Redirects to orderable list screen.
         */
        function goToOrderableList() {
            stateTrackerService.goToPreviousState('openlmis.administration.orderables', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditKitUnpackListController
         * @name saveOrderable
         *
         * @description
         * Updates the orderable and return to the orderable list on success.
         */
        function saveOrderable() {
            console.log(vm.orderable);
            return new OrderableResource()
                .update(vm.orderable)
                .then(goToOrderableList);
        }

        function selectProducts(availableProducts) {
            return selectProductsModalService.show(availableProducts);
        }

        function mapToChild(orderable) {
            return {
                orderable: {
                    id: orderable.id
                },
                quantity: undefined,
                unitOfOrderableId: undefined
            };
        }

        function updateChildrenList(selectedOrderables) {
            var childrenMap = vm.children.reduce(function(childrenMap, child) {
                childrenMap[child.orderable.id] = child;
                return childrenMap;
            }, {});

            clearChildrenList();

            selectedOrderables.forEach(function(orderable) {
                vm.children.push(childrenMap[orderable.id] ? childrenMap[orderable.id] : mapToChild(orderable));
            });

            vm.orderable.children = vm.children;
        }

        function addToOrderablesMap(orderables) {
            vm.orderablesMap = orderables.reduce(function(orderablesMap, orderable) {
                orderablesMap[orderable.id] = orderable;
                return orderablesMap;
            }, {});

            return orderables;
        }

        function clearChildrenList() {
            while (children.length) {
                children.pop();
            }
        }

    }
})();
