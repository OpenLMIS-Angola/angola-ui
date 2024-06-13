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
     * @name admin-orderable-edit.controller:OrderableEditUnitAssignmentController
     *
     * @description
     * Controller for assigning units to the orderable
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditUnitAssignmentController', controller);

    controller.$inject = ['orderable', '$state', 'unitOfOrderableService', 'OrderableResource'];

    function controller(orderable, $state, unitOfOrderableService, OrderableResource) {

        var vm = this;
        vm.$onInit = onInit;
        vm.cancel = cancel;
        vm.availableUnits = [];
        vm.assignedUnits = [];
        vm.selectedUnit = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditUnitAssignmentController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditUnitAssignmentController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.assignedUnits = orderable.units ? orderable.units : [];
            unitOfOrderableService.getAll().then(function(response) {
                var assignedUnitsIds = vm.assignedUnits.map(function(unit) {
                    return unit.id;
                });
                if (assignedUnitsIds.length > 0) {
                    vm.availableUnits = response.content.filter(function(unit) {
                        return !assignedUnitsIds.includes(unit.id);
                    });
                } else {
                    vm.availableUnits = response.content;
                }
            });
        }

        vm.assignUnit = function() {
            if (!vm.selectedUnit) {
                return;
            }

            vm.assignedUnits.push(vm.selectedUnit);
            vm.availableUnits = vm.availableUnits.filter(function(unit) {
                return unit.id !== vm.selectedUnit.id;
            });
        };

        vm.removeUnit = function(removedUnit) {
            vm.assignedUnits = vm.assignedUnits.filter(function(unit) {
                return unit.id !== removedUnit.id;
            });
            vm.availableUnits.push(removedUnit);
        };

        vm.saveOrderableUnits = function() {
            vm.orderable.units = vm.assignedUnits;
            return saveOrderable();
        };

        function saveOrderable() {
            return new OrderableResource()
                .update(vm.orderable)
                .then(cancel);
        }

        function cancel() {
            $state.go('openlmis.administration.orderables', {}, {
                reload: true
            });
        }
    }
})();
