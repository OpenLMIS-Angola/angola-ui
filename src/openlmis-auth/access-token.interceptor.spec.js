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

describe('accessTokenInterceptor', function() {

    beforeEach(function() {
        var context = this;
        module('openlmis-auth', function($httpProvider) {
            context.interceptors = $httpProvider.interceptors;
        });

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.openlmisUrlService = $injector.get('openlmisUrlService');
            this.authorizationService = $injector.get('authorizationService');
            this.accessTokenInterceptor = $injector.get('accessTokenInterceptor');
            this.accessTokenFactory = $injector.get('accessTokenFactory');
            this.alertService = $injector.get('alertService');
        });

        spyOn(this.accessTokenFactory, 'addAccessToken').andCallFake(function(url) {
            return url + '&access_token=SoMeAcCeSsToKeN';
        });
        spyOn(this.accessTokenFactory, 'authHeader').andReturn('Bearer SoMeAcCeSsToKeN');

        spyOn(this.openlmisUrlService, 'check');
        spyOn(this.authorizationService, 'isAuthenticated');
        spyOn(this.authorizationService, 'clearAccessToken');
        spyOn(this.authorizationService, 'clearUser');
        spyOn(this.authorizationService, 'clearRights');
        spyOn(this.alertService, 'error');
    });

    describe('request', function() {

        beforeEach(function() {
            this.openlmisUrlService.check.andReturn(true);
            this.authorizationService.isAuthenticated.andReturn(true);

            this.config = {
                url: 'some.url',
                headers: { }
            };
        });

        it('should be registered', function() {
            expect(this.interceptors.indexOf('accessTokenInterceptor')).toBeGreaterThan(-1);
        });

        it('should add token header', function() {
            var result = this.accessTokenInterceptor.request(this.config);

            expect(result.url).toEqual('some.url');
            expect(result.headers.Authorization).toEqual('Bearer SoMeAcCeSsToKeN');
        });

        it('should not add token if requesting html file', function() {
            this.config.url = 'some.html';

            var result = this.accessTokenInterceptor.request(this.config);

            expect(result.url).toEqual('some.html');
            expect(result.headers.Authorization).not.toBeDefined();
        });

        it('should not add token if user is not authenticated', function() {
            this.authorizationService.isAuthenticated.andReturn(false);

            var result = this.accessTokenInterceptor.request(this.config);

            expect(result.url).toEqual('some.url');
            expect(result.headers.Authorization).not.toBeDefined();
        });

        it('should check if user is authenticated', function() {
            this.accessTokenInterceptor.request(this.config);

            expect(this.authorizationService.isAuthenticated).toHaveBeenCalled();
        });

        it('should check if url should not be bypassed', function() {
            this.accessTokenInterceptor.request(this.config);

            expect(this.openlmisUrlService.check).toHaveBeenCalledWith('some.url');
        });

    });

    describe('responseError', function() {

        var response;

        beforeEach(function() {
            response = {};
            response.config = {};
        });

        describe('on 401 status and ignoreAuthModule flag', function() {
            beforeEach(function() {
                response.status = 401;
                response.config.ignoreAuthModule = true;

                this.accessTokenInterceptor.responseError(response);
            });

            it('should not clear access token', function() {
                expect(this.authorizationService.clearAccessToken).not.toHaveBeenCalled();
            });

            it('should not clear user', function() {
                expect(this.authorizationService.clearUser).not.toHaveBeenCalled();
            });

            it('should not clear rights', function() {
                expect(this.authorizationService.clearRights).not.toHaveBeenCalled();
            });
        });

        it('should not show error.authorization alert on 403 status and ignoreAuthModule flag', function() {
            response.status = 403;
            response.config.ignoreAuthModule = true;

            this.accessTokenInterceptor.responseError(response);

            expect(this.alertService.error)
                .not
                .toHaveBeenCalled();
        });

        describe('on 401 status', function() {

            beforeEach(function() {
                response.status = 401;

                this.accessTokenInterceptor.responseError(response);
            });

            it('should clear access token', function() {
                expect(this.authorizationService.clearAccessToken).toHaveBeenCalled();
            });

            it('should clear user', function() {
                expect(this.authorizationService.clearUser).toHaveBeenCalled();
            });

            it('should clear rights', function() {
                expect(this.authorizationService.clearRights).toHaveBeenCalled();
            });

        });

        it('should show error.authorization alert on 403 status', function() {
            response.status = 403;
            response.data = {
                message: 'Test message'
            };

            this.accessTokenInterceptor.responseError(response);

            expect(this.alertService.error)
                .toHaveBeenCalledWith('openlmisAuth.authorization.error', response.data.message);
        });

        it('should not call with message when message is null on 403', function() {
            response.status = 403;
            response.data = {
                message: null
            };

            this.accessTokenInterceptor.responseError(response);

            expect(this.alertService.error)
                .not
                .toHaveBeenCalledWith('openlmisAuth.authorization.error', response.data.message);

            expect(this.alertService.error)
                .toHaveBeenCalledWith('openlmisAuth.authorization.error');
        });

        it('should reject response', function() {
            spyOn(this.$q, 'reject').andCallThrough();

            this.accessTokenInterceptor.responseError(response);

            expect(this.$q.reject).toHaveBeenCalledWith(response);
        });

    });

});
