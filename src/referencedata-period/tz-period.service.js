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
     * @name referencedata-period.periodService
     *
     * @description
     * Responsible for retrieving all processing period information from the server.
     */
    angular
        .module('referencedata-period')
        .service('tzPeriodService', service);

    service.$inject = ['$q', '$resource', 'referencedataUrlFactory', 'openlmisDateFilter',
        'dateUtils'];

    function service($q, $resource, referencedataUrlFactory, openlmisDateFilter, dateUtils) {

        var resource = $resource(referencedataUrlFactory('/api/tzProcessingPeriods/:id'), {}, {

            deleteProgramAssociate: {
                url: referencedataUrlFactory('/api/tzProcessingPeriods/:programId/:facilityId/supportedPrograms'),
                method: 'DELETE',
                isArray: true
            },

            tzCreate: {
                url: referencedataUrlFactory('/api/tzProcessingPeriods/create'),
                method: 'POST',
                isArray: false
            }
        });
        this.deleteProcessingPeriod = deleteProcessingPeriod;
        this.deleteProgramAssociate = deleteProgramAssociate;
        this.tzCreate = tzCreate;

        /**
         * @ngdoc method
         * @name delete
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Delete specified processing period.
         *
         * @param  {Object}  periodId period to delete.
         * @return {Promise}        deleted Period
         */
        function deleteProcessingPeriod(periodId) {
            return resource.delete({
                id: periodId
            }).$promise;
        }

        /**
         * @ngdoc method
         * @name delete
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Delete specified processing period.
         *
         * @param  {Object}  programId program to delete.
         * @param  {Object}  facilityId facility to delete.
         * @return {Promise}        deleted Period
         */
        function deleteProgramAssociate(programId, facilityId) {
            return resource.deleteProgramAssociate({
                programId: programId,
                facilityId: facilityId
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodService
         * @name toStringDateUTC
         *
         * @description
         * Transforms dates from Date to string at UTC 00:00.
         *
         * @param {Date} date date to be parsed
         * @return {String} parsed date string in format yyyy-MM-dd.
         */
        function toStringDateUTC(date) {
            return openlmisDateFilter(date, 'yyyy-MM-dd');
        }

        /**
         * @ngdoc method
         * @name create
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Creates processing periods.
         *
         * @param  {Object}  period new Period
         * @return {Promise}        created Period
         */
        function tzCreate(period) {
            period.startDate = toBackendFormat(period.startDate);
            period.endDate = toBackendFormat(period.endDate);
            return resource.tzCreate(period).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodService
         * @name toBackendFormat
         *
         * @description
         * Transforms dates from Date, String or Array of numbers
         * to string at UTC 00:00.
         *
         * @param {Date | String | Array} date to be parsed
         * @return {String} parsed date string in format yyyy-MM-dd.
         */
        function toBackendFormat(date) {
            var parsed;
            if (date instanceof Date) {
                parsed = date;
            } else {
                parsed = dateUtils.toDate(date);
            }
            return (parsed) ? toStringDateUTC(parsed) : undefined;
        }

    }
})();
