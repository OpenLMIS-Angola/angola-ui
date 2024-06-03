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
        '$q',
        'ValidDestinationResource',
        'ValidSourceResource',
        'stateTrackerService',
        'confirmService',
        'organizationService',
        'notificationService',
        'loadingModalService',
        'programs',
        'facilityTypes',
        'geoLevels'
    ];

    /**
     * @ngdoc controller
     * @name organization-add.controller:OrganizationAddController
     *
     * @description
     * Controller for adding organizations.
     */
    function OrganizationAddController(
        $q,
        ValidDestinationResource,
        ValidSourceResource,
        stateTrackerService,
        confirmService,
        organizationService,
        notificationService,
        loadingModalService,
        programs,
        facilityTypes,
        geoLevels
    ) {

        var vm = this;

        vm.$onInit = onInit;
        vm.onSubmit = onSubmit;
        vm.createOrganization = createOrganization;
        vm.createValidSource = createValidSource;
        vm.createValidDestination = createValidDestination;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {ValidSourceResource}
         * @name validSourceResource
         * 
         * @description
         * Resource for handling valid sources.
         */
        vm.validSourceResource = null;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {ValidDestinationResource}
         * @name validDestinationResource
         * 
         * @description
         * Resource for handling valid destinations.
         */
        vm.validDestinationResource = null;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @name createdOrganization
         * 
         * @description
         * Organization to be created.
         */
        vm.createdOrganization = null;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Array}
         * @name programs
         * 
         * @description
         * List of available programs.
         */
        vm.programs = [];

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Array}
         * @name facilityTypes
         * 
         * @description
         * List of available facility types.
         */
        vm.facilityTypes = [];

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Array}
         * @name geoLevels
         * 
         * @description
         * List of available geo levels.
         */
        vm.geoLevels = [];

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Object}
         * @name program
         * 
         * @description
         * Selected program.
         */
        vm.program = null;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Object}
         * @name facilityType
         * 
         * @description
         * Selected facility type.
         */
        vm.facilityType = null;

        /**
         * @ngdoc property
         * @propertyOf organization-add.controller:OrganizationAddController
         * @type {Object}
         * @name geoLevel
         * 
         * @description
         * Selected geo level.
         */
        vm.geoLevel = null;

        /**
         * @ngdoc method
         * @methodOf organization-add.controller:OrganizationAddController
         * @name onInit
         * 
         * @description
         * Initialization method of the OrganizationAddController.
         */
        function onInit() {
            vm.validSourceResource = new ValidSourceResource();
            vm.validDestinationResource = new ValidDestinationResource();
            vm.programs = programs;
            vm.facilityTypes = facilityTypes;
            vm.geoLevels = geoLevels;
        }

        /**
         * @ngdoc method
         * @methodOf organization-add.controller:OrganizationAddController
         * @name createOrganization
         *
         * @description
         * Creates the organization.
         */
        function createOrganization() {
            return organizationService.createNewOrganization(vm.createdOrganization)
                .then(function(organization) {
                    return organization;
                })
                .catch(function() {
                    notificationService.error('organizationAdd.organizationCreateError');
                });
        }

        function createPayload(refId) {
            var payload = {
                programId: vm.program.id,
                facilityTypeId: vm.facilityType.id,
                node: {
                    referenceId: refId
                }
            };

            if (vm.geoLevel) {
                payload.geoLevelAffinityId = vm.geoLevel.id;
            }

            return payload;
        }

        function createValidSource(refId) {
            var payload = createPayload(refId);

            return vm.validSourceResource.create(payload)
                .then(function(validSource) {
                    return validSource;
                })
                .catch(function() {
                    notificationService.error('organizationAdd.validSourceCreateError');
                });
        }

        function createValidDestination(refId) {
            var payload = createPayload(refId);

            return vm.validDestinationResource.create(payload)
                .then(function(validDestination) {
                    return validDestination;
                })
                .catch(function() {
                    notificationService.error('organizationAdd.validDestinationCreateError');
                });
        }

        function onSubmit() {
            confirmService.confirm('organizationAdd.confirmationPrompt', 'organizationAdd.create')
                .then(function() {
                    loadingModalService.open();

                    createOrganization()
                        .then(function(organization) {
                            $q.all([
                                createValidSource(organization.id),
                                createValidDestination(organization.id)
                            ])
                                .then(function() {
                                    notificationService.success('organizationAdd.organizationCreated');
                                    loadingModalService.close();
                                    stateTrackerService.goToPreviousState();
                                });
                        })
                        .catch(function() {
                            notificationService.error('organizationAdd.organizationCreateError');
                            loadingModalService.close();
                        });
                });
        }

    }
})();
