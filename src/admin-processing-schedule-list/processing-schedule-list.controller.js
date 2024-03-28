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
     * @name admin-processing-schedule-list.controller:ProcessingScheduleListController
     *
     * @description
     * Controller for managing processing schedule list screen.
     */
    angular
        .module('admin-processing-schedule-list')
        .controller('ProcessingScheduleListController', controller);

    controller.$inject = ['processingSchedules', 'TABLE_CONSTANTS'];

    function controller(processingSchedules, TABLE_CONSTANTS) {

        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-processing-schedule-list.controller:ProcessingScheduleListController
         * @name processingSchedules
         * @type {Array}
         *
         * @description
         * Contains page of processing schedules.
         */
        vm.processingSchedules = undefined;

        /**
         * @ngdoc property
         * @methodOf
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * holds processing list table config
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-processing-schedule-list.controller:ProcessingScheduleListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ProcessingScheduleListController.
         */
        function onInit() {
            vm.processingSchedules = processingSchedules;
            vm.tableConfig = getTableConfig();
        }

        function getTableConfig() {
            return {
                caption: 'adminProcessingScheduleList.noProcessingSchedules',
                displayCaption: !vm.processingSchedules || vm.processingSchedules.length === 0,
                columns: [
                    {
                        header: 'adminProcessingScheduleList.processingScheduleCode',
                        propertyPath: 'code'
                    },
                    {
                        header: 'adminProcessingScheduleList.processingScheduleName',
                        propertyPath: 'name'
                    }
                ],
                actions: {
                    header: 'adminProcessingScheduleList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminProcessingScheduleList.edit',
                            redirectLink: function(item) {
                                return 'openlmis.administration.processingSchedules.edit({id: ' + item.id + '})';
                            }
                        }
                    ]
                },
                data: vm.processingSchedules
            };
        }
    }
})();
