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
     * @name admin-requisition-group-edit.controller:RequisitionGroupEditController
     *
     * @description
     * Exposes method for creating/updating requisitionGroup to the modal view.
     */
    angular
        .module('admin-requisition-group-edit')
        .controller('RequisitionGroupEditController', controller);

    controller.$inject = ['$q', '$state', '$stateParams',
        'requisitionGroup', 'facilities', 'facilitiesMap',
        'programs', 'supervisoryNodes',
        'RequisitionGroup', 'requisitionGroupService', 'stateTrackerService',
        'loadingModalService', 'notificationService', 'facilityService'];

    function controller($q, $state, $stateParams,
                        requisitionGroup, facilities, facilitiesMap,
                        programs, supervisoryNodes,
                        RequisitionGroup, requisitionGroupService, stateTrackerService,
                        loadingModalService, notificationService, facilityService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addFacility = addFacility;
        vm.removeFacility = removeFacility;
        vm.save = save;
        vm.onCancel = onCancel;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {RequisitionGroup}
         * @name requisitionGroup
         *
         * @description
         * RequisitionGroup that is being created.
         */
        vm.requisitionGroup = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name facilities
         *
         * @description
         * The list of facilities available in the system.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Object}
         * @name facilitiesMap
         *
         * @description
         * The map of facilities by ids.
         */
        vm.facilitiesMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name supervisoryNodes
         *
         * @description
         * The list of supervisoryNodes available in the system.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name programs
         *
         * @description
         * The list of programs available in the system.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-view.controller:RequisitionGroupViewController
         * @name selectedTab
         * @type {Number}
         *
         * @description
         * Contains number of currently selected tab.
         */
        vm.selectedTab = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name $onInit
         *
         * @description
         * Initialization method of the RequisitionGroupEditController.
         */
        function onInit() {
            vm.facilitiesMap = facilitiesMap;
            vm.requisitionGroup = requisitionGroup;
            vm.facilities = facilities;
            vm.supervisoryNodes = supervisoryNodes;
            vm.programs = programs;
            vm.selectedTab = $stateParams.tab ? parseInt($stateParams.tab) : 0;
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name addFacility
         *
         * @description
         * Adds valid requisitionGroup facility.
         *
         * @return {Promise} the promise resolving to the added facility.
         */
        function addFacility() {
            return facilityService.get(vm.selectedFacility.id)
                .then(function(facility) {
                    return vm.requisitionGroup.addFacility(facility);
                })
                .then(function() {
                    vm.selectedFacility = undefined;
                })
                .catch(function(error) {
                    notificationService.error(error);
                    loadingModalService.close();
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name removeFacility
         *
         * @description
         * Remove requisitionGroup associated facility.
         *
         * @return {Promise} the promise resolving to the removed facility.
         */
        function removeFacility(facility) {
            return vm.requisitionGroup.removeFacility(facility)
                .then(function() {
                    vm.selectedFacility = undefined;
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name save
         *
         * @description
         * Saves the requisitionGroup and takes user back to the previous state.
         */
        function save() {
            loadingModalService.open();

            var result;
            if (vm.requisitionGroup.id) {
                result = requisitionGroupService.update(vm.requisitionGroup);
            }
            return result.then(function(requisitionGroup) {
                notificationService.success('adminRequisitionGroupEdit.requisitionGroupSavedSuccessfully');
                stateTrackerService.goToPreviousState();
                return requisitionGroup;
            }).catch(function() {
                notificationService.error('adminRequisitionGroupEdit.requisitionGroupFailedToSave');
                loadingModalService.close();
            });
        }

        function onCancel() {
            $state.go('openlmis.administration.requisitionGroupList');
        }

    }
})();