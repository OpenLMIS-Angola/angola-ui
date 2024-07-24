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
     * @name openlmis-main-state.controller:OpenlmisHeaderController
     *
     * @description
     * Controller.
     */
    angular
        .module('openlmis-main-state')
        .controller('OpenlmisHeaderController', OpenlmisHeaderController);

    OpenlmisHeaderController.$inject = ['$scope'];

    function OpenlmisHeaderController($scope) {
        var controller = this;
        var isProductionInstance = '@@PRODUCTION_INSTANCE';
        var mainBackgroundColor = {
            'background-image': 'linear-gradient(to bottom, #77cbf0 0%, #49baeb 10%, #1ba9e6 100%)'
        };

        controller.backgroundColor = mainBackgroundColor;

        $scope.mouseEnter = function() {
            controller.backgroundColor = {
                'background-image': isProductionInstance === 'true'  ? 'linear-gradient(to bottom, #012853, #012853)' :
                    'linear-gradient(to bottom, #A80B16, #A80B16)'
            };
        };

        $scope.mouseLeave = function() {
            controller.backgroundColor = mainBackgroundColor;
        };
    }

})();
