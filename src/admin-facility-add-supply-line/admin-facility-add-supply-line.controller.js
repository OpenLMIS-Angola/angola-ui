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
     * @name admin-facility-add-supply-line.controller:AddFacilitySupplyLineController
     *
     * @description
     * Controller for managing supply line add screen.
     */
    angular
        .module('admin-facility-add-supply-line')
        .controller('AddFacilitySupplyLineController', controller);

    controller.$inject = ['facilities', 'supervisoryNodes', 'programs', 'SupplyLineResource',
        '$state', 'confirmService', 'loadingModalService', 'notificationService', '$q', '$stateParams',
        'messageService', 'FacilityRepository', 'stateTrackerService'];

    function controller(facilities, supervisoryNodes, programs, SupplyLineResource,
                        $state, confirmService, loadingModalService, notificationService, $q, $stateParams,
                        messageService, FacilityRepository, stateTrackerService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.add = add;
        vm.cancelSupplyLine = cancelSupplyLine;

        vm.facilities = undefined;
        vm.supervisoryNodes = undefined;
        vm.programs = undefined;
        vm.supplyLine = {};
        vm.facility = undefined;

        function onInit() {
            vm.facilities = facilities;
            vm.supervisoryNodes = supervisoryNodes;
            vm.programs = programs;

            facilities.map(function(facility) {
                if (facility.id === $stateParams.facilityId) {
                    vm.supplyLine.supplyingFacility =  facility;
                }
            });
            supervisoryNodes.map(function(supervisoryNode) {
                if (supervisoryNode.id === $stateParams.supervisoryNodeId) {
                    vm.supplyLine.supervisoryNode = supervisoryNode;
                }
            });
        }

        function add() {
            new FacilityRepository().get(vm.supplyLine.supplyingFacility.id)
                .then(function(facility) {
                    vm.facility = facility;
                });

            return confirmService
                .confirm('adminSupplyLineAdd.update.confirm', 'adminSupplyLineAdd.update')
                .then(function() {
                    loadingModalService.open();
                    return new SupplyLineResource()
                        .create(vm.supplyLine, null);
                })
                .then(function() {
                    if (vm.facility) {
                        stateTrackerService.goToPreviousState();
                        addPrograms(vm.facility);
                    }
                })
                .then(function() {
                    notificationService.success('adminSupplyLineAdd.supplyLineUpdatedSuccessfully');
                })
                .catch(function(error) {
                    loadingModalService.close();
                    notificationService.error('adminSupplyLineAdd.failure');
                    return $q.reject(error);
                })
                .finally(function() {
                    loadingModalService.close();
                });
        }

        function cancelSupplyLine() {
            new FacilityRepository().get($stateParams.facilityId)
                .then(function(facility) {
                    vm.facility = facility;
                });

            stateTrackerService.goToPreviousState();
            addPrograms(vm.facility);
        }

        function addPrograms(response) {
            var confirmMessage = messageService.get('adminSupplyLineAdd.doYouWantToAddPrograms', {
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
    }
})();
