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
     * @name angola-service-desk:ServiceDeskController
     *
     * @description
     * Controller for managing supply line list screen.
     */
    angular
        .module('angola-service-desk')
        .controller('ServiceDeskController', controller);

    controller.$inject = [
        '$q', '$state', 'issueTypes', 'priorities', 'impactTypes', 'ServiceDeskResource', 'notificationService',
        'user'
    ];

    function controller($q, $state, issueTypes, priorities, impactTypes, ServiceDeskResource, notificationService,
                        user) {
        var vm = this;

        vm.$onInit = onInit;
        vm.send = send;
        vm.redirectToHome = redirectToHome;

        /**
         * @ngdoc property
         * @propertyOf angola-service-desk:ServiceDeskController
         * @name issueTypes
         * @type {Array}
         *
         * @description
         * Contains all available types of issue.
         */
        vm.issueTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf angola-service-desk:ServiceDeskController
         * @name priorities
         * @type {Array}
         *
         * @description
         * Contains all available priorities.
         */
        vm.priorities = undefined;

        /**
         * @ngdoc property
         * @propertyOf angola-service-desk:ServiceDeskController
         * @name impacts
         * @type {Array}
         *
         * @description
         * Contains all available types of impacts.
         */
        vm.impactTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf angola-service-desk:ServiceDeskController
         * @name issue
         * @type {Object}
         *
         * @description
         * Contains issue to be send to service desk API.
         */
        vm.issue = undefined;

        /**
         * @ngdoc property
         * @propertyOf angola-service-desk:ServiceDeskController
         * @name attachments
         * @type {Array}
         *
         * @description
         * Contains all files that will be attached to Service Desk issue.
         */
        vm.attachments = undefined;

        /**
         * @ngdoc method
         * @methodOf angola-service-desk:ServiceDeskController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ServiceDeskController.
         */
        function onInit() {
            vm.issueTypes = issueTypes;
            vm.priorities = priorities;
            vm.impactTypes = impactTypes;
            vm.issue = {
                email: user.email,
                displayName: user.firstName + ' ' + user.lastName
            };
            vm.attachments = [];
        }

        /**
         * @ngdoc method
         * @methodOf angola-service-desk:ServiceDeskController
         * @name send
         *
         * @description
         * Reloads page with new search parameters.
         */
        function send() {
            return ServiceDeskResource.create(vm.issue)
                .then(function(response) {
                    var attachmentPromises = [];
                    vm.attachments.forEach(function(attachment) {
                        attachmentPromises.push(ServiceDeskResource.addAttachment(attachment, response.issueId));
                    });

                    $q.all(attachmentPromises)
                        .then(function() {
                            notificationService.success('serviceDesk.sendSuccessfully', {
                                ticketNumber: response.issueKey,
                                userEmailAddress: user.email
                            });
                            redirectToHome();
                        });
                });
        }

        /**
         * @ngdoc method
         * @methodOf angola-service-desk:ServiceDeskController
         * @name redirectToHome
         *
         * @description
         * Redirects user to home page.
         */
        function redirectToHome() {
            $state.go('openlmis.home');
        }
    }
})();
