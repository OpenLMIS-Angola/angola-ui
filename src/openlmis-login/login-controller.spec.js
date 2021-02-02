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

describe('LoginController', function() {

    beforeEach(function() {

        module('openlmis-login', function($provide) {
            // Turn off AuthToken
            $provide.factory('accessTokenInterceptor', function() {
                return {};
            });
        });
        // ANGOLASUP-510: Create Leaderboard
        module('report');
        // ANGOLASUP-510: ends here

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.loginService = $injector.get('loginService');
            this.loadingModalService = $injector.get('loadingModalService');
            // ANGOLASUP-510: Create Leaderboard
            this.supersetOAuthService = $injector.get('supersetOAuthService');

            spyOn(this.supersetOAuthService, 'checkAuthorizationInSuperset')
                .andReturn(this.$q.resolve(this.isAuthorizedResponse));
            spyOn(this.supersetOAuthService, 'authorizeInSuperset').andReturn(this.$q.resolve());
            // ANGOLASUP-510: ends here
        });

        this.modalDeferred = this.$q.defer();

        this.vm = this.$controller('LoginController', {
            modalDeferred: this.modalDeferred
        });
        // ANGOLASUP-510: Create Leaderboard
        this.isAuthorizedResponse = {
            isAuthorized: true
        };
        this.isNotAuthorizedResponse = {
            isAuthorized: false,
            state: 'test_state'
        };
        // ANGOLASUP-510: ends here
    });

    describe('doLogin', function() {

        var username, validPassword, invalidPassword;

        beforeEach(function() {
            spyOn(this.loginService, 'login');
            spyOn(this.loadingModalService, 'open');
            spyOn(this.loadingModalService, 'close');

            username = 'john';
            validPassword = 'good-password';
            invalidPassword = 'bad-password';
        });

        it('should not login and show error when server returns error', function() {
            this.loginService.login.andReturn(this.$q.reject('error'));

            this.vm.username = username;
            this.vm.password = invalidPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loginService.login).toHaveBeenCalledWith(username, invalidPassword);
            expect(this.vm.loginError).toEqual('error');
        });

        it('should clear password on failed login attempt', function() {
            this.loginService.login.andReturn(this.$q.reject());

            this.vm.username = username;
            this.vm.password = invalidPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loginService.login).toHaveBeenCalledWith(username, invalidPassword);
            expect(this.vm.password).toBe(undefined);
        });

        it('should not clear password on successful login attempt', function() {
            this.loginService.login.andReturn(this.$q.resolve());

            this.vm.username = username;
            this.vm.password = validPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loginService.login).toHaveBeenCalledWith(username, validPassword);
            expect(this.vm.password).toBe(validPassword);
        });

        it('should open loading modal', function() {
            this.loginService.login.andReturn(this.$q.resolve());

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal after successful login', function() {
            this.loginService.login.andReturn(this.$q.resolve());

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        // ANGOLASUP-510: Create Leaderboard
        it('should check Superset authorization and not send authorize request after successful login', function() {
            this.loginService.login.andReturn(this.$q.resolve());
            this.supersetOAuthService.checkAuthorizationInSuperset
                .andReturn(this.$q.resolve(this.isAuthorizedResponse));

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.supersetOAuthService.checkAuthorizationInSuperset).toHaveBeenCalled();
            expect(this.supersetOAuthService.authorizeInSuperset).not.toHaveBeenCalled();
        });

        it('should check Superset authorization and send authorize request after successful login', function() {
            var success = false;
            this.$rootScope.$on('openlmis-auth.authorized-in-superset', function() {
                success = true;
            });

            this.loginService.login.andReturn(this.$q.resolve());
            this.supersetOAuthService.checkAuthorizationInSuperset
                .andReturn(this.$q.resolve(this.isNotAuthorizedResponse));

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.supersetOAuthService.checkAuthorizationInSuperset).toHaveBeenCalled();
            expect(this.supersetOAuthService.authorizeInSuperset).toHaveBeenCalled();
            expect(success).toBe(true);
        });

        it('should not check authorization in Superset after failed login', function() {
            var success = false;
            this.$rootScope.$on('openlmis-auth.authorized-in-superset', function() {
                success = true;
            });
            this.loginService.login.andReturn(this.$q.reject());

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.supersetOAuthService.checkAuthorizationInSuperset).not.toHaveBeenCalled();
            expect(this.supersetOAuthService.authorizeInSuperset).not.toHaveBeenCalled();
            expect(success).toBe(false);
        });
        // ANGOLASUP-510: ends here

        it('should close loading modal after failed login', function() {
            this.loginService.login.andReturn(this.$q.reject());

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('will resolve modalDeferred promise if login is successful', function() {
            var resolved;
            this.modalDeferred.promise.then(function() {
                resolved = true;
            });

            this.loginService.login.andReturn(this.$q.reject());
            this.vm.username = username;
            this.vm.password = invalidPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(resolved).not.toBe(true);

            this.loginService.login.andReturn(this.$q.resolve());
            this.vm.password = validPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(resolved).toBe(true);
        });

        it('should emit "openlmis-auth.login" event when successfully logged in', function() {
            var success = false;
            this.$rootScope.$on('openlmis-auth.login', function() {
                success = true;
            });

            this.loginService.login.andReturn(this.$q.resolve());
            this.vm.username = username;
            this.vm.password = validPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should not emit "openlmis-auth.login" event when login failed', function() {
            var success = true;
            this.$rootScope.$on('openlmis-auth.login', function() {
                success = false;
            });

            this.loginService.login.andReturn(this.$q.reject());
            this.vm.username = username;
            this.vm.password = invalidPassword;

            this.vm.doLogin();
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });
    });
});
