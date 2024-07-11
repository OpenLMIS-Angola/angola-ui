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
     * @ngdoc service
     * @name systemNotification.systemNotificationService
     *
     * @description
     * Stores system notifications locally.
     */
    angular
        .module('referencedata-system-notification')
        .service('systemNotificationService', systemNotificationService);

    systemNotificationService.$inject = [
        'localStorageFactory', 'localStorageService', '$q', 'SystemNotificationResource'
    ];

    function systemNotificationService(localStorageFactory, localStorageService, $q, SystemNotificationResource) {

        var cachedSystemNotifications = localStorageFactory('systemNotifications'),
            SYSTEM_NOTIFICATIONS = 'systemNotifications';

        this.getSystemNotifications = getSystemNotifications;
        this.clearCachedSystemNotifications = clearCachedSystemNotifications;

        /**
         * @ngdoc method
         * @methodOf systemNotification.systemNotificationService
         * @name getSystemNotifications
         *
         * @description
         * Retrieves notifications and saves them in the local storage.
         *
         * @return {Object}        Array of system notifications
         */
        function getSystemNotifications() {
            return new SystemNotificationResource().query({
                isDisplayed: true,
                expand: 'author'
            })
                .then(function(systemNotifications) {
                    return $q.resolve(systemNotifications.content);
                });

        }

        /**
         * @ngdoc method
         * @methodOf systemNotification.systemNotificationService
         * @name removeById
         *
         * @description
         * Remove all system  notifications from local storage.
         */
        function clearCachedSystemNotifications() {
            cachedSystemNotifications.remove(SYSTEM_NOTIFICATIONS);
            localStorageService.remove(SYSTEM_NOTIFICATIONS);
        }

    }
})();
