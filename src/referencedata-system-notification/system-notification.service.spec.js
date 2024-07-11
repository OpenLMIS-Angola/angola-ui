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

describe('systemNotificationService', function() {
    beforeEach(function() {
        module('referencedata-system-notification');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.systemNotificationService = $injector.get('systemNotificationService');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.$rootScope = $injector.get('$rootScope');
            this.localStorageService = $injector.get('localStorageService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.localStorageKey = 'systemNotifications';

        this.systemNotifications = [
            new this.SystemNotificationDataBuilder().build(),
            new this.SystemNotificationDataBuilder().build()
        ];

        this.systemNotificationsPage = new this.PageDataBuilder()
            .withContent(this.systemNotifications)
            .build();

        spyOn(this.SystemNotificationResource.prototype, 'query')
            .andReturn(this.$q.resolve(this.systemNotificationsPage));

        spyOn(this.localStorageService, 'get');
        spyOn(this.localStorageService, 'remove');
        spyOn(this.localStorageService, 'add');
    });

    describe('getSystemNotifications', function() {

        it('should return list of active system notifications', function() {
            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.systemNotifications);
        });

        it('should fetch system notifications with correct params', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query).toHaveBeenCalledWith({
                isDisplayed: true,
                expand: 'author'
            });
        });

        it('should reject if fetching system notifications fails', function() {
            this.SystemNotificationResource.prototype.query.andReturn(this.$q.reject());

            var rejected;
            this.systemNotificationService.getSystemNotifications()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    describe('clearCachedSystemNotifications', function() {

        it('should clear cache', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(1);

            this.systemNotificationService.clearCachedSystemNotifications();
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.localStorageService.remove).toHaveBeenCalledWith(this.localStorageKey);
            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(2);
        });

    });
});