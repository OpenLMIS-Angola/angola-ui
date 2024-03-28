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
     * @name admin-orderable-edit.controller:OrderableEditFtapsListController
     *
     * @description
     * Controller for displaying FTAPs on orderable FTAPs tab.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditFtapsListController', controller);

    controller.$inject = ['orderable', 'ftapsMap', 'facilityTypesMap', 'ftaps', '$state',
        'FunctionDecorator', 'FacilityTypeApprovedProductResource', 'canEdit'];

    function controller(orderable, ftapsMap, facilityTypesMap, ftaps, $state, FunctionDecorator,
                        FacilityTypeApprovedProductResource, canEdit) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToFacilityList = goToFacilityList;
        vm.deactivateFacilityTypeApproveProduct = new FunctionDecorator()
            .decorateFunction(deactivateFacilityTypeApproveProduct)
            .withSuccessNotification('adminOrderableEdit.ftapHasBeenRemovedSuccessfully')
            .withErrorNotification('adminOrderableEdit.failedToRemovedFtap')
            .withConfirm('adminOrderableEdit.confirmFtapDeactivation')
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditFtapsListController
         * @name orderable
         * @type {Object}
         *
         * @description
         * Contains orderable object. 
         */
        vm.orderable = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditFtapsListController
         * @name facilityTypeApprovedProducts
         * @type {Array}
         *
         * @description
         * Contains FTAP list. 
         */
        vm.facilityTypeApprovedProducts = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditFtapsListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditFtapsListController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.facilityTypeApprovedProducts = ftaps;
            vm.ftapsMap = ftapsMap;
            vm.facilityTypesMap = facilityTypesMap;
            vm.canEdit = canEdit;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditFtapsListController
         * @name deactivateFacilityTypeApproveProduct
         *
         * @description
         * Updates the ftap and return to the ftap list on success.
         * 
         * @param  {FacilityTypeApprovedProduct}  ftap the ftap to deactivate
         */
        function deactivateFacilityTypeApproveProduct(ftap) {
            ftap.deactivate();

            return new FacilityTypeApprovedProductResource()
                .update(ftap)
                .then(function() {
                    $state.reload();
                });
        }

        function goToFacilityList() {
            $state.go('openlmis.administration.orderables');
        }
    }
})();
