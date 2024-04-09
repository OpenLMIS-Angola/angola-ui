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
     * @name admin-facility-add-supervisory-node.AdminFacilitySupervisoryNodeAddController
     *
     * @description
     * Controller for managing supervisory node view screen.
     */
    angular
        .module('admin-facility-add-supervisory-node')
        .controller('AdminFacilitySupervisoryNodeAddController', controller);

    controller.$inject = ['$state', 'facilitiesMap', '$q', 'supervisoryNodesMap', 'supervisoryNodes',
        'AdminFacilityAddSupervisoryNodeService', 'loadingModalService', 'messageService', 'confirmService',
        '$stateParams', 'stateTrackerService', 'FacilityRepository', '$scope'];

    function controller($state, facilitiesMap, $q, supervisoryNodesMap, supervisoryNodes,
                        AdminFacilityAddSupervisoryNodeService, loadingModalService, messageService, confirmService,
                        $stateParams, stateTrackerService, FacilityRepository, $scope) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToSupervisoryNodeList = goToSupervisoryNodeList;
        vm.addChildNode = addChildNode;
        vm.removeChildNode = removeChildNode;
        vm.addPartnerNode = addPartnerNode;
        vm.removePartnerNode = removePartnerNode;
        vm.addSupervisoryNode = addSupervisoryNode;
        vm.cancelSupervisoryNode = cancelSupervisoryNode;

        vm.supervisoryNode = {
            childNodes: [],
            partnerNodes: []
        };

        vm.childNodes = undefined;
        vm.facilitiesMap = undefined;
        vm.supervisoryNodesMap = undefined;

        function onInit() {
            vm.facilitiesMap = facilitiesMap;
            vm.supervisoryNodesMap = supervisoryNodesMap;
            vm.childNodes = supervisoryNodes;
            vm.partnerNodes = supervisoryNodes;
            vm.parentNodes = supervisoryNodes;

            $scope.$watch('$stateParams', function() {
                if (facilitiesMap[$stateParams.facilityId]) {
                    vm.supervisoryNode.facility = facilitiesMap[$stateParams.facilityId];
                }
            }, true);

        }

        function goToSupervisoryNodeList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        function addChildNode() {
            if (vm.selectedChildNode) {
                vm.supervisoryNode.childNodes.push(vm.selectedChildNode);

                var removeItem = vm.childNodes.findIndex(function(childNode) {
                    return childNode.id === vm.selectedChildNode.id;
                });

                vm.childNodes.splice(removeItem, 1);
            }
        }

        function removeChildNode(selectedChildNode) {
            vm.childNodes.push(selectedChildNode);

            var removeItem = vm.supervisoryNode.childNodes.findIndex(function(childNode) {
                return childNode.id === selectedChildNode.id;
            });

            vm.supervisoryNode.childNodes.splice(removeItem, 1);
        }

        function addPartnerNode() {
            if (vm.selectedPartnerNode) {
                vm.supervisoryNode.partnerNodes.push(vm.selectedPartnerNode);

                var removeItem = vm.partnerNodes.findIndex(function(partnerNode) {
                    return partnerNode.id === vm.selectedPartnerNode.id;
                });

                vm.partnerNodes.splice(removeItem, 1);
            }
        }

        function removePartnerNode(selectedPartnerNode) {
            vm.partnerNodes.push(selectedPartnerNode);

            var removeItem = vm.supervisoryNode.partnerNodes.findIndex(function(partnerNode) {
                return partnerNode.id === selectedPartnerNode.id;
            });

            vm.supervisoryNode.partnerNodes.splice(removeItem, 1);
        }

        function addSupervisoryNode() {
            loadingModalService.open();
            AdminFacilityAddSupervisoryNodeService.create(vm.supervisoryNode)
                .then(function(response) {
                    stateTrackerService.goToPreviousState();
                    addSupplyLines(response);
                });
            loadingModalService.close();
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

        function addSupplyLines(response) {
            var confirmMessage = messageService.get('adminFacilitySupervisoryNodeAdd.doYouWantToAddSupplyLine');

            confirmService.confirm(confirmMessage,
                'adminFacilitySupervisoryNodeAdd.addSupplyLine',
                'adminFacilitySupervisoryNodeAdd.cancel').then(function() {
                $state.go('openlmis.administration.facilities.facility.supplyLines', {
                    facilityId: response.facility.id,
                    supervisoryNodeId: response.id
                });
            });
        }
        function cancelSupervisoryNode() {
            new FacilityRepository().get($stateParams.facilityId)
                .then(function(facility) {
                    vm.facility = facility;
                });

            stateTrackerService.goToPreviousState();
            addPrograms(vm.facility);
        }
    }
})();
