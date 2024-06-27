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
     * @name referencedata-program.programService
     *
     * @description
     * Responsible for retrieving programs from the server.
     */
    angular
        .module('referencedata-program')
        .factory('programService', service);

    service.$inject = ['openlmisUrlFactory', '$resource', '$q', 'localStorageFactory', 'localStorageService'];

    function service(openlmisUrlFactory, $resource, $q, localStorageFactory, localStorageService) {

        var resource = $resource(openlmisUrlFactory('/api/programs/:id'), {}, {
                getAll: {
                    url: openlmisUrlFactory('/api/programs'),
                    method: 'GET',
                    isArray: true
                },
                getUserPrograms: {
                    url: openlmisUrlFactory('api/users/:userId/programs'),
                    method: 'GET',
                    isArray: true
                },
                update: {
                    method: 'PUT'
                },
                getUserSupportedPrograms: {
                    url: openlmisUrlFactory('api/users/:userId/supportedPrograms'),
                    method: 'GET',
                    isArray: true
                }
            }),
            userProgramsCache = localStorageFactory('userPrograms'),
            programsCache = localStorageFactory('programs');

        return {
            get: get,
            getAll: getAll,
            getUserPrograms: getUserPrograms,
            getUserSupportedPrograms: getUserSupportedPrograms,
            update: update,
            create: create,
            clearProgramsCache: clearProgramsCache
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name get
         *
         * @description
         * Gets program by id.
         *
         * @param  {String}  id Program UUID
         * @return {Promise}    Program info
         */
        function get(id) {
            var cachedProgram = programsCache.getBy('id', id);

            if (cachedProgram) {
                return $q.resolve(cachedProgram);
            }

            return resource.get({
                id: id
            })
                .$promise
                .then(function(program) {
                    programsCache.put(program);
                    return program;
                })
                .catch(function() {
                    return $q.reject();
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name getAll
         *
         * @description
         * Gets all programs.
         *
         * @return {Promise} Array of all programs
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name update
         *
         * @description
         * Updates program.
         *
         * @param  {Object}  program Program to be updated
         * @return {Promise}         Updated program
         */
        function update(program) {
            return resource.update({
                id: program.id
            }, program)
                .$promise
                .then(function(program) {
                    programsCache.put(program);
                    return program;
                })
                .catch(function() {
                    return $q.reject();
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name create
         *
         * @description
         * Creates new program.
         *
         * @param  {Object}  program Program to be created
         * @return {Promise}         Updated program
         */
        function create(program) {
            return resource.save(null, program).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name getUserPrograms
         *
         * @description
         * Retrieves programs for the current user and saves them in the local storage.
         * If the user is offline program are retrieved from the local storage.
         *
         * @param  {String}  userId User UUID
         * @return {Promise}        Array of programs
         */
        function getUserPrograms(userId) {
            var cachedPrograms = userProgramsCache.search({
                userIdOffline: userId
            });

            if (cachedPrograms && cachedPrograms.length) {
                return $q.resolve(cachedPrograms);
            }

            return resource.getUserPrograms({
                userId: userId
            })
                .$promise
                .then(function(programs) {
                    var programsToStore = programs.map(function(program) {
                        program.userIdOffline = userId;
                        return program;
                    })
                        .filter(Boolean);

                    userProgramsCache.putAll(programsToStore);

                    return programs;
                })
                .catch(function() {
                    return $q.reject();
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name getUserSupportedPrograms
         *
         * @description
         * Retrieves programs for the given user.
         *
         * @param  {String}  userId User UUID
         * @return {Promise}        Array of programs
         */
        function getUserSupportedPrograms(userId) {
            return resource.getUserSupportedPrograms({
                userId: userId
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-program.programService
         * @name clearProgramsCache
         *
         * @description
         * Deletes programs stored in the browser cache.
         */
        function clearProgramsCache() {
            localStorageService.remove('programs');
        }
    }
})();
