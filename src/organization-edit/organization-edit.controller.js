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
        .module('organization-edit')
        .controller('OrganizationEditController', OrganizationEditController);

    OrganizationEditController.$inject = [
        'stateTrackerService',
        'confirmService',
        'organization',
        'organizationService',
        'notificationService',
        'loadingModalService'
    ];

    /**
     * @ngdoc controller
     * @name organization-edit.controller:OrganizationEditController
     *
     * @description
     * Controller for editing organizations.
     */
    function OrganizationEditController(
        stateTrackerService,
        confirmService,
        organization,
        organizationService,
        notificationService,
        loadingModalService
    ) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveOrganization = saveOrganization;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf organization-edit.controller:OrganizationEditController
         * @name editedOrganization
         * @type {Object}
         * 
         * @description
         * Organization that is being edited.
         */
        vm.editedOrganization = undefined;

        /**
         * @ngdoc method
         * @methodOf organization-edit.controller:OrganizationEditController
         * @name $onInit
         *
         * @description
         * Initialization method of the OrganizationEditController.
         */
        function onInit() {
            vm.editedOrganization = organization;
        }

        /**
         * @ngdoc method
         * @methodOf organization-edit.controller:OrganizationEditController
         * @name saveOrganization
         *
         * @description
         * Saves the organization and takes user back to the previous state.
         */
        function saveOrganization() {
            confirmService.confirm('organizationEdit.confirmationPrompt', 'organizationEdit.update')
                .then(function() {
                    loadingModalService.open();

                    organizationService.updateOrganization(vm.editedOrganization)
                        .then(function() {
                            notificationService.success('organizationEdit.organizationSaved');
                            loadingModalService.close();
                            stateTrackerService.goToPreviousState();
                        })
                        .catch(function() {
                            loadingModalService.close();
                            notificationService.error('organizationEdit.organizationSaveError');
                        });
                });
        }

    }

})();
