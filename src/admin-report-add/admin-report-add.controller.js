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
     * @name admin-report-add.controller:AdminAddReportController
     *
     * @description
     * Allows user to add new reports
     */
    angular
        .module('admin-orderable-print')
        .controller('AdminAddReportController', AdminAddReportController);

    AdminAddReportController.$inject = [];

    function AdminAddReportController() {
        var vm = this;

        vm.goBack = goBack;
        vm.add = add;
        vm.validateField = validateField;
        vm.invalidFields = new Set();

        function add() {
            if (validateAddReport()) {
                // console.log('validated');
            }
        }

        function goBack() {
            window.history.back();
        }

        function validateAddReport() {
            var fieldsToValidate = ['name', 'URL', 'category', 'role'];
            fieldsToValidate.forEach(function(fieldName) {
                validateField(vm[fieldName], fieldName);
            });

            return vm.invalidFields.size === 0;
        }

        function isNotEmpty(value) {
            return !!value;
        }

        function validateField(value, fieldName) {
            var isValid = isNotEmpty(value);

            if (vm.invalidFields.has(fieldName) && isValid) {
                vm.invalidFields.delete(fieldName);
            } else if (!isValid) {
                vm.invalidFields.add(fieldName);
            }
        }
    }
})();
