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
     * @ngdoc service
     * @name referencedata-user-programs-cache.programService
     *
     * @description
     * Decorates programService with clearing cache method.
     */
    angular.module('referencedata-user-programs-cache')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('programService', decorator);
    }

    decorator.$inject = ['$delegate', 'localStorageFactory'];
    function decorator($delegate, localStorageFactory) {
        var userProgramsCache = localStorageFactory('userPrograms');

        $delegate.clearUserProgramsCache = clearCache;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf referencedata-user-programs-cache.programService
         * @name clearUserProgramsCache
         *
         * @description
         * Deletes user programs stored in the browser cache.
         */
        function clearCache() {
            userProgramsCache.clearAll();
        }
    }
})();
