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
     * @name admin-facility-list.controller:FacilityListController
     *
     * @description
     * Controller for managing facility list screen.
     */
    angular
        .module('admin-facility-list')
        .controller('FacilityListController', controller);

    controller.$inject = [
        '$state', '$stateParams', 'facilities', 'geographicZones', 'TABLE_CONSTANTS', 'WARDS_CONSTANTS'
    ];

    function controller($state, $stateParams, facilities, geographicZones, TABLE_CONSTANTS, WARDS_CONSTANTS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.search = search;
        vm.goToAddFacilityPage = goToAddFacilityPage;
        vm.goToPrintFacilityPage = goToPrintFacilityPage;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-list.controller:FacilityListController
         * @name facilities
         * @type {Array}
         *
         * @description
         * Contains filtered facilities.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-list.controller:FacilityListController
         * @name geographicZones
         * @type {Array}
         *
         * @description
         * Contains all geographic zones.
         */
        vm.geographicZones = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-list.controller:FacilityListController
         * @name facilityName
         * @type {String}
         *
         * @description
         * Contains name param for searching facilities.
         */
        vm.facilityName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-list.controller:FacilityListController
         * @name geographicZone
         * @type {String}
         *
         * @description
         * Contains geographic zone UUID param for searching facilities.
         */
        vm.geographicZone = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating FacilityListController.
         */
        function onInit() {
            vm.facilities = facilities;
            vm.geographicZones = geographicZones;
            vm.facilityName = $stateParams.name;
            vm.geographicZone = $stateParams.zoneId;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.name = vm.facilityName;
            stateParams.zoneId = vm.geographicZone;

            $state.go('openlmis.administration.facilities', stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name goToAddFacilityPage
         *
         * @description
         * Takes the user to the add facility page.
         */
        function goToAddFacilityPage() {
            $state.go('openlmis.administration.facilities.facility.add');
        }

        // AO-744: Extend Admin Products and Facilities pages with print option
        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name goToPrintFacilityPage
         *
         * @description
         * Takes the user to the print facility page.
         */
        function goToPrintFacilityPage() {
            $state.go('openlmis.administration.facilities.facility.print');
        }
        // AO-744: ends here

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for facility list table.
         */
        function getTableConfig() {
            return {
                caption: 'adminFacilityList.noFacilities',
                displayCaption: !vm.facilities || vm.facilities.length === 0,
                columns: [
                    {
                        header: 'adminFacilityList.name',
                        propertyPath: 'name'
                    },
                    {
                        header: 'adminFacilityList.code',
                        propertyPath: 'code'
                    },
                    {
                        header: 'adminFacilityList.geographicZone',
                        propertyPath: 'geographicZone.name'
                    },
                    {
                        header: 'adminFacilityList.type',
                        propertyPath: 'type.name'
                    },
                    {
                        header: 'adminFacilityList.active',
                        propertyPath: 'active',
                        template: '<i ng-class="{\'icon-ok\': item.active}"></i>'
                    },
                    {
                        header: 'adminFacilityList.enabled',
                        propertyPath: 'enabled',
                        template: function(item) {
                            return '<i ng-class="{\'icon-ok\':' + item.enabled + '}"></i>';
                        }
                    }
                ],
                actions: {
                    header: 'adminFacilityList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.facilities.edit({id:\'' + item.id + '\'})';
                            },
                            text: 'adminFacilityList.edit',
                            displayAction: function(item) {
                                return item.type.code !== WARDS_CONSTANTS.WARD_TYPE_CODE;
                            }
                        }
                    ]
                },
                data: vm.facilities
            };
        }
    }

})();
