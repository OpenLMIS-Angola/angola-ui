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

    angular
        .module('report')
        .config(config);

    config.$inject = ['$stateProvider', 'SUPERSET_REPORTS'];

    function config($stateProvider, SUPERSET_REPORTS) {

        $stateProvider.state('openlmis.reports.list.superset', {
            abstract: true,
            url: '/superset',
            views: {
                // we need the main page to flex to the window size
                '@': {
                    templateUrl: 'openlmis-main-state/flex-page.html'
                }
            }
        });

        if (Object.keys(SUPERSET_REPORTS).length) {
            addReporingPage($stateProvider, SUPERSET_REPORTS.REPORTING_RATE_AND_TIMELINESS);
            addReporingPage($stateProvider, SUPERSET_REPORTS.STOCK_STATUS);
            addReporingPage($stateProvider, SUPERSET_REPORTS.STOCKOUTS);
            addReporingPage($stateProvider, SUPERSET_REPORTS.CONSUMPTION);
            addReporingPage($stateProvider, SUPERSET_REPORTS.ORDERS);
            addReporingPage($stateProvider, SUPERSET_REPORTS.ADJUSTMENTS);
            addReporingPage($stateProvider, SUPERSET_REPORTS.ADMINISTRATIVE);
        }
    }

    function addReporingPage($stateProvider, report) {
        $stateProvider.state('openlmis.reports.list.superset.' + report.code, {
            url: '/' + report.code,
            label: 'report.superset.' + report.code,
            controller: 'SupersetReportController',
            templateUrl: 'report/superset-report.html',
            controllerAs: 'vm',
            resolve: {
                reportUrl: function($sce) {
                    return $sce.trustAsResourceUrl(report.url);
                },
                reportCode: function() {
                    return report.code;
                },
                _: function($sce, $q, $http, $httpParamSerializer) {
                    return checkAuthorizationInSuperset($sce, $q, $http)
                        .then(function(data) {
                            if (data.isAuthorized !== true) {
                                return signInToOpenLmis($sce, $http, data)
                                    .then(function() {
                                        return approveSupersetIfNeeded($sce, $q, $http, $httpParamSerializer);
                                    });
                            }
                        });
                }
            }
        });
    }

    function approveSupersetIfNeeded($sce, $q, $http, $httpParamSerializer) {
        return checkAuthorizationInSuperset($sce, $q, $http, $httpParamSerializer)
            .then(function(data) {
                if (data.isAuthorized !== true) {
                    return approveSuperset($sce, $http, $httpParamSerializer);
                }
            });
    }

    function checkAuthorizationInSuperset($sce, $q, $http) {
        var deferred = $q.defer();

        var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
        var url = '${SUPERSET_URL}/oauth-init/openlmis?redirect_url=' + redirectUrl;
        var httpPromise = $http({
            method: 'GET',
            url: $sce.trustAsResourceUrl(url).toString(),
            withCredentials: true
        });
        httpPromise.then(function(x) {
            deferred.resolve(x.data);
        });
        httpPromise.catch(function() {
            deferred.reject();
        });

        return deferred.promise;
    }

    function signInToOpenLmis($sce, $http, data) {
        var state = data.state;
        var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
        var url = '/api/oauth/authorize?response_type=code&client_id=superset&redirect_uri=' + redirectUrl
            + '&scope=read+write&state=' + state;
        return $http({
            method: 'GET',
            headers: {
                'Access-Control-Allow-Credentials': 'true'
            },
            url: $sce.trustAsResourceUrl(url).toString(),
            withCredentials: true,
            ignoreAuthModule: true
        });
    }

    function approveSuperset($sce, $http, $httpParamSerializer) {
        var redirectUrl = '${SUPERSET_URL}/oauth-authorized/openlmis';
        var url = '/api/oauth/authorize?response_type=code&client_id=superset&redirect_uri=' + redirectUrl;
        return $http({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
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
    }

})();
