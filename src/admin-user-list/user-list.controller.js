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
     * @name admin-user-list.controller:UsersListController
     *
     * @description
     * Controller for managing user list screen.
     */
    angular
        .module('admin-user-list')
        .controller('UserListController', controller);

    controller.$inject = ['$state', '$stateParams', 'users', 'confirmService', 'userPasswordModalFactory',
        'TABLE_CONSTANTS'];

    function controller($state, $stateParams, users, confirmService, userPasswordModalFactory, TABLE_CONSTANTS) {

        var vm = this;

        vm.resetUserPassword = resetUserPassword;
        vm.search = search;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name users
         * @type {Array}
         *
         * @description
         * Holds user list.
         */
        vm.users = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name firstName
         * @type {String}
         *
         * @description
         * Holds user first name filter value.
         */
        vm.firstName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name lastName
         * @type {String}
         *
         * @description
         * Holds user last name filter value.
         */
        vm.lastName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name email
         * @type {String}
         *
         * @description
         * Holds user email filter value.
         */
        vm.email = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name username
         * @type {String}
         *
         * @description
         * Holds username filter value.
         */
        vm.username = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name options
         * @type {Object}
         *
         * @description
         * Holds options for sorting user list.
         */
        vm.options = {
            'adminUserList.firstName': ['firstName,asc'],
            'adminUserList.lastName': ['lastName,asc'],
            'adminUserList.username': ['username,asc']
        };

        /**
         * @ngdoc property
         * @propertyOf admin-user-list.controller:UsersListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds configuration for users list table
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name onInit
         *
         * @description
         * Method that is executed on initiating UsersListController.
         */
        function onInit() {
            vm.users = users;
            vm.firstName = $stateParams.firstName;
            vm.lastName = $stateParams.lastName;
            vm.email = $stateParams.email;
            vm.username = $stateParams.username;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name resetUserPassword
         *
         * @description
         * Opens a modal for entering new user password.
         *
         * @param {String} username    the username of the user
         */
        function resetUserPassword(user) {
            userPasswordModalFactory.resetPassword(user).then(function() {
                $state.reload();
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-list.controller:UsersListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.lastName = vm.lastName;
            stateParams.firstName = vm.firstName;
            stateParams.email = vm.email;
            stateParams.username = vm.username;

            $state.go('openlmis.administration.users', stateParams, {
                reload: true
            });
        }

        function getTableConfig() {
            return {
                caption: 'adminUserList.users.error',
                displayCaption: !vm.users || vm.users.length === 0,
                columns: [
                    {
                        header: 'adminUserList.name',
                        propertyPath: 'firstName',
                        template: 'item.firstName item.lastName'
                    },
                    {
                        header: 'adminUserList.username',
                        propertyPath: 'username'
                    },
                    {
                        header: 'adminUserList.email',
                        propertyPath: 'email',
                        sortable: false
                    }
                ],
                actions: {
                    header: 'adminUserList.actions',
                    data: [
                        {
                            classes: 'primary',
                            text: 'adminUserList.edit',
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.users.form({id: \'' + item.id + '\'})';
                            }
                        },
                        {
                            text: 'adminUserList.roles',
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.users.roles.SUPERVISION({id: \'' + item.id +
                                    '\', page: \'0\'})';
                            }
                        },
                        {
                            text: 'adminUserList.resetPassword',
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                return vm.resetUserPassword(item);
                            }
                        }
                    ]
                },
                data: vm.users
            };
        }
    }

})();
