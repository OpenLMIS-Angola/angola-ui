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
     * @name organization-list.controller:OrganizationListController
     *
     * @description
     * Controller for managing organizations list view.
     */

    angular
        .module('organization-list')
        .controller('OrganizationListController', controller);

    controller.$inject = ['$state', '$stateParams', 'organizationsData', 'TABLE_CONSTANTS'];

    function controller($state, $stateParams, organizationsData, TABLE_CONSTANTS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.onSearch = onSearch;
        vm.redirectToAddOrganization = redirectToAddOrganization;

        /**
         * @ngdoc property
         * @propertyOf organization-list.controller:OrganizationListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for organization list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf organization-list.controller:OrganizationListController
         * @name organizationName
         * @type {String}
         *
         * @description
         * Contains name param for searching organization.
         */
        vm.organizationName = undefined;

        /**
         * @ngdoc property
         * @propertyOf organization-list.controller:OrganizationListController
         * @name organizations
         * @type {Array}
         *
         * @description
         * Contains list of organizations.
         */
        vm.organizations = undefined;

        /**
         * @ngdoc method
         * @methodOf organization-list.controller:OrganizationListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrganizationListController.
         */
        function onInit() {
            vm.organizations = organizationsData;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf organization-list.controller:OrganizationListController
         * @name onSearch
         *
         * @description
         * Reloads page with new search parameters.
         */
        function onSearch() {
            var stateParams = angular.copy($stateParams);

            stateParams.name = vm.organizationName;

            $state.go($state.current, stateParams, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf organization-list.controller:OrganizationListController
         * @name redirectToAddOrganization
         *
         * @description
         * Redirects the user to the add organization page.
         */
        function redirectToAddOrganization() {
            $state.go('openlmis.administration.organizations.add');
        }

        /**
         * @ngdoc method
         * @methodOf organization-list.controller:OrganizationListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the organization list table.
         */
        function getTableConfig() {
            return {
                caption: 'organizationList.noOrganizations',
                displayCaption: !vm.organizations || vm.organizations.length === 0,
                isSelectable: false,
                //TODO: Adjust columns after BE is ready
                columns: [
                    {
                        header: 'organizationList.column.name',
                        propertyPath: 'name',
                        template: function(item) {
                            return item.name;
                        }
                    },
                    {
                        header: 'organizationList.column.code',
                        propertyPath: 'code',
                        template: function(item) {
                            return item.code;
                        }
                    },
                    {
                        header: 'organizationList.column.active',
                        propertyPath: 'isActive',
                        template: '<i ng-class="{\'icon-ok\': item.active}"></i>'
                    }
                ],
                actions: {
                    header: 'organizationList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.organizations.edit({id:\'' + item.id + '\'})';
                            },
                            text: 'organizationList.action.edit'
                        }
                    ]
                },
                data: vm.organizations
            };
        }
    }
})();
