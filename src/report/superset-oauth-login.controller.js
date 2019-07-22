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
        'modalDeferred', 'authorizationService', 'loadingModalService',
        'supersetUrlFactory', '$q', '$http', '$httpParamSerializer',
        'MODAL_CANCELLED', 'CHECK_SUPERSET_AUTORIZATION_URL'
    ];

    function SupersetOAuthLoginController(modalDeferred, authorizationService, loadingModalService,
                                          supersetUrlFactory, $q, $http, $httpParamSerializer,
                                          MODAL_CANCELLED, CHECK_SUPERSET_AUTORIZATION_URL) {
        var vm = this;
        vm.$onInit = onInit;

        vm.cancel = cancel;
        vm.doLogin = doLogin;

        /**
         * @ngdoc property
         * @propertyOf report:SupersetOAuthLoginController
         * @name username
         * @type {String}
         *
         * @description
         * The username of the currently signed-in user.
         */
        vm.username = authorizationService.getUser().username;

        /**
         * @ngdoc method
         * @methodOf report:SupersetOAuthLoginController
         * @name $onInit
         *
         * @description
         * The method that is executed on initiating SupersetOAuthLoginController.
         * It checks whatever the user is already authorized in Superset.
         */
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

        /**
         * @ngdoc method
         * @methodOf report:SupersetOAuthLoginController
         * @name cancel
         *
         * @description
         * The method that is invoked when user clicks the cancel button. It rejects the modal.
         */
        function cancel() {
            modalDeferred.reject(MODAL_CANCELLED);
        }

        /**
         * @ngdoc method
         * @methodOf report:SupersetOAuthLoginController
         * @name doLogin
         *
         * @description
         * The method that is invoked when the user clicks the authorize button.
         * It starts the authorization process to Superset via OpenLMIS OAuth.
         */
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
            var httpPromise = $http({
                method: 'GET',
                url: CHECK_SUPERSET_AUTORIZATION_URL,
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
            var httpPromise = $http({
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Credentials': 'false',
                    Authorization: authorizationHeader()
                },
                url: supersetUrlFactory.buildSupersetOAuthRequestUrl(vm.supersetOAuthState),
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
            var httpPromise = $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: authorizationHeader()
                },
                url: supersetUrlFactory.buildApproveSupersetUrl(),
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
