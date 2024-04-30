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

describe('ValidDestinationAddController', function() {

    beforeEach(function() {

        module('admin-valid-destination-add');

        this.validDestinations = [
            {
                programId: 1,
                facilityTypeId: 2,
                name: 'valid destination 1',
                geoZoneId: 3,
                geoLevelId: 4
            },
            {
                programId: 0,
                facilityTypeId: 1,
                name: 'valid destination 2',
                geoZoneId: 4,
                geoLevelId: 3
            }
        ];

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.confirmService = $injector.get('confirmService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.$q = $injector.get('$q');
            this.wardService = $injector.get('wardService');
            this.$scope = this.$rootScope.$new();
        });

        var geoLevelMap = [];
        geoLevelMap[4] = 'geo level 1';

        this.programs = ['program 1'];
        this.facilities = [{
            id: 54467
        }];
        this.organizations = [{
            id: 5466
        }];
        this.facilityTypes = [{
            id: 1
        }];
        this.geoLevels = [{
            id: 1
        }];

        this.controller = this.$controller('ValidDestinationAddController', {
            validDestinations: this.validDestinations,
            programsMap: {
                1: 'program 1'
            },
            facilityTypesMap: {
                2: 'type 1'
            },
            geographicZonesMap: {
                3: 'geo zone 1'
            },
            geographicLevelMap: geoLevelMap,
            programs: this.programs,
            facilities: this.facilities,
            organizations: this.organizations,
            facilityTypes: this.facilityTypes,
            geoLevels: this.geoLevels,
            wardService: this.wardService,
            $scope: this.$scope
        });

    });

    it('should assign facilities', function() {
        this.controller.$onInit();

        expect(this.controller.facilities).toEqual(this.facilities);
    });

    it('should assign programs', function() {
        this.controller.$onInit();

        expect(this.controller.programs).toEqual(this.programs);
    });

    it('should assign geo levels', function() {
        this.controller.$onInit();

        expect(this.controller.geoLevels).toEqual(this.geoLevels);
    });

    it('should assign organizations', function() {
        this.controller.$onInit();

        expect(this.controller.organizations).toEqual(this.organizations);
    });

    it('should assign facilityTypes', function() {
        this.controller.$onInit();

        expect(this.controller.facilityTypes).toEqual(this.facilityTypes);
    });

    describe('submit', function() {
        beforeEach(function() {
            this.saveDeferred = this.$q.defer();
            this.confirmDeferred = this.$q.defer();
            this.loadingDeferred = this.$q.defer();

            spyOn(this.$state, 'go');
            spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
            spyOn(this.loadingModalService, 'close').andCallFake(this.loadingDeferred.resolve);
            spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
            spyOn(this.notificationService, 'success');
            spyOn(this.notificationService, 'error');

        });

        it('should show notification if valid destination save has failed', function() {

            this.controller.unitType = 'organization';
            this.controller.organization = this.organizations[0];
            this.controller.program = this.programs[0];
            this.controller.facilityType = this.facilityTypes[0];
            this.controller.geoLevel = null;
            this.controller.$onInit();

            this.controller.submit();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminValidDestinationAdd.failure');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });
    });
});