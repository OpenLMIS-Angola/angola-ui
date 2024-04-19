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
        'tzPeriodService', 'messageService', 'confirmService', 'wards', 'wardService'
    ];

    function controller($q, $state, facility, facilityTypes, geographicZones, facilityOperators,
                        programs, FacilityRepository, loadingModalService, notificationService,
                        tzPeriodService, messageService, confirmService, wards, wardService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToFacilityList = goToFacilityList;
        vm.saveFacilityDetails = saveFacilityDetails;
        vm.saveFacilityWithPrograms = saveFacilityWithPrograms;
        vm.saveFacilityWards = saveFacilityWards;
        vm.addProgram = addProgram;
        vm.addWard = addWard;
        vm.deleteProgramAssociate = deleteProgramAssociate;

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
         * Contains new ward object. By default, active true.
         */
        vm.newWard = {
            disabled: false
        };

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
            vm.selectedTab = 0;
            vm.managedExternally = facility.isManagedExternally();

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
         * @description
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
            newWard.facility = {
                id: vm.facility.id
            };

            return wardService.getAllWards().then(function(dbWards) {
                var wardExistsInDb = wardExists(dbWards.content, newWard);
                var wardExistsInLocalState = wardExists(vm.wards, newWard);

                if (wardExistsInDb || wardExistsInLocalState) {
                    return notifyAndReturn('adminFacilityView.wardExists');
                }

                vm.wards.push(newWard);
                vm.newWard = {
                    disabled: false
                };

                return $q.when();
            });

            function wardExists(wards, wardToCheck) {
                return wards.some(function(ward) {
                    return wardToCheck.code === ward.code;
                });
            }

            function notifyAndReturn(message) {
                notificationService.error(message);
                return $q.when();
            }
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
            var facilityWards = angular.copy(vm.wards);

            confirmService.confirm(
                'adminFacilityView.savingConfirmation',
                'adminFacilityView.save'
            ).then(function() {
                loadingModalService.open();
                return new wardService.saveFacilityWards(facilityWards)
                    .then(function(facilityWards) {
                        notificationService.success('adminFacilityView.saveWards.success');
                        goToFacilityList();
                        return $q.resolve(facilityWards);
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
