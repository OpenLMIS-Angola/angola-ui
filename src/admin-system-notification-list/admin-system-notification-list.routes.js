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

    angular.module('admin-system-notification-list').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.systemNotifications', {
            showInNavigation: true,
            label: 'adminSystemNotificationList.systemNotifications',
            url: '/systemNotifications?authorId&isDisplayed&page&size&sort',
            controller: 'SystemNotificationListController',
            templateUrl: 'admin-system-notification-list/system-notification-list.html',
            controllerAs: 'vm',
            accessRights: [ADMINISTRATION_RIGHTS.SYSTEM_NOTIFICATIONS_MANAGE],
            resolve: {
                systemNotifications: function(paginationService, SystemNotificationResource, $stateParams) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        return new SystemNotificationResource().query(stateParams);
                    });
                },
                users: function(systemNotifications, ReferenceDataUserResource) {
                    return new ReferenceDataUserResource().query()
                        .then(function(users) {
                            return users.content;
                        });
                },
                usersMap: function(users) {
                    return users.reduce(toUsersMap, {});
                }
            }
        });
    }

    function toUsersMap(usersMap, user) {
        usersMap[user.id] = user;
        return usersMap;
    }

})();