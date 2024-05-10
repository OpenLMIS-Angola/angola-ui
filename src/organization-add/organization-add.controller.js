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
        .module('organization-add')
        .controller('OrganizationAddController', OrganizationAddController);

    OrganizationAddController.$inject = ['stateTrackerService'];

    /**
     * @ngdoc controller
     * @name organization-add.controller:OrganizationAddController
     *
     * @description
     * Controller for adding organizations.
     */
    function OrganizationAddController(stateTrackerService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveOrganization = saveOrganization;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc method
         * @methodOf organization-add.controller:OrganizationAddController
         * @name $onInit
         *
         * @description
         * Initialization method of the OrganizationAddController.
         */
        function onInit() {
            console.log('onInit');
        }

        /**
         * @ngdoc method
         * @methodOf organization-add.controller:OrganizationAddController
         * @name saveOrganization
         *
         * @description
         * Saves the organization and takes user back to the previous state.
         */
        function saveOrganization() {
            //TODO: Implement save organization
            console.log('Saving...');
            stateTrackerService.goToPreviousState();
        }

    }
})();
