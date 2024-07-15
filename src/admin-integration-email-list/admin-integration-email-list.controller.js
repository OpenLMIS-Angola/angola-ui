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
     * @name admin-integration-email-list.controller:AdminIntegrationEmailListController
     *
     * @description
     * Controller for managing integration email list.
     */
    angular
        .module('admin-integration-email-list')
        .controller('AdminIntegrationEmailListController', controller);

    controller.$inject = ['$state', 'emails', 'FunctionDecorator', 'integrationEmailService', '$stateParams'];

    function controller($state, emails, FunctionDecorator, integrationEmailService, $stateParams) {

        var vm = this;
        vm.$onInit = onInit;

        vm.removeEmail = new FunctionDecorator()
            .decorateFunction(removeEmail)
            .withSuccessNotification('adminIntegrationEmailList.emailRemovedSuccessfully')
            .withErrorNotification('adminIntegrationEmailList.failedToRemoveEmail')
            .withConfirm('adminIntegrationEmailList.confirmToRemoveEmail')
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @name emails
         * @propertyOf admin-integration-email-list.controller:AdminIntegrationEmailListController
         * @type {Array}
         *
         * @description
         * Holds list of all integration emials.
         */
        vm.emails = [];

        /**
         * @ngdoc method
         * @methodOf admin-integration-email-list.controller:AdminIntegrationEmailListController
         * @name $onInit
         *
         * @description
         * Initializes controller
         */
        function onInit() {
            vm.emails = emails;
            console.log(vm.emails);
            console.log($stateParams);
        }

        /**
         * @ngdoc method
         * @methodOf admin-integration-email-list.controller:AdminIntegrationEmailListController
         * @name removeEmail
         *
         * @description
         * Remove the integration email.
         */
        function removeEmail(email) {
            return integrationEmailService.remove(email.email.id)
                .then(function() {
                    $state.reload();
                });
        }
    }

})();
