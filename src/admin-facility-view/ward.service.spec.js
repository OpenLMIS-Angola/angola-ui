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

describe('wardService', function() {
    beforeEach(function() {
        module('admin-facility-view');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.wardService = $injector.get('wardService');
            this.$httpBackend = $injector.get('$httpBackend');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.WardDataBuilder = $injector.get('WardDataBuilder');
        });

        this.facility = {
            zoneId: '123',
            id: '123'
        };

        this.ward1 = new this.WardDataBuilder().build();
        this.ward2 = new this.WardDataBuilder().build();

        this.ward1.geographicZone = {
            id: '123'
        };
        this.ward2.geographicZone = {
            id: '123'
        };

        this.wards = [
            this.ward1,
            this.ward2
        ];
    });

    it('should get wards by facility', function() {
        this.$httpBackend
            .expectGET(this.referencedataUrlFactory('/api/facilities/full?zoneId=123&sort=code,asc'))
            .respond(200, {
                content: this.wards
            });

        var result;
        this.wardService.getWardsByFacility({
            zoneId: this.facility.zoneId,
            sort: 'code,asc'
        }).then(function(response) {
            result = response.content;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(result).toEqual(this.wards);
    });

    it('should save facility wards', function() {
        var changedWard = angular.copy(this.ward1);
        changedWard.description = 'changed';

        this.$httpBackend
            .expectPUT(this.referencedataUrlFactory('/api/facilities/' + changedWard.id), changedWard)
            .respond(200, changedWard);

        var result;
        this.wardService.updateFacilityWard(changedWard).then(function(response) {
            result = response;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(changedWard));
    });

});
