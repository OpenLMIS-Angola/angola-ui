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
     * @name admin-facility-add.controller:FacilityAddController
     *
     * @description
     * Provides methods for Add Facility modal. Allows returning to previous states and saving
     * facility.
     */
    angular
        .module('admin-facility-add')
        .controller('FacilityAddController', FacilityAddController);

    FacilityAddController.$inject = [
        'facility', 'facilityTypes', 'geographicZones', 'facilityOperators', 'confirmService',
        'FacilityRepository', 'stateTrackerService', '$state', 'loadingModalService',
        'notificationService', 'messageService', 'requisitionGroupService', 'TABLE_CONSTANTS'
    ];

    function FacilityAddController(facility, facilityTypes, geographicZones, facilityOperators,
                                   confirmService, FacilityRepository, stateTrackerService,
                                   $state, loadingModalService, notificationService,
                                   messageService, requisitionGroupService, TABLE_CONSTANTS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.save = save;
        vm.addRequisitionGroup = addRequisitionGroup;
        vm.removeRequisitionGroup = removeRequisitionGroup;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        vm.requisitionGroups = undefined;
        vm.selectedRequisitionGroup = undefined;
        vm.selectedRequisitionGroups = [];
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-facility-add.controller:FacilityAddController
         * @name $onInit
         *
         * @description
         * Initialization method of the FacilityAddController.
         */
        function onInit() {
            vm.facility = angular.copy(facility);
            vm.facilityTypes = facilityTypes;
            vm.geographicZones = geographicZones;
            vm.facilityOperators = facilityOperators;
            vm.facility.active = facility.active !== false;
            vm.facility.enabled = facility.enabled !== false;

            requisitionGroupService.getAll().then(function(requisitionGroupList) {
                vm.requisitionGroups = requisitionGroupList;
                vm.tableConfig = getTableConfig();
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-add.controller:FacilityAddController
         * @name save
         *
         * @description
         * Saves the facility and takes user back to the previous state.
         */
        function save() {
            return doSave().then(function(response) {

                if (vm.selectedRequisitionGroups.length === 0) {
                    addPrograms(response);
                } else {
                    addSupervisoryNode(response);
                }
                loadingModalService.close();
            });
        }

        function doSave() {
            loadingModalService.open();
            return new FacilityRepository().create(vm.facility)
                .then(function(facility) {
                    notificationService.success('adminFacilityAdd.facilityHasBeenSaved');
                    stateTrackerService.goToPreviousState();

                    angular.forEach(vm.selectedRequisitionGroups, function(requisitionGroup) {
                        requisitionGroup.memberFacilities.push(facility);

                        requisitionGroupService.update(requisitionGroup);
                    });
                    return facility;
                })
                .catch(function() {
                    notificationService.error('adminFacilityAdd.failedToSaveFacility');
                    loadingModalService.close();
                });
        }

        function addRequisitionGroup() {
            if (vm.selectedRequisitionGroup) {
                vm.selectedRequisitionGroups.push(vm.selectedRequisitionGroup);

                var removeItem = vm.requisitionGroups.findIndex(function(requisitionGroup) {
                    return requisitionGroup.id === vm.selectedRequisitionGroup.id;
                });

                vm.requisitionGroups.splice(removeItem, 1);
            }
        }
        function removeRequisitionGroup(selectedRequisitionGroup) {
            vm.requisitionGroups.push(selectedRequisitionGroup);

            var removeItem = vm.selectedRequisitionGroups.findIndex(function(requisitionGroup) {
                return requisitionGroup.id === selectedRequisitionGroup.id;
            });
            vm.selectedRequisitionGroups.splice(removeItem, 1);
        }

        function addPrograms(response) {
            var confirmMessage = messageService.get('adminFacilityAdd.doYouWantToAddPrograms', {
                facility: response.name
            });

            confirmService.confirm(confirmMessage,
                'adminFacilityAdd.addPrograms',
                'adminFacilityAdd.cancel').then(function() {
                $state.go('openlmis.administration.facilities.facility.programs', {
                    facility: response
                });
            });
        }

        function addSupervisoryNode(response) {
            var confirmMessage = messageService.get('adminFacilityAdd.doYouWantToAddSupervisoryNode', {
                facility: response.name
            });

            confirmService.confirm(confirmMessage,
                'adminFacilityAdd.addSupervisoryNode',
                'adminFacilityAdd.cancel').then(function() {
                $state.go('openlmis.administration.facilities.facility.supervisoryNodes', {
                    facilityId: response.id
                });
            });
        }

        function getTableConfig() {
            return {
                caption: 'adminFacilityAdd.noRequisitionGroups',
                columns: [
                    {
                        header: 'adminFacilityAdd.name',
                        propertyPath: 'name'
                    }
                ],
                actions: {
                    header: 'adminFacilityList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                vm.removeRequisitionGroup(item);
                            },
                            text: 'adminFacilityAdd.removeRequisitionGroup'
                        }
                    ]
                },
                data: vm.selectedRequisitionGroups
            };
        }
    }

})();
