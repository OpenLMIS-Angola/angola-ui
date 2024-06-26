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

describe('ProgramService getUserPrograms decorator', function() {

    beforeEach(function() {
        this.cache = jasmine.createSpyObj('cache', ['getBy', 'put', 'putAll', 'clearAll', 'getAll', 'search']);
        var cache = this.cache;
        module('referencedata-user');
        module('referencedata-user-programs-cache', function($provide) {
            $provide.factory('localStorageFactory', function() {
                cache.getAll.andReturn([]);
                return function() {
                    return cache;
                };
            });
        });

        inject(function($injector) {
            this.programService = $injector.get('programService');
            this.$rootScope = $injector.get('$rootScope');
            this.$httpBackend = $injector.get('$httpBackend');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        this.user = new this.UserDataBuilder().buildReferenceDataUserJson();

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.userIdOffline = {
            userIdOffline: this.user.id
        };
    });

    it('should return a cached programs if available', function() {
        this.cache.search.andReturn(this.programs);

        var result;
        this.programService
            .getUserPrograms(this.user.id)
            .then(function(response) {
                result = response;
            });
        this.$rootScope.$apply();

        expect(result).toEqual(this.programs);
        expect(this.cache.search).toHaveBeenCalled();
    });

    it('should send original request if there is no user programs cached', function() {
        this.$httpBackend
            .expectGET(this.openlmisUrlFactory('api/users/' + this.user.id + '/programs'))
            .respond(200, this.programs);

        this.cache.search.andReturn(undefined);

        var result;
        this.programService
            .getUserPrograms(this.user.id)
            .then(function(response) {
                result = response;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(this.cache.putAll.callCount).toEqual(1);
        expect(angular.toJson(result)).toEqual(angular.toJson([
            _.extend({}, this.programs[0], this.userIdOffline),
            _.extend({}, this.programs[1], this.userIdOffline)
        ]));
    });

    it('should clear user programs cache', function() {
        this.programService.clearUserProgramsCache();

        expect(this.cache.clearAll).toHaveBeenCalled();
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

});
