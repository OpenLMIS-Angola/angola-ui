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
     * @name home-system-notifications.controller:HomeSystemNotificationsController
     *
     * @description
     * Exposes data to the system notifications view on Home Page.
     */
    angular
        .module('openlmis-home')
        .controller('HomeSystemNotificationsController', controller);

    controller.$inject = ['homePageSystemNotifications',
        // ANGOLASUP-601: Leaderboards deactivated temporarily
        // ,'SUPERSET_URL', '$sce',
        // 'supersetOAuthService', '$rootScope', '$state'
        // ANGOLASUP-601: ends here
        'offlineService'];

    function controller(homePageSystemNotifications,
        // ANGOLASUP-601: Leaderboards deactivated temporarily
        // , SUPERSET_URL, $sce, supersetOAuthService, $rootScope, $state
                        offlineService) {
        // ANGOLASUP-601: ends here
        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf home-system-notifications.controller:HomeSystemNotificationsController
         * @type {Object}
         * @name homePageSystemNotifications
         *
         * @description
         * System notifications which will be displayed to users.
         */
        vm.homePageSystemNotifications = undefined;

        /**
         * @ngdoc property
         * @propertyOf home-system-notifications.controller:HomeSystemNotificationsController
         * @type {boolean}
         * @name isOffline
         *
         * @description
         * Indicates offline connection.
         */
        vm.isOffline = undefined;

        // ANGOLASUP-510: Create Leaderboard
        /**
         * @ngdoc property
         * @propertyOf home-system-notifications.controller:HomeSystemNotificationsController
         * @type {string}
         * @name dashboardMostActive
         *
         * @description
         * The most active ranking dashboard url.
         */
        // ANGOLASUP-601: Leaderboards deactivated temporarily
        // vm.dashboardMostActive = undefined;

        /**
         * @ngdoc property
         * @propertyOf home-system-notifications.controller:HomeSystemNotificationsController
         * @type {string}
         * @name dashboardLeastActive
         *
         * @description
         * Least active ranking dashboard url.
         */
        // vm.dashboardLeastActive = undefined;

        /**
         * @ngdoc property
         * @propertyOf home-system-notifications.controller:HomeSystemNotificationsController
         * @name isAuthorized
         * @type {boolean}
         *
         * @description
         * Indicates if the controller is ready for displaying the Superset iframe.
         */
        // vm.isAuthorized = false;
        // ANGOLASUP-601: ends here
        // ANGOLASUP-510: ends here

        /**
         * @ngdoc method
         * @methodOf home-system-notifications.controller:HomeSystemNotificationsController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating HomeSystemNotificationsController.
         */
        function onInit() {
            vm.isOffline = offlineService.isOffline();
            vm.homePageSystemNotifications = homePageSystemNotifications;
            // ANGOLASUP-510: Create Leaderboard
            // ANGOLASUP-601: Leaderboards deactivated temporarily
            // vm.dashboardMostActive = $sce.trustAsResourceUrl(SUPERSET_URL
            //     + '/superset/dashboard/ranking-most-active-facilities/?standalone=true');
            // vm.dashboardLeastActive = $sce.trustAsResourceUrl(SUPERSET_URL
            //     + '/superset/dashboard/ranking-least-active-facilities/?standalone=true');

            // if (!vm.isOffline) {
            //     checkAuthorizationInSuperset();
            // }
        }

        // $rootScope.$on('openlmis-auth.authorized-in-superset', function() {
        //     $state.reload();
        // });

        // function checkAuthorizationInSuperset() {
        //     supersetOAuthService.checkAuthorizationInSuperset()
        //         .then(function(data) {
        //             vm.supersetOAuthState = data.state;
        //             if (data.isAuthorized === true) {
        //                 vm.isAuthorized = true;
        //             }
        //         });
        // }
        // // ANGOLASUP-601: ends here
        // ANGOLASUP-510: ends here

    }

})();
