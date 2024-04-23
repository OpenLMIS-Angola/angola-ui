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
        .module('admin-facility-view')
        .factory('WardDataBuilder', WardDataBuilder);

    function WardDataBuilder() {

        WardDataBuilder.prototype.build = build;

        return WardDataBuilder;

        function WardDataBuilder() {
            WardDataBuilder.instanceNumber = (WardDataBuilder.instanceNumber || 0) + 1;
            this.code = 'ward-code' + WardDataBuilder.instanceNumber;
            this.name = 'ward-name' + WardDataBuilder.instanceNumber;
            this.description = 'description' + WardDataBuilder.instanceNumber;
            this.disabled = false;
            this.facility = {
                id: 'facility-id' + WardDataBuilder.instanceNumber
            };
        }

        function build() {
            return {
                code: this.code,
                name: this.name,
                description: this.description,
                disabled: this.disabled,
                facility: this.facility
            };
        }
    }
})();
