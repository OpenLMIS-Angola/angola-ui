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
     * @name report:SupersetOAuthLoginController
     * @description
     * Controller that drives the Superset OAuth login form.
     */
    angular
        .module('report')
        .controller('SupersetOAuthLoginController', SupersetOAuthLoginController);

    SupersetOAuthLoginController.$inject = [
        'MODAL_CANCELLED', 'modalDeferred', 'authorizationService', 'loadingModalService',
        '$sce', '$q', '$http', '$httpParamSerializer'
    ];

    function SupersetOAuthLoginController(MODAL_CANCELLED, modalDeferred, authorizationService, loadingModalService,
                                          $sce, $q, $http, $httpParamSerializer) {
        var vm = this;
        vm.$onInit = onInit;

        vm.cancel = cancel;
        vm.doLogin = doLogin;

        vm.show = false;
        vm.username = authorizationService.getUser().username;

        function onInit() {
            loadingModalService.open();
            checkAuthorizationInSuperset()
                .then(function(data) {
                    vm.supersetOAuthState = data.state;
                    if (data.isAuthorized === true) {
                        modalDeferred.resolve();
                    }
                })
                .catch(function() {
                    modalDeferred.reject('Superset is not available');
                })
                .finally(loadingModalService.close);
        }

        function cancel() {
            modalDeferred.reject(MODAL_CANCELLED);
        }

        function doLogin() {
            loadingModalService.open();

            sendOAuthRequest()
                .then(function() {
                    return approveSupersetIfNeeded();
                })
                .then(function() {
                    vm.loginError = '';
                    modalDeferred.resolve();
                })
                .finally(loadingModalService.close);
        }

        function checkAuthorizationInSuperset() {
            var deferred = $q.defer();

            var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
            var url = '${SUPERSET_URL}/oauth-init/openlmis?redirect_url=' + redirectUrl;
            var httpPromise = $http({
                method: 'GET',
                url: $sce.trustAsResourceUrl(url).toString(),
                withCredentials: true
            });
            httpPromise.then(function(response) {
                deferred.resolve(response.data);
            });
            httpPromise.catch(function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function sendOAuthRequest() {
            var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
            var url = '/api/oauth/authorize?response_type=code&client_id=superset'
                    + '&redirect_uri=' + redirectUrl
                    + '&scope=read+write&state=' + vm.supersetOAuthState;
            var httpPromise = $http({
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Credentials': 'false',
                    Authorization: authorizationHeader()
                },
                url: $sce.trustAsResourceUrl(url).toString(),
                withCredentials: true,
                ignoreAuthModule: true
            });
            httpPromise.catch(function() {
                vm.loginError = 'report.superset.oAuthLogin.invalidCredentialsOrOAuthRequest';
                return $q.reject();
            });
            return httpPromise;
        }

        function approveSupersetIfNeeded() {
            return checkAuthorizationInSuperset()
                .then(function(data) {
                    if (data.isAuthorized !== true) {
                        return approveSuperset();
                    }
                });
        }

        function approveSuperset() {
            var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
            var url = '/api/oauth/authorize?response_type=code&client_id=superset'
                    + '&redirect_uri=' + redirectUrl;
            var httpPromise = $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: authorizationHeader()
                },
                url: $sce.trustAsResourceUrl(url).toString(),
                data: $httpParamSerializer({
                    authorize: 'Authorize',
                    // eslint-disable-next-line camelcase
                    user_oauth_approval: 'true',
                    'scope.read': 'true',
                    'scope.write': 'true'
                }),
                withCredentials: true,
                ignoreAuthModule: true
            });
            httpPromise.catch(function() {
                vm.loginError = 'report.superset.oAuthLogin.unsuccessfulApprovingPermissions';
                return $q.reject();
            });
            return httpPromise;
        }

        function authorizationHeader() {
            var data = btoa(vm.username + ':' + vm.password);
            return 'Basic ' + data;
        }
    }
}());
