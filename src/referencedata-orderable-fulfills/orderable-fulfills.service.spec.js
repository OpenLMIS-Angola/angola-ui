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

describe('orderableFulfillsService', function() {

    beforeEach(function() {

        this.offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
        this.orderableFulfillsStorage = jasmine.createSpyObj('orderableFulfillsStorage', ['put', 'putAll', 'getBy']);

        var offlineService = this.offlineService,
            orderableFulfillsStorage = this.orderableFulfillsStorage;

        module('referencedata-orderable-fulfills', function($provide) {
            $provide.service('localStorageFactory', function() {
                return jasmine.createSpy('localStorageFactory').andReturn(orderableFulfillsStorage);
            });

            $provide.service('offlineService', function() {
                return offlineService;
            });
        });

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.orderableFulfillsService = $injector.get('orderableFulfillsService');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.alertService = $injector.get('alertService');
        });

        this.offlineService.isOffline.andReturn(false);

        this.orderableFulfills = {
            idOne: {
                canFulfillForMe: [1, 2],
                canBeFulfilledByMe: []
            },
            idTwo: {
                canFulfillForMe: [],
                canBeFulfilledByMe: []
            }
        };
    });

    describe('query', function() {

        it('should get all orderableFulfills and save them to storage', function() {
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/orderableFulfills'))
                .respond(200, this.orderableFulfills);
            var result;
            this.orderableFulfillsService
                .query()
                .then(function(items) {
                    result = items;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result['idOne']).toEqual(this.orderableFulfills['idOne']);
            expect(result['idTwo']).toEqual(this.orderableFulfills['idTwo']);
            expect(this.orderableFulfillsStorage.putAll.callCount).toEqual(1);
        });

        it('should reject if orderable fulfills not found in the local storage', function() {
            spyOn(this.alertService, 'error');

            this.offlineService.isOffline.andReturn(true);
            this.orderableFulfillsStorage.getBy.andReturn(undefined);

            var params = {
                id: ['id-1']
            };

            var result;
            this.orderableFulfillsService
                .query(params)
                .then(function(items) {
                    result = items;
                });
            this.$rootScope.$apply();

            expect(result).toBeUndefined();
            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.orderableFulfillsStorage.put).not.toHaveBeenCalled();
            expect(this.alertService.error).toHaveBeenCalledWith('referencedataOrderableFulfills.offlineMessage');
        });
    });
});