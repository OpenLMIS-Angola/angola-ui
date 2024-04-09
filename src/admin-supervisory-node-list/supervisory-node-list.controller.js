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
     * @name admin-supervisory-node-list.controller:SupervisoryNodeListController
     *
     * @description
     * Controller for managing supervisory node list screen.
     */
    angular
        .module('admin-supervisory-node-list')
        .controller('SupervisoryNodeListController', controller);

    controller.$inject = [
        '$state', '$stateParams', 'supervisoryNodes', 'geographicZones', 'facilitiesMap', 'supervisoryNodesMap',
        '$filter', 'TABLE_CONSTANTS'
    ];

    function controller($state, $stateParams, supervisoryNodes, geographicZones, facilitiesMap, supervisoryNodesMap,
                        $filter, TABLE_CONSTANTS) {

        var vm = this;

        vm.$onInit = onInit;
        vm.search = search;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name supervisoryNodes
         * @type {Array}
         *
         * @description
         * Contains filtered supervisory nodes.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name geographicZones
         * @type {Array}
         *
         * @description
         * Contains all geographic zones.
         */
        vm.geographicZones = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name supervisoryNodeName
         * @type {String}
         *
         * @description
         * Contains name param for searching supervisory nodes.
         */
        vm.supervisoryNodeName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name geographicZone
         * @type {String}
         *
         * @description
         * Contains geographic zone UUID param for searching supervisory nodes.
         */
        vm.geographicZone = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @type {Object}
         * @name facilitiesMap
         *
         * @description
         * Map where the key is the facility ID and value is the facility object.
         */
        vm.facilitiesMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @type {Object}
         * @name tableConfig
         *
         * @description
         * Holds table config for the supervisory list table
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SupervisoryNodeListController.
         */
        function onInit() {
            vm.supervisoryNodes = supervisoryNodes;
            vm.geographicZones = geographicZones;
            vm.supervisoryNodeName = $stateParams.name;
            vm.geographicZone = $stateParams.zoneId;
            vm.facilitiesMap = facilitiesMap;
            vm.supervisoryNodesMap = supervisoryNodesMap;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-list.controller:SupervisoryNodeListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.name = vm.supervisoryNodeName;
            stateParams.zoneId = vm.geographicZone;

            $state.go('openlmis.administration.supervisoryNodes', stateParams, {
                reload: true
            });
        }

        function getTableConfig() {
            return {
                caption: 'adminSupervisoryNodeList.noSupervisoryNodes',
                displayCaption: !vm.supervisoryNodes || vm.supervisoryNodes.length === 0,
                columns: [
                    {
                        header: 'adminSupervisoryNodeList.name',
                        propertyPath: 'name'
                    },
                    {
                        header: 'adminSupervisoryNodeList.code',
                        propertyPath: 'code'
                    },
                    {
                        header: 'adminSupervisoryNodeList.facility',
                        propertyPath: 'facility',
                        template: function(item) {
                            return item.facility ? vm.facilitiesMap[item.facility.id].name : '';
                        }
                    },
                    {
                        header: 'adminSupervisoryNodeList.childNodes',
                        propertyPath: 'childNodes.length'
                    },
                    {
                        header: 'adminSupervisoryNodeList.geographicZone',
                        propertyPath: 'facility',
                        template: function(item) {
                            return item.facility ? vm.facilitiesMap[item.facility.id].geographicZone.name : '';
                        }
                    },
                    {
                        header: 'adminSupervisoryNodeList.partnerNodes',
                        propertyPath: 'partnerNodes',
                        template: function(item) {
                            return item.partnerNodes.length ?
                                vm.supervisoryNodesMap[item.partnerNodes[0].id].name : '';
                        },
                        displayColumn: function(item) {
                            var length = item.partnerNodes.length;
                            return length === 0 || length === 1;
                        }
                    },
                    {
                        header: 'adminSupervisoryNodeList.partnerNodes',
                        propertyPath: 'partnerNodes',
                        template: function(item) {
                            return $filter('partnerNodesCount')(item.partnerNodes);
                        },
                        displayColumn: function(item) {
                            return item.partnerNodes.length > 1;
                        },
                        popover: {
                            title: 'adminSupervisoryNodeList.partnerNodes',
                            template: 'admin-supervisory-node-list/partner-nodes-popover.html'
                        }
                    }
                ],
                actions: {
                    header: 'adminSupervisoryNodeList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminSupervisoryNodeList.edit',
                            classes: 'primary',
                            redirectLink: function(item) {
                                return 'openlmis.administration.supervisoryNodes.edit({id:\'' + item.id + '\'})';
                            }
                        }
                    ]
                },
                data: vm.supervisoryNodes
            };
        }
    }
})();
