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

describe('requisitionGroupService', function() {

    beforeEach(function() {
        this.offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
        this.requisitionGroupStorage = jasmine.createSpyObj('requisitionGroups', ['putAll', 'getAll', 'remove']);

        var offlineService = this.offlineService,
            requisitionGroupStorage = this.requisitionGroupStorage;

        module('referencedata-requisition-group', function($provide) {
            $provide.service('offlineService', function() {
                return offlineService;
            });

            $provide.service('localStorageFactory', function() {
                return jasmine.createSpy('localStorageFactory').andReturn(requisitionGroupStorage);
            });
        });

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.requisitionGroupService = $injector.get('requisitionGroupService');
            this.RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.$q = $injector.get('$q');
            this.localStorageService = $injector.get('localStorageService');
        });

        this.requisitionGroups = [
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson()
        ];

        this.requisitionGroupsPage = new this.PageDataBuilder()
            .withContent(this.requisitionGroups)
            .build();

        this.offlineService.isOffline.andReturn(false);
    });

    describe('get', function() {

        it('should resolve to requisition group', function() {
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/requisitionGroups/' + this.requisitionGroups[0].id))
                .respond(200, this.requisitionGroups[0]);

            var result;
            this.requisitionGroupService
                .get(this.requisitionGroups[0].id)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.requisitionGroups[0]));
        });
    });

    describe('getAll', function() {

        it('should resolve to requisition groups and save it to storage', function() {
            this.offlineService.isOffline.andReturn(false);
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/requisitionGroups'))
                .respond(200, this.requisitionGroups);

            var result;
            this.requisitionGroupService.getAll().then(function(data) {
                result = data;
            });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.requisitionGroups));
            expect(this.requisitionGroupStorage.putAll).toHaveBeenCalled();
        });

        it('should resolve to requisition groups when offline', function() {
            this.offlineService.isOffline.andReturn(true);
            this.requisitionGroupStorage.getAll.andReturn(this.requisitionGroups);

            var result;
            this.requisitionGroupService.getAll().then(function(data) {
                result = data;
            });
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.requisitionGroups));
            expect(this.requisitionGroupStorage.getAll).toHaveBeenCalled();
        });
    });

    describe('search', function() {

        beforeEach(function() {
            this.searchParams = {
                code: 'some-code',
                name: 'some-name'
            };
            this.paginationParams = {
                page: 0,
                size: 10
            };
        });

        it('should resolve to requisition groups', function() {
            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory(
                    '/api/requisitionGroups/search' +
                    '?page=' + this.paginationParams.page +
                    '&size=' + this.paginationParams.size
                ))
                .respond(200, this.requisitionGroupsPage);

            var result;
            this.requisitionGroupService
                .search(this.paginationParams, this.searchParams)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result.content)).toEqual(angular.toJson(this.requisitionGroups));
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });
});
