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
     * @name admin-orderable-edit.controller:OrderableEditProgramsController
     *
     * @description
     * Controller for managing orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditProgramsController', controller);

    controller.$inject = ['programOrderables', 'programsMap', 'canEdit', 'orderable', 'FunctionDecorator',
        'OrderableResource', '$state', 'messageService', 'confirmService', '$stateParams'];

    function controller(programOrderables, programsMap, canEdit, orderable, FunctionDecorator, OrderableResource,
                        $state, messageService, confirmService, $stateParams) {

        var vm = this;

        vm.$onInit = onInit;
        vm.addFacilityTypes = addFacilityTypes;
        vm.cancel = cancel;

        vm.removeProgramOrderable = new FunctionDecorator()
            .decorateFunction(removeProgramOrderable)
            .withSuccessNotification('adminOrderableEdit.programOrderableRemovedSuccessfully')
            .withErrorNotification('adminOrderableEdit.failedToRemoveProgramOrderable')
            .withConfirm('adminOrderableEdit.confirmToRemoveProgramOrderable')
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name programOrderables
         * @type {Object}
         *
         * @description
         * Contains programOrderables object. 
         */
        vm.programOrderables = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name programsMap
         * @type {Object}
         *
         * @description
         * Contains programsMap object. 
         */
        vm.programsMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name canEdit
         * @type {Object}
         *
         * @description
         * Contains canEdit object. 
         */
        vm.canEdit = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditProgramsController.
         */
        function onInit() {
            vm.programOrderables = programOrderables;
            vm.programsMap = programsMap;
            vm.canEdit = canEdit;
            vm.orderable = orderable;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name removeProgramOrderable
         *
         * @description
         * Remove the Orderable Program.
         */
        function removeProgramOrderable(program) {
            vm.orderable.programs.splice(vm.programOrderables.indexOf(program.program), 1);
            return new OrderableResource()
                .update(vm.orderable)
                .then(function() {
                    $state.reload();
                });
        }

        function addFacilityTypes() {
            var confirmMessage = messageService.get('orderableAddPrograms.doYouWantToAddFacilityTypes');

            confirmService.confirm(confirmMessage,
                'orderableAddPrograms.proceed',
                'orderableAddPrograms.cancel').then(function() {
                $state.go('openlmis.administration.orderables.ftap', {
                    id: $stateParams.id
                });
            });
        }

        function cancel() {
            $state.go('openlmis.administration.orderables');
        }
    }
})();
