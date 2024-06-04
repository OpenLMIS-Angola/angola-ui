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
     * @name openlmis-unit-add.controller:openlmisUnitAddController      *
     * @description
     * Manages the openlmis-unit-add component
     */
    angular
        .module('openlmis-unit-add')
        .controller('openlmisUnitAddController', openlmisUnitAddController);

    openlmisUnitAddController.$inject = ['openlmisUnitAddService', 'stateTrackerService'];

    function openlmisUnitAddController(openlmisUnitAddService, stateTrackerService) {
        var $ctrl = this;
        $ctrl.newUnit = {
            name: undefined,
            description: undefined,
            displayOrder: undefined,
            factor: undefined
        };
        $ctrl.save = save;
        $ctrl.goToPreviousState = stateTrackerService.goToPreviousState;
        $ctrl.saveDisabled = saveDisabled;

        function saveDisabled() {
            return !$ctrl.newUnit.name ||
                !$ctrl.newUnit.factor ||
                !$ctrl.newUnit.displayOrder;
        }

        function save() {
            openlmisUnitAddService.save($ctrl.newUnit)
                .then(function() {
                    $ctrl.goToPreviousState();
                });
        }
    }
})();
