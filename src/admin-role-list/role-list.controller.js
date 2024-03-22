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
     * @name admin-role-list.controller:RoleListController
     *
     * @description
     * Controller for managing roles list screen.
     */
    angular
        .module('admin-role-list')
        .controller('RoleListController', controller);

    controller.$inject = ['roles', '$filter', 'TABLE_CONSTANTS'];

    function controller(roles, $filter, TABLE_CONSTANTS) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf admin-role-list.controller:RoleListController
         * @name roles
         * @type {Array}
         *
         * @description
         * Array of all roles.
         */
        vm.roles = undefined;

        vm.rolesPage = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-role-list.controller:RoleListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds config for roles table.
         */
        vm.tableConfig = undefined;

        vm.$onInit = onInit;

        function onInit() {
            vm.roles = roles;
            vm.tableConfig = getTableConfig();
        }

        function getTableConfig() {
            return {
                columns: [
                    {
                        header: 'adminRoleList.role',
                        propertyPath: 'name'
                    },
                    {
                        header: 'adminRoleList.roleType',
                        propertyPath: 'rights[0].type',
                        template: function(item) {
                            return $filter('roleType')(item.rights[0].type);
                        }
                    },
                    {
                        header: 'adminRoleList.description',
                        propertyPath: 'description'
                    },
                    {
                        header: 'adminRoleList.numberOfUsers',
                        propertyPath: 'count'
                    }
                ],
                actions: {
                    header: 'adminRoleList.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            text: 'adminRoleList.edit',
                            redirectLink: function(item) {
                                return '.createUpdate({roleId: ' + item.id + '})';
                            }
                        }
                    ]
                },
                data: vm.roles
            };
        }
    }

})();
