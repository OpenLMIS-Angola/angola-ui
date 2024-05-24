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
    * @ngdoc object
    * @name order-view.ORDER_REQUISITION_STATUS
    *
    * @description
    * This is constant for order requisition status.
    */
    angular
        .module('order-view')
        .constant('ORDER_REQUISITION_STATUS', types());

    function types() {

        var typesConstant = {
            WITH_REQUISITION: {
                value: 'WITH_REQUISITION',
                label: 'orderView.withRequisition'
            },
            WITHOUT_REQUISITION: {
                value: 'WITHOUT_REQUISITION',
                label: 'orderView.withoutRequisition'
            },
            toList: toList
        };

        return typesConstant;

        /**
         * @ngdoc method
         * @methodOf order-view.ORDER_REQUISITION_STATUS
         * @name toList
         *
         * @description
         * Retrieves list of order requisition statuses.
         */
        function toList() {
            return Object.values(typesConstant)
                .filter(function(element) {
                    return typeof element !== 'function';
                });
        }
    }

})();
