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

    angular
        .module('supplier-add')
        .controller('SupplierAddController', SupplierAddController);

    SupplierAddController.$inject = ['stateTrackerService'];

    /**
     * @ngdoc controller
     * @name supplier-add.controller:SupplierAddController
     *
     * @description
     * Controller for adding suppliers.
     */
    function SupplierAddController(stateTrackerService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveSupplier = saveSupplier;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc method
         * @methodOf supplier-add.controller:SupplierAddController
         * @name $onInit
         *
         * @description
         * Initialization method of the SupplierAddController.
         */
        function onInit() {
            console.log('onInit');
        }

        /**
         * @ngdoc method
         * @methodOf supplier-add.controller:SupplierAddController
         * @name saveSupplier
         *
         * @description
         * Saves the supplier and takes user back to the previous state.
         */
        function saveSupplier() {
            //TODO: Implement save supplier
            console.log('Saving...');
            stateTrackerService.goToPreviousState();
        }

    }
})();