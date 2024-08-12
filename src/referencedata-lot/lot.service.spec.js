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

describe('lotService', function() {

    beforeEach(function() {

        this.offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
        this.lotsStorage = jasmine.createSpyObj('lotsStorage', ['put', 'putAll', 'getBy', 'search']);

        var offlineService = this.offlineService,
            lotsStorage = this.lotsStorage;

        module('referencedata-lot', function($provide) {
            $provide.service('localStorageFactory', function() {
                return jasmine.createSpy('localStorageFactory').andReturn(lotsStorage);
            });

            $provide.service('offlineService', function() {
                return offlineService;
            });
        });

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$q =  $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.lotService = $injector.get('lotService');
            this.alertService = $injector.get('alertService');
            this.LotDataBuilder = $injector.get('LotDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.offlineService.isOffline.andReturn(false);

        this.lots = [
            new this.LotDataBuilder()
                .withId(1)
                .withTradeItemId('tradeItemId-1')
                .build(),
            new this.LotDataBuilder()
                .withTradeItemId('tradeItemId-2')
                .withId(2)
                .build(),
            new this.LotDataBuilder()
                .withId(3)
                .build(),
            new this.LotDataBuilder()
                .withId(4)
                .build()
        ];

        this.lotsPage = new this.PageDataBuilder()
            .withContent(this.lots)
            .build();

        this.page = 0;
        this.size = 2;

        this.params = {
            page: this.page,
            size: this.size
        };
    });

    describe('query', function() {

        it('should get all lots and save them to storage', function() {
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/lots'))
                .respond(200, this.lotsPage);
            var result;
            this.lotService
                .query()
                .then(function(paginatedObject) {
                    result = paginatedObject;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.content).toEqual(this.lots);
            expect(this.lotsStorage.putAll.callCount).toEqual(1);
        });

        it('should get a proper lot from local storage', function() {
            this.offlineService.isOffline.andReturn(true);
            this.lotsStorage.getBy.andReturn(this.lots[0]);
            var params = {
                id: [this.lots[0].id]
            };

            var result;
            this.lotService
                .query(params)
                .then(function(paginatedObject) {
                    result = paginatedObject;
                });
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(result.content[0]).toEqual(this.lots[0]);
            expect(this.lotsStorage.put).not.toHaveBeenCalled();
        });

        it('should get a proper lot from local storage by tradeItemId', function() {
            this.offlineService.isOffline.andReturn(true);
            this.lotsStorage.search.andReturn(this.lots);
            var params = {
                tradeItemId: [this.lots[0].tradeItemId]
            };

            var result;
            this.lotService
                .query(params)
                .then(function(paginatedObject) {
                    result = paginatedObject;
                });
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(result.content[0]).toEqual(this.lots[0]);
            expect(this.lotsStorage.put).not.toHaveBeenCalled();
        });

        it('should reject if lot not found by id in local storage', function() {
            spyOn(this.alertService, 'error');

            this.offlineService.isOffline.andReturn(true);
            this.lotsStorage.getBy.andReturn(undefined);
            var params = {
                id: [this.lots[0].id]
            };

            var result;
            this.lotService
                .query(params)
                .then(function(paginatedObject) {
                    result = paginatedObject;
                });
            this.$rootScope.$apply();

            expect(result).toBeUndefined();
            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.lotsStorage.put).not.toHaveBeenCalled();
            expect(this.alertService.error).toHaveBeenCalledWith('referencedataLot.lotsEmpty.offlineMessage');
        });

        it('should reject if lot not found by tradeItemId in local storage', function() {
            spyOn(this.alertService, 'error');

            this.offlineService.isOffline.andReturn(true);
            this.lotsStorage.search.andReturn([]);
            var params = {
                tradeItemId: [this.lots[0].tradeItemId]
            };

            var result;
            this.lotService
                .query(params)
                .then(function(paginatedObject) {
                    result = paginatedObject;
                });
            this.$rootScope.$apply();

            expect(result).toBeUndefined();
            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.lotsStorage.put).not.toHaveBeenCalled();
            expect(this.alertService.error).toHaveBeenCalledWith('referencedataLot.lotsEmpty.offlineMessage');
        });
    });
});