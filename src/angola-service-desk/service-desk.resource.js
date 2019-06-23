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
     * @name angola-service-desk.ServiceDeskResource
     *
     * @description
     * Communicates with the Service Desk API of the Angola OpenLMIS server.
     */
    angular
        .module('angola-service-desk')
        .factory('ServiceDeskResource', ServiceDeskResource);

    ServiceDeskResource.inject = ['$resource', 'openlmisUrlFactory'];

    function ServiceDeskResource($resource, openlmisUrlFactory) {

        var resource = $resource(openlmisUrlFactory('/api/issues'), {}, {
            addAttachment: {
                url: openlmisUrlFactory('/api/issues/:issueId/attachment'),
                method: 'POST',
                headers: {
                    'Content-Type': undefined
                }
            }
        });

        return {
            create: create,
            addAttachment: addAttachment
        };

        /**
         * @ngdoc method
         * @methodOf angola-service-desk.ServiceDeskResource
         * @name create
         * 
         * @description
         * Creates issue for Service Desk API.
         * 
         * @param  {Object}  issue issue to be created
         * @return {Promise}       the promise resolving to the server response, rejected if request fails
         */
        function create(issue) {
            return resource.save(issue).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf angola-service-desk.ServiceDeskResource
         * @name addAttachment
         * 
         * @description
         * Attaches file to the Service Desk issue.
         * 
         * @param  {File}    attachment file to be attached
         * @param  {String}  issueId    id of already created issue
         * @return {Promise}            the promise resolving to the server response, rejected if request fails
         */
        function addAttachment(attachment, issueId) {
            var formData = new FormData();
            formData.append('file', attachment);

            return resource.addAttachment({
                issueId: issueId
            }, formData).$promise;
        }

    }
})();