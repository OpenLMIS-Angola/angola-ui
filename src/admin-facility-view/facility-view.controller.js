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
     * @name admin-facility-view.controller:FacilityViewController
     *
     * @description
     * Controller for managing facility view screen.
     */
    angular
        .module('admin-facility-view')
        .controller('FacilityViewController', controller);

    controller.$inject = [
        '$q', '$state', 'facility', 'facilityTypes', 'geographicZones', 'facilityOperators',
        'programs', 'FacilityRepository', 'loadingModalService', 'notificationService',
        'tzPeriodService', 'messageService', 'confirmService', 'wards', 'wardService',
        'WARDS_CONSTANTS', 'currentUserService'
    ];

    function controller($q, $state, facility, facilityTypes, geographicZones, facilityOperators,
                        programs, FacilityRepository, loadingModalService, notificationService,
                        tzPeriodService, messageService, confirmService, wards, wardService,
                        WARDS_CONSTANTS, currentUserService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToFacilityList = goToFacilityList;
        vm.saveFacilityDetails = saveFacilityDetails;
        vm.saveFacilityWithPrograms = saveFacilityWithPrograms;
        vm.saveFacilityWards = saveFacilityWards;
        vm.addProgram = addProgram;
        vm.addWard = addWard;
        vm.deleteProgramAssociate = deleteProgramAssociate;
        vm.generateWardCode = generateWardCode;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facility
         * @type {Object}
         *
         * @description
         * Contains facility object.
         */
        vm.facility = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facilityTypes
         * @type {Array}
         *
         * @description
         * Contains all facility types.
         */
        vm.facilityTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name geographicZones
         * @type {Array}
         *
         * @description
         * Contains all geographic zones.
         */
        vm.geographicZones = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facilityOperators
         * @type {Array}
         *
         * @description
         * Contains all facility operators.
         */
        vm.facilityOperators = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name programs
         * @type {Array}
         *
         * @description
         * Contains all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name wards
         * @type {Array}
         *
         * @description
        * Contains all wards.
        */
        vm.wards = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name selectedTab
         * @type {String}
         *
         * @description
         * Contains currently selected tab.
         */
        vm.selectedTab = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name newWard
         * @type {Object}
         *
         * @description
         * Contains new ward object.
         */
        vm.newWard = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name addedWards
         * @type {Object[]}
         *
         * @description
         * Contains wards that are added through a form
         */
        vm.addedWards = [];

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name initialWards
         * @type {Object[]}
         *
         * @description
         * Contains wards that are pulled from API at the beggining to compare it later
         * with the ones changed in a form
         */
        vm.initialWards = [];

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name wardFacilityType
         * @type {Object}
         *
         * @description
         * Contains type passed to ward/service
         */
        vm.wardFacilityType = undefined;

        vm.currentUser = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating FacilityListController.
         */
        function onInit() {
            vm.originalFacilityName = facility.name;
            vm.facility = angular.copy(facility);
            vm.facilityWithPrograms = angular.copy(facility);
            vm.facilityTypes = facilityTypes;
            vm.geographicZones = geographicZones;
            vm.facilityOperators = facilityOperators;
            vm.programs = programs;
            vm.wards = wards;
            vm.initialWards = angular.copy(wards);
            vm.selectedTab = 0;
            vm.managedExternally = facility.isManagedExternally();
            vm.wardFacilityType = facilityTypes.find(function(type) {
                return type.code === WARDS_CONSTANTS.WARD_TYPE_CODE;
            });
            vm.newWard = getInitialNewWardValue();

            currentUserService.getUserInfo().then(function(user) {
                vm.currentUser = user;
            });

            if (!vm.facilityWithPrograms.supportedPrograms) {
                vm.facilityWithPrograms.supportedPrograms = [];
            }

            vm.facilityWithPrograms.supportedPrograms.filter(function(supportedProgram) {
                vm.programs = vm.programs.filter(function(program) {
                    return supportedProgram.id !== program.id;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name goToFacilityList
         *
         * @description
         * Redirects to facility list screen.
         */
        function goToFacilityList() {
            $state.go('openlmis.administration.facilities', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name saveFacilityDetails
         *
         * @description
         * Saves facility details and redirects to facility list screen.
         */
        function saveFacilityDetails() {
            doSave(vm.facility,
                'adminFacilityView.saveFacility.success',
                'adminFacilityView.saveFacility.fail');
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name saveFacilityWithPrograms
         *
         * @descriptioncurrentUserService
         * Saves facility with supported programs and redirects to facility list screen.
         */
        function saveFacilityWithPrograms() {
            doSave(vm.facilityWithPrograms,
                'adminFacilityView.saveFacility.success',
                'adminFacilityView.saveFacility.fail');
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name addProgram
         *
         * @description
         * Adds program to associated program list.
         */
        function addProgram() {
            var supportedProgram = angular.copy(vm.selectedProgram);

            vm.programs = vm.programs.filter(function(program) {
                return supportedProgram.id !== program.id;
            });

            supportedProgram.supportStartDate = vm.selectedStartDate;
            supportedProgram.supportActive = true;

            vm.selectedStartDate = null;
            vm.selectedProgram = null;

            vm.facilityWithPrograms.supportedPrograms.push(supportedProgram);

            return $q.when();
        }

        function doSave(facility, successMessage, errorMessage) {
            loadingModalService.open();
            return new FacilityRepository().update(facility)
                .then(function(facility) {
                    notificationService.success(successMessage);
                    goToFacilityList();
                    return $q.resolve(facility);
                })
                .catch(function() {
                    notificationService.error(errorMessage);
                    loadingModalService.close();
                    return $q.reject();
                });
        }

        function deleteProgramAssociate(program) {
            var confirmMessage = messageService.get('adminFacilityView.question', {
                period: program.name
            });

            confirmService.confirm(confirmMessage,
                'adminFacilityView.deleteAssociatedProgram').then(function() {
                var loadingPromise = loadingModalService.open();
                tzPeriodService
                    .deleteProgramAssociate(program.id, vm.facility.id)
                    .then(function() {
                        loadingPromise.then(function() {
                            notificationService.success('adminFacilityView.deleteAssociatedPrograms.success');
                        });
                        $state.reload('openlmis.administration.facility.view');
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('adminFacilityView.deleteAssociatedPrograms.fail');
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name addWard
         *
         * @description
         * Adds ward to associated wards list.
         */
        function addWard() {
            var newWard = angular.copy(vm.newWard);

            newWard.code = vm.generateWardCode(vm.facility.code);

            vm.addedWards.push(newWard);

            vm.newWard = getInitialNewWardValue();

            return $q.when();
        }

        function getInitialNewWardValue() {
            return {
                active: false,
                enabled: true,
                type: vm.wardFacilityType,
                geographicZone: vm.facility.geographicZone
            };
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name generateWardCode
         *
         * @description
         * Generates ward code based on the facility code.
         */
        function generateWardCode(facilityCode) {
            var serialNumber = padNumber((vm.wards.length + vm.addedWards.length) + 1, 4);

            return facilityCode + '.' + serialNumber;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name padNumber
         *
         * @description
         * Pads a number with leading zeros.
         */
        function padNumber(number, length) {
            var numberString = number.toString();
            var padding = length - numberString.length;

            return '0'.repeat(padding) + numberString;
        }

        function getChangedWards() {
            return vm.wards.filter(function(ward, index) {
                var initialWard = vm.initialWards[index];

                return ward.name !== initialWard.name ||
                    ward.description !== initialWard.description ||
                    ward.enabled !== initialWard.enabled;
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-view.controller:FacilityViewController
         * @name saveFacilityWards
         *
         * @description
         * Saves facility wards and redirects to facility list screen.
         */
        function saveFacilityWards() {
            var changedWards = getChangedWards();

            confirmService.confirm(
                'adminFacilityView.savingConfirmation',
                'adminFacilityView.save'
            ).then(function() {
                loadingModalService.open();

                var changedWardsPromisses = changedWards.map(function(ward) {
                    return wardService.updateFacilityWard(ward);
                });

                var addedWardsPromisses = vm.addedWards.map(function(ward) {
                    // assign user a role 9e2ee288-b77c-476e-9e15-a05d25c3dcda and a7993216-de2a-4031-b641-18621e3085cb
                    // for this facility
                    // var rolesIds = ['9e2ee288-b77c-476e-9e15-a05d25c3dcda', 'a7993216-de2a-4031-b641-18621e3085cb'];

                    // var additionalRoleAssignments = vm.facility.supportedPrograms.map(function(program) {
                    //     return [{
                    //         programId: program.id,
                    //         warehouseId: '',
                    //     }];
                    // })

                    // $q.all(rolesIdsPromisses).then(function(responses) {
                    //     console.log(responses);
                    //     // var roleAssignments = currentUser.roleAssignments;

                    //     // console.log(roleAssignments);
                    // });

                    return new FacilityRepository().create(ward);
                });

                $q.all(changedWardsPromisses.concat(addedWardsPromisses))
                    .then(function() {
                        notificationService.success('adminFacilityView.saveWards.success');
                        goToFacilityList();
                        return $q.resolve();
                    })
                    .catch(function() {
                        notificationService.error('adminFacilityView.saveWards.fail');
                        loadingModalService.close();
                        return $q.reject();
                    });
            });
        }
    }
})();
