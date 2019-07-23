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

describe('SupersetOAuthLoginController', function() {

    var vm, $controller, $q, $httpBackend, modalDeferred,
        supersetUrlFactory, authorizationService, loadingModalService,
        CHECK_SUPERSET_AUTORIZATION_URL, MODAL_CANCELLED,
        user, isAuthorizedResponse, isNotAuthorizedResponse;

    beforeEach(function() {
        module('report');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');

            supersetUrlFactory = $injector.get('supersetUrlFactory');
            authorizationService = $injector.get('authorizationService');
            loadingModalService = $injector.get('loadingModalService');

            CHECK_SUPERSET_AUTORIZATION_URL = $injector.get('CHECK_SUPERSET_AUTORIZATION_URL');
            MODAL_CANCELLED = $injector.get('MODAL_CANCELLED');

            var UserDataBuilder = $injector.get('UserDataBuilder');
            user = new UserDataBuilder().build();

            spyOn(authorizationService, 'getUser').andReturn(user);
            spyOn(loadingModalService, 'open');
            spyOn(loadingModalService, 'close');
        });

        modalDeferred = $q.defer();
        isAuthorizedResponse = {
            isAuthorized: true
        };
        isNotAuthorizedResponse = {
            isAuthorized: false,
            state: 'test_state'
        };

        spyOn(modalDeferred, 'resolve');
        spyOn(modalDeferred, 'reject');

        vm = $controller('SupersetOAuthLoginController', {
            modalDeferred: modalDeferred
        });
    });

    describe('onInit', function() {

        it('should expose cancel method', function() {
            vm.$onInit();

            expect(angular.isFunction(vm.cancel)).toBe(true);
        });

        it('should expose doLogin method', function() {
            vm.$onInit();

            expect(angular.isFunction(vm.doLogin)).toBe(true);
        });

        it('should expose username', function() {
            vm.$onInit();

            expect(vm.username).toEqual(user.username);
        });

        it('should open loading modal', function() {
            vm.$onInit();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should skip modal if the user is already authorized', function() {
            $httpBackend.expectGET(CHECK_SUPERSET_AUTORIZATION_URL)
                .respond(200, isAuthorizedResponse);

            vm.$onInit();
            $httpBackend.flush();

            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

        it('should not skip modal and set state if the user is not authorized', function() {
            $httpBackend.whenGET(CHECK_SUPERSET_AUTORIZATION_URL)
                .respond(200, isNotAuthorizedResponse);

            vm.$onInit();
            $httpBackend.flush();

            expect(vm.supersetOAuthState).toEqual(isNotAuthorizedResponse.state);
            expect(modalDeferred.resolve).not.toHaveBeenCalled();
            expect(modalDeferred.reject).not.toHaveBeenCalled();
        });
    });

    describe('cancel', function() {

        beforeEach(function() {
            vm.$onInit();
            vm.cancel();
        });

        it('should reject modal with cancelled status', function() {
            expect(modalDeferred.reject).toHaveBeenCalledWith(MODAL_CANCELLED);
        });
    });

    describe('doLogin', function() {

        var checkAuthorizationEndpointMock;

        beforeEach(function() {
            checkAuthorizationEndpointMock = $httpBackend
                .whenGET(CHECK_SUPERSET_AUTORIZATION_URL)
                .respond(200, isNotAuthorizedResponse);

            vm.$onInit();
            $httpBackend.flush();
        });

        it('should open loading modal', function() {
            vm.doLogin();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal after processing', function() {
            vm.doLogin();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should send OAuth request with authorization header to OpenLMIS', function() {
            var state = isNotAuthorizedResponse.state;
            var oauthRequestUrl = supersetUrlFactory.buildSupersetOAuthRequestUrl(state);

            $httpBackend.expectGET(oauthRequestUrl, function(headers) {
                var authorizationHeader = headers['Authorization'];
                return isString(headers['Authorization']) && authorizationHeader.startsWith('Basic');
            });

            vm.doLogin();
        });

        it('should check whatever the user is already approved after OAuth request', function() {
            var state = isNotAuthorizedResponse.state;
            var oauthRequestUrl = supersetUrlFactory.buildSupersetOAuthRequestUrl(state);

            $httpBackend.whenGET(oauthRequestUrl).respond(200);
            $httpBackend.expectGET(CHECK_SUPERSET_AUTORIZATION_URL);

            vm.doLogin();
            $httpBackend.flush();
        });

        it('should not approve OAuth request if the application is already approved', function() {
            var state = isNotAuthorizedResponse.state;
            var oauthRequestUrl = supersetUrlFactory.buildSupersetOAuthRequestUrl(state);
            var approveOAuthRequestUrl = supersetUrlFactory.buildApproveSupersetUrl();
            var forbiddenCallTriggered = false;

            $httpBackend.whenGET(oauthRequestUrl).respond(200);
            checkAuthorizationEndpointMock.respond(200, isAuthorizedResponse);
            $httpBackend.whenPOST(approveOAuthRequestUrl).respond(function() {
                forbiddenCallTriggered = true;
                return [400, ''];
            });

            vm.doLogin();
            $httpBackend.flush();

            expect(forbiddenCallTriggered).toBe(false);
            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

        it('should send proper approve OAuth request if the application is not approved', function() {
            var state = isNotAuthorizedResponse.state;
            var oauthRequestUrl = supersetUrlFactory.buildSupersetOAuthRequestUrl(state);
            var approveOAuthRequestUrl = supersetUrlFactory.buildApproveSupersetUrl();

            $httpBackend.whenGET(oauthRequestUrl).respond(200);
            checkAuthorizationEndpointMock.respond(200, isNotAuthorizedResponse);
            $httpBackend.expectPOST(approveOAuthRequestUrl,
                'authorize=Authorize&scope.read=true&scope.write=true&user_oauth_approval=true',
                function(headers) {
                    var authorizationHeader = headers['Authorization'];
                    return isString(headers['Authorization']) && authorizationHeader.startsWith('Basic');
                });

            vm.doLogin();
            $httpBackend.flush();
        });

        it('should resolve the modal after approving', function() {
            var state = isNotAuthorizedResponse.state;
            var oauthRequestUrl = supersetUrlFactory.buildSupersetOAuthRequestUrl(state);
            var approveOAuthRequestUrl = supersetUrlFactory.buildApproveSupersetUrl();

            $httpBackend.whenGET(oauthRequestUrl).respond(200);
            checkAuthorizationEndpointMock.respond(200, isNotAuthorizedResponse);
            $httpBackend.whenPOST(approveOAuthRequestUrl).respond(200);

            vm.doLogin();
            $httpBackend.flush();

            expect(modalDeferred.resolve).toHaveBeenCalled();
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    function isString(value) {
        return value && (typeof value === 'string' || value instanceof String);
    }
});
