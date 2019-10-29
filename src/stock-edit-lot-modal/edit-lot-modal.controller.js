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
     * @name stock-edit-lot-modal.controller:EditLotModalController
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
        vm.updateItem = updateItem;
        vm.expirationDateChanged = expirationDateChanged;

        /**
         * @ngdoc property
         * @propertyOf stock-edit-lot-modal.controller:EditLotModalController
         * @name selectedItem
         * @type {Object}
         *
         * @description
         * Selected item on form.
         */
        vm.selectedItem = undefined;

        /**
         * @ngdoc property
         * @propertyOf stock-edit-lot-modal.controller:EditLotModalController
         * @name newLot
         * @type {Object}
         *
         * @description
         * Holds new lot object.
         */
        vm.newLot = undefined;

        /**
         * @ngdoc method
         * @methodOf stock-edit-lot-modal.controller:EditLotModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the EditLotModalController.
         */
        function onInit() {
            vm.selectedItem = angular.copy(selectedItem);
            vm.newLot = vm.selectedItem.lot;
        }

        /**
         * @ngdoc method
         * @methodOf stock-edit-lot-modal.controller:EditLotModalController
         * @name updateItem
         *
         * @description
         * Update lot of item on form if there are no errors.
         */
        function updateItem() {
            vm.newLot.expirationDateInvalid = undefined;
            validateDate();
            var noErrors = !vm.newLot.expirationDateInvalid;

            if (noErrors) {
                selectedItem.lot = vm.newLot;
                selectedItem.displayLotMessage = vm.newLot.lotCode;
                modalDeferred.resolve();
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-edit-lot-modal.controller:EditLotModalController
         * @name validateDate
         *
         * @description
         * Validate if expirationDate is a future date.
         */
        function validateDate() {
            var currentDate = moment(new Date()).format('YYYY-MM-DD');

            if (vm.newLot.expirationDate && vm.newLot.expirationDate < currentDate) {
                vm.newLot.expirationDateInvalid = messageService.get('stockEditLotModal.expirationDateInvalid');
            }
        }

        /**
         * @ngdoc method
         * @methodOf stock-edit-lot-modal.controller:EditLotModalController
         * @name expirationDateChanged
         *
         * @description
         * Hides the error message if exists after changed expiration date.
         */
        function expirationDateChanged() {
            vm.newLot.expirationDateInvalid = undefined;
        }
    }
})();