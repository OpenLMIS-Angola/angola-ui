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
     * @module admin-supply-line-list
     *
     * @description
     * Provides base admin state and controller for retrieving list of supply lines from the OpenLMIS server.
     */
    angular.module('admin-supply-line-list', [
        'openlmis-admin',
        'openlmis-pagination',
        'openlmis-rights',
        'referencedata-facility',
        'referencedata-supply-line',
        'referencedata-requisition-group',
        'openlmis-object-utils',
        'ui.router',
        'openlmis-table'
    ]);

})();
