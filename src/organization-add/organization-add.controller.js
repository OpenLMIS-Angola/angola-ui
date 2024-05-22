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

    OrganizationAddController.$inject = [
        'stateTrackerService',
        'confirmService',
        'organizationService',
        'notificationService',
        'loadingModalService'
    ];

    /**
     * @ngdoc controller
     * @name organization-add.controller:OrganizationAddController
     *
     * @description
     * Controller for adding organizations.
     */
    function OrganizationAddController(
        stateTrackerService,
        confirmService,
        organizationService,
        notificationService,
        loadingModalService
    ) {

        var vm = this;

        vm.createOrganization = createOrganization;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @name createdOrganization
         * 
         * @description
         * Organization to be created.
         */
        vm.organization = null;

        /**
         * @ngdoc method
         * @methodOf organization-add.controller:OrganizationAddController
         * @name createOrganization
         *
         * @description
         * Creates the organization.
         */
        function createOrganization() {
            confirmService.confirm('organizationAdd.confirmationPrompt', 'organizationAdd.create')
                .then(function() {
                    loadingModalService.open();

                    organizationService.createNewOrganization(vm.createdOrganization)
                        .then(function() {
                            notificationService.success('organizationAdd.organizationCreated');
                            loadingModalService.close();
                            stateTrackerService.goToPreviousState();
                        })
                        .catch(function() {
                            loadingModalService.close();
                            notificationService.error('organizationAdd.organizationCreateError');
                        });
                });
        }

    }
})();
