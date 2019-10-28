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
     * @name edit-lot-modal.controller:EditLotModalController
     *
     * @description
     * Controller for managing stock lot edit.
     */
    angular
        .module('stock-edit-lot-modal')
        .controller('EditLotModalController', controller);

    controller.$inject = ['selectedItem', 'modalDeferred', 'messageService', 'moment'];

    function controller(selectedItem, modalDeferred, messageService, moment) {

        var vm = this;
        vm.$onInit = onInit;
        vm.validateDate = validateDate;
        vm.confirm = confirm;

        function onInit() {
            vm.selectedItem = angular.copy(selectedItem);
            vm.newLot = vm.selectedItem.lot;
        }

        function confirm() {
            vm.newLot.expirationDateInvalid = undefined;
            validateDate();
            var noErrors = !vm.newLot.expirationDateInvalid;

            if (noErrors) {
                selectedItem.lot = vm.newLot;
                modalDeferred.resolve();
            }
        }

        function validateDate() {
            var currentDate = moment(new Date()).format('YYYY-MM-DD');

            if (vm.newLot.expirationDate && vm.newLot.expirationDate < currentDate) {
                vm.newLot.expirationDateInvalid = messageService.get('stockEditLotModal.expirationDateInvalid');
            }
        }
    }
})();