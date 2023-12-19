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
     * @name admin-orderable-program-edit.controller:OrderableProgramEditController
     *
     * @description
     * Controller for managing orderable program edit.
     */
    angular
        .module('admin-orderable-program-edit')
        .controller('OrderableProgramEditController', controller);

    controller.$inject = [
        '$state', 'programOrderable', 'orderableDisplayCategories', 'orderable',
        'canEdit', 'OrderableResource', 'filteredPrograms', 'FunctionDecorator', 'successNotificationKey',
        'errorNotificationKey', 'programsMap'
    ];

    function controller($state, programOrderable, orderableDisplayCategories, orderable,
                        canEdit, OrderableResource, filteredPrograms, FunctionDecorator, successNotificationKey,
                        errorNotificationKey, programsMap) {

        var vm = this;
        vm.$onInit = onInit;
        vm.saveProgramOrderable = new FunctionDecorator()
            .decorateFunction(saveProgramOrderable)
            .withSuccessNotification(successNotificationKey)
            .withErrorNotification(errorNotificationKey)
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name editMode
         * @type {boolean}
         *
         * @description
         * Indicates if facility type is already created.
         */
        vm.editMode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name filteredPrograms
         * @type {Array}
         *
         * @description
         * Contains list of all filtered Programs.
         */
        vm.filteredPrograms = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name programOrderable
         * @type {Object}
         *
         * @description
         * Current programOrderable.
         */
        vm.programOrderable = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name orderableDisplayCategories
         * @type {Array}
         *
         * @description
         * Current orderableDisplayCategories.
         */
        vm.orderableDisplayCategories = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name canEdit
         * @type {boolean}
         *
         * @description
         * Current canEdit.
         */
        vm.canEdit = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name programsMap
         * @type {Object}
         *
         * @description
         * Contains programsMap object. 
         */
        vm.programsMap = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableProgramEditController.
         */
        function onInit() {
            vm.filteredPrograms = filteredPrograms;
            vm.programOrderable = programOrderable;
            vm.orderableDisplayCategories = orderableDisplayCategories;
            vm.canEdit = canEdit;
            vm.orderable = orderable;
            vm.editMode = !!programOrderable;
            vm.programsMap = programsMap;
            vm.goToProgramOrderablePage = goToProgramOrderablePage;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name save
         *
         * @description
         * Saves the Orderable Program.
         */
        function saveProgramOrderable() {
            if (!vm.editMode) {
                vm.programOrderable.active = true;
                vm.orderable.programs.push(vm.programOrderable);
            }
            return new OrderableResource()
                .update(vm.orderable)
                .then(function() {
                    goToProgramOrderablePage();
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name goToAddFacilityPage
         *
         * @description
         * Takes the user to the add program orderables page.
         */
        function goToProgramOrderablePage() {
            $state.go('openlmis.administration.orderables.edit.programs', {}, {
                reload: true
            });
        }
    }
})();