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
     * @name requisition-approval.controller:RequisitionApprovalListController
     *
     * @description
     * Controller for approval list of requisitions.
     */

    angular
        .module('requisition-approval')
        .controller('RequisitionApprovalListController', controller);

    controller.$inject = [
        '$state', 'requisitions', '$stateParams', 'programs', 'selectedProgram', 'alertService', 'offlineService',
        'localStorageFactory', 'isBatchApproveScreenActive', 'requisitionService', '$filter', 'TABLE_CONSTANTS'
    ];

    function controller($state, requisitions, $stateParams, programs, selectedProgram, alertService, offlineService,
                        localStorageFactory, isBatchApproveScreenActive, requisitionService, $filter, TABLE_CONSTANTS) {

        var vm = this,
            offlineRequisitions = localStorageFactory('requisitions');

        vm.$onInit = onInit;
        vm.search = search;
        vm.openRnr = openRnr;
        vm.toggleSelectAll = toggleSelectAll;
        vm.viewSelectedRequisitions = viewSelectedRequisitions;
        vm.isFullRequisitionAvailable = isFullRequisitionAvailable;

        /**
         * @ngdoc property
         * @propertyOf requisition-approval.controller:RequisitionApprovalListController
         * @name requisitions
         * @type {Array}
         *
         * @description
         * Holds requisition that will be displayed on screen.
         */
        vm.requisitions = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-approval.controller:RequisitionApprovalListController
         * @name programs
         * @type {Array}
         *
         * @description
         * List of programs to which user has access based on his role/permissions.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-approval.controller:RequisitionApprovalListController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * The program selected by the user.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-approval.controller:RequisitionApprovalListController
         * @name offline
         * @type {Boolean}
         *
         * @description
         * Indicates if requisitions will be searched offline or online.
         */
        vm.offline = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-approval.controller:RequisitionApprovalListController
         * @name isBatchApproveScreenActive
         * @type {boolean}
         *
         * @description
         * Indicates if Batch Approve screen is active.
         */
        vm.isBatchApproveScreenActive = undefined;

        vm.options = {
            'requisitionApproval.newestAuthorized': ['emergency,desc', 'authorizedDate,desc'],
            'requisitionApproval.oldestAuthorized': ['emergency,desc', 'authorizedDate,asc']
        };

        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.requisitions = requisitions;
            vm.programs = programs;
            vm.selectedProgram = selectedProgram;
            vm.offline = $stateParams.offline === 'true' || offlineService.isOffline();
            vm.isBatchApproveScreenActive = isBatchApproveScreenActive;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name search
         *
         * @description
         * Searches requisitions by criteria selected in form.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.program = vm.selectedProgram ? vm.selectedProgram.id : null;
            stateParams.offline = vm.offline;

            $state.go('openlmis.requisitions.approvalList', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name openRnr
         *
         * @description
         * Redirects to requisition page with given requisition UUID.
         */
        function openRnr(requisition) {
            if (typeof requisition === 'object') {
                redirectRequisition(requisition);
            } else {
                requisitionService.get(requisition).then(function(requisitionDetails) {
                    redirectRequisition(requisitionDetails);
                });
            }
        }

        function redirectRequisition(requisition) {
            if (requisition.template.patientsTabEnabled) {
                $state.go('openlmis.requisitions.requisition.patients', {
                    rnr: requisition.id,
                    requisition: requisition
                });
            } else {
                $state.go('openlmis.requisitions.requisition.fullSupply', {
                    rnr: requisition.id,
                    requisition: requisition
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name toggleSelectAll
         *
         * @description
         * Responsible for marking/unmarking all requisitions as selected.
         *
         * @param {Boolean} selectAll Determines if all requisitions should be selected or not
         */
        function toggleSelectAll(selectAll) {
            angular.forEach(vm.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name viewSelectedRequisitions
         *
         * @description
         * Redirects to page for modifying all selected requisitions.
         */
        function viewSelectedRequisitions() {
            var selectedRequisitionIds = [],
                requisitionsFromOneProgram = true,
                requiredProgramId;

            angular.forEach(vm.requisitions, function(requisition) {
                if (requisition.$selected) {
                    if (requiredProgramId && requisition.program.id !== requiredProgramId) {
                        requisitionsFromOneProgram = false;
                    }
                    selectedRequisitionIds.push(requisition.id);
                    requiredProgramId = requisition.program.id;
                }
            });

            if (selectedRequisitionIds.length > 0 && requisitionsFromOneProgram) {
                $state.go('openlmis.requisitions.batchApproval', {
                    ids: selectedRequisitionIds.join(',')
                });
            } else if (requisitionsFromOneProgram) {
                alertService.error('requisitionApproval.selectAtLeastOneRnr');
            } else {
                alertService.error('requisitionApproval.selectRequisitionsFromTheSameProgram');
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-approval.controller:RequisitionApprovalListController
         * @name isFullRequisitionAvailable
         *
         * @description
         * Responsible for checking if local storage contains the given requisition.
         *
         * @param {Boolean} requisitionId Requisition that will be searched in storage
         */
        function isFullRequisitionAvailable(requisitionId) {
            var offlineRequisition = offlineRequisitions.search({
                id: requisitionId
            });
            return !vm.offline || vm.offline && offlineRequisition.length > 0;
        }

        function getTableConfig() {
            return {
                caption: 'requisitionApproval.noRnrPendingForApproval',
                displayCaption: !vm.requisitions.length,
                isSelectable: vm.isBatchApproveScreenActive,
                onSelectAll: function(selectAll) {
                    vm.toggleSelectAll(selectAll);
                },
                selectHeader: {
                    text: 'requisitionApproval.approve'
                },
                columns: [
                    {
                        header: 'requisitionApproval.program',
                        propertyPath: 'program.name'
                    },
                    {
                        header: 'requisitionApproval.facility',
                        propertyPath: 'facility.code',
                        template: function(item) {
                            return item.facility.code + ' - ' + item.facility.name;
                        }
                    },
                    {
                        header: 'requisitionApproval.period',
                        propertyPath: 'processingPeriod.name'
                    },
                    {
                        header: 'requisitionApproval.startDate',
                        propertyPath: 'processingPeriod.startDate',
                        template: function(item) {
                            return $filter('openlmisDate')(item.processingPeriod.startDate);
                        }
                    },
                    {
                        header: 'requisitionApproval.endDate',
                        propertyPath: 'processingPeriod.endDate',
                        template: function(item) {
                            return $filter('openlmisDate')(item.processingPeriod.endDate);
                        }
                    },
                    {
                        header: 'requisitionApproval.dateSubmitted',
                        propertyPath: 'statusChanges.SUBMITTED.changeDate',
                        template: function(item) {
                            return item.extraData.originalRequisition ?
                                $filter('message')('requisitionApproval.notApplicable') :
                                $filter('openlmisDate')(item.statusChanges.SUBMITTED.changeDate);
                        }
                    },
                    {
                        header: 'requisitionApproval.dateAuthorized',
                        propertyPath: 'statusChanges.AUTHORIZED.changeDate',
                        template: function(item) {
                            return item.extraData.originalRequisition ?
                                $filter('message')('requisitionApproval.notApplicable') :
                                $filter('openlmisDate')(item.statusChanges.AUTHORIZED.changeDate);
                        }
                    },
                    {
                        header: 'requisitionApproval.emergency',
                        propertyPath: 'emergency',
                        template: function(item) {
                            return item.emergency ? '<span class="icon-ok"></span>' : '';
                        }
                    },
                    {
                        header: 'requisitionApproval.offline',
                        propertyPath: '$availableOffline',
                        sortable: false,
                        template: function(item) {
                            return item.$availableOffline ? '<i class="icon-ok"></i>' : '';
                        }
                    }
                ],
                actions: {
                    header: 'requisitionApproval.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            text: 'requisitionApproval.viewRequisition',
                            classes: 'primary',
                            displayAction: function(item) {
                                return vm.isFullRequisitionAvailable(item.id);
                            },
                            onClick: function(item) {
                                vm.openRnr(item.id);
                            }
                        }
                    ]
                },
                data: vm.requisitions
            };
        }
    }

})();
