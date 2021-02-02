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

describe('HomeSystemNotificationsController', function() {

    beforeEach(function() {
        this.baseUrl = 'http://localhost/superset';

        module('openlmis-home', function($provide) {
            $provide.constant('SUPERSET_URL', this.baseUrl);
        });
        // ANGOLASUP-510: Create Leaderboard
        module('report');
        // ANGOLASUP-510: ends here

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            // ANGOLASUP-510: Create Leaderboard
            this.$q = $injector.get('$q');
            this.supersetOAuthService = $injector.get('supersetOAuthService');

            spyOn(this.supersetOAuthService, 'checkAuthorizationInSuperset')
                .andReturn(this.$q.resolve(this.isAuthorizedResponse));
            // ANGOLASUP-510: ends here
        });

        this.systemNotifications = [
            new this.SystemNotificationDataBuilder().build(),
            new this.SystemNotificationDataBuilder().build()
        ];

        this.rankingDashboard = {
            code: 'abc',
            url: 'efg'
        };

        this.vm = this.$controller('HomeSystemNotificationsController', {
            homePageSystemNotifications: this.systemNotifications,
            isOffline: false
        });

        // ANGOLASUP-510: Create Leaderboard
        this.isAuthorizedResponse = {
            isAuthorized: true
        };
        // ANGOLASUP-510: ends here

        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose system notifications', function() {
            expect(this.vm.homePageSystemNotifications).toEqual(this.systemNotifications);
        });

        // ANGOLASUP-510: Create Leaderboard
        it('should check authorization in Superset', function() {
            expect(this.supersetOAuthService.checkAuthorizationInSuperset).toHaveBeenCalled();
        });
        // ANGOLASUP-510: ends here
    });

});
