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
    * @name angola-service-desk.ISSUE_TYPE
    *
    * @description
    * This is constant for issue types.
    */
    angular
        .module('angola-service-desk')
        .constant('ISSUE_TYPE', types());

    function types() {

        var typesConstant = {
            BUG: {
                value: 'BUG',
                label: 'serviceDesk.bug'
            },
            SUPPORT: {
                value: 'SUPPORT',
                label: 'serviceDesk.support'
            },
            IMPROVEMENT: {
                value: 'IMPROVEMENT',
                label: 'serviceDesk.improvement'
            },
            NEW_FEATURE: {
                value: 'NEW_FEATURE',
                label: 'serviceDesk.newFeature'
            },
            toList: toList
        };

        return typesConstant;

        /**
         * @ngdoc method
         * @methodOf angola-service-desk.ISSUE_TYPE
         * @name toList
         *
         * @description
         * Retrieves list of issue types.
         */
        function toList() {
            return Object.values(typesConstant)
                .filter(function(element) {
                    return typeof element !== 'function';
                });
        }
    }

})();
