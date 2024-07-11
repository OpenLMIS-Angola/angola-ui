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
     * @name admin-integration-email-add.controller:AdminIntegrationEmailAddController
     *
     * @description
     * Controller for integration email add screen.
     */
    angular
        .module('admin-integration-email-add')
        .controller('AdminIntegrationEmailAddController', AdminIntegrationEmailAddController);

    AdminIntegrationEmailAddController.$inject = [
        '$state', 'email', 'FunctionDecorator'
    ];

    function AdminIntegrationEmailAddController($state, email, FunctionDecorator) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveEmail = saveEmail;
        vm.goToPreviousState = goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name email
         * @type {Object}
         *
         * @description
         * Holds email that will be created.
         */
        vm.email = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name successNotificationKey
         * @type {String}
         *
         * @description
         * Holds successNotificationKey message.
         */
        vm.successNotificationKey = email ? 'AdminIntegrationEmailAdd.save.success' :
            'adminIntegrationEmailAdd.create.success';

        /**
         * @ngdoc property
         * @propertyOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name errorNotificationKey
         * @type {String}
         *
         * @description
         * Holds errorNotificationKey message.
         */
        vm.errorNotificationKey = email ? 'adminIntegrationEmailAdd.save.failure' :
            'adminIntegrationEmailAdd.create.failure';

        /**
         * @ngdoc property
         * @propertyOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name modalHeaderKey
         * @type {String}
         *
         * @description
         * Holds modalHeaderKey message.
         */
        vm.modalHeaderKey = email ? 'adminIntegrationEmailAdd.editEmail' :
            'adminIntegrationEmailAdd.addEmail';

        /**
         * @ngdoc property
         * @methodOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name onInit
         *
         * @description
         * Initialization method for AdminIntegrationEmailAddController.
         */
        function onInit() {
            vm.email = email;
            vm.saveEmail = new FunctionDecorator()
                .decorateFunction(saveEmail)
                .withSuccessNotification(vm.successNotificationKey)
                .withErrorNotification(vm.errorNotificationKey)
                .withLoading(true)
                .getDecoratedFunction();
            console.log('email: ', email);
            console.log('successNotificationKey: ', vm.successNotificationKey);
        }

        /**
         * @ngdoc method
         * @methodOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name save
         *
         * @description
         * Saves the email address.
         */
        function saveEmail() {
            // return new OrderableResource()
            //     .update(vm.email)
            //     .then(function() {
            //         goToPreviousState();
            //     });
        }

        /**
         * @ngdoc property
         * @methodOf admin-integration-email-add.controller:AdminIntegrationEmailAddController
         * @name goToPreviousState
         *
         * @description
         * Redirects user to integration email list screen.
         */
        function goToPreviousState() {
            $state.go('openlmis.administration.adminIntegrationEmailList');
        }
    }
})();
