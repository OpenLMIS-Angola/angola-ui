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
     * @name admin-facility-type-list.controller:FacilityTypeListController
     *
     * @description
     * Controller for managing facility type list screen.
     */
    angular
        .module('admin-facility-type-list')
        .controller('FacilityTypeListController', controller);

    controller.$inject = ['facilityTypes', 'TABLE_CONSTANTS'];

    function controller(facilityTypes, TABLE_CONSTANTS) {

        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-type-list.controller:FacilityTypeListController
         * @name facilityTypes
         * @type {Array}
         *
         * @description
         * Contains page of facility types.
         */
        vm.facilityTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-type-list.controller:FacilityTypeListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds copnfig for facility types list.
         */
        vm.tableConfig = undefined;
        /**
         * @ngdoc method
         * @methodOf admin-facility-type-list.controller:FacilityTypeListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating FacilityTypeListController.
         */
        function onInit() {
            vm.facilityTypes = facilityTypes;
            vm.tableConfig = getTableConfig();
        }

        function getTableConfig() {
            return {
                caption: 'adminFacilityTypeList.noFacilityTypes',
                displayCaption: vm.facilityTypes.length === 0,
                columns: [
                    {
                        header: 'adminFacilityTypeList.facilityTypeCode',
                        propertyPath: 'code'
                    },
                    {
                        header: 'adminFacilityTypeList.facilityTypeName',
                        propertyPath: 'name'
                    }
                ],
                actions: {
                    header: 'adminFacilityTypeList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminFacilityTypeList.edit',
                            redirectLink: function(item) {
                                return 'openlmis.administration.facilityTypes.edit({id: \'' + item.id + '\'})';
                            }
                        }
                    ]
                },
                data: vm.facilityTypes
            };
        }
    }
})();
