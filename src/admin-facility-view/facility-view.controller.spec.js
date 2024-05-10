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

describe('FacilityViewController', function() {

    beforeEach(function() {
        module('admin-facility-view');
        module('referencedata-period');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.tzPeriodService = $injector.get('tzPeriodService');
            this.wardService = $injector.get('wardService');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.FacilityRepository = $injector.get('FacilityRepository');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            this.FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.WardDataBuilder = $injector.get('WardDataBuilder');
            this.confirmService = $injector.get('confirmService');
        });

        spyOn(this.FacilityRepository.prototype, 'update').andReturn(this.$q.when());
        spyOn(this.tzPeriodService, 'tzCreate').andReturn(this.$q.when());

        this.confirmDeferred = this.$q.defer();
        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);

        this.saveFacilityDetailsDeferred = this.$q.defer();
        spyOn(this.wardService, 'saveFacilityWards').andReturn(this.saveFacilityDetailsDeferred.promise);

        var loadingModalPromise = this.$q.defer();
        spyOn(this.loadingModalService, 'close').andCallFake(loadingModalPromise.resolve);
        spyOn(this.loadingModalService, 'open').andReturn(loadingModalPromise.promise);

        spyOn(this.notificationService, 'success').andReturn(true);
        spyOn(this.notificationService, 'error').andReturn(true);
        spyOn(this.$state, 'go').andCallFake(loadingModalPromise.resolve);

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder().build(),
            new this.FacilityTypeDataBuilder().build()
        ];

        this.geographicZones = [
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build()
        ];

        this.facilityOperators = [
            new this.FacilityOperatorDataBuilder().build(),
            new this.FacilityOperatorDataBuilder().build()
        ];

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.wards = [
            new this.WardDataBuilder().build(),
            new this.WardDataBuilder().build()
        ];

        this.facility = new this.FacilityDataBuilder().withFacilityType(this.facilityTypes[0])
            .build();

        this.vm = this.$controller('FacilityViewController', {
            facility: this.facility,
            facilityTypes: this.facilityTypes,
            geographicZones: this.geographicZones,
            facilityOperators: this.facilityOperators,
            programs: this.programs,
            wards: this.wards
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goToFacilityList method', function() {
            expect(angular.isFunction(this.vm.goToFacilityList)).toBe(true);
        });

        it('should expose saveFacility method', function() {
            expect(angular.isFunction(this.vm.saveFacilityDetails)).toBe(true);
        });

        it('should expose addWard method', function() {
            expect(angular.isFunction(this.vm.addWard)).toBe(true);
        });

        it('should expose saveFacilityWards method', function() {
            expect(angular.isFunction(this.vm.saveFacilityWards)).toBe(true);
        });

        it('should expose facility', function() {
            expect(this.vm.facility).toEqual(this.facility);
        });

        it('should expose facilityTypes list', function() {
            expect(this.vm.facilityTypes).toEqual(this.facilityTypes);
        });

        it('should expose geographicZones list', function() {
            expect(this.vm.geographicZones).toEqual(this.geographicZones);
        });

        it('should expose facilityOperators list', function() {
            expect(this.vm.facilityOperators).toEqual(this.facilityOperators);
        });

        it('should expose program list', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose ward list', function() {
            expect(this.vm.wards).toEqual(this.wards);
        });

        it('should expose supported programs list', function() {
            expect(this.vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });

        it('should expose supported programs list as empty list if undefined', function() {
            this.vm.facility.supportedPrograms = undefined;
            this.vm.$onInit();

            expect(this.vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });

        it('should expose managedExternally flag', function() {
            spyOn(this.facility, 'isManagedExternally').andReturn(true);

            this.vm.$onInit();

            expect(this.vm.managedExternally).toBe(true);
        });

        it('should expose original facility name', function() {
            this.vm.$onInit();

            expect(this.vm.originalFacilityName).toEqual(this.facility.name);

            this.vm.facility.name += ' (Edited)';

            expect(this.vm.originalFacilityName).not.toBe(this.vm.facility.name);
        });
    });

    describe('goToFacilityList', function() {

        it('should call state go with correct params', function() {
            this.vm.goToFacilityList();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });
    });

    describe('saveFacility', function() {

        it('should open loading modal', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should call this.FacilityRepository save method', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.FacilityRepository.prototype.update).toHaveBeenCalledWith(this.vm.facility);
        });

        it('should close loading modal and show error notification after save fails', function() {
            this.FacilityRepository.prototype.update.andReturn(this.$q.reject());
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
            expect(this.notificationService.error).toHaveBeenCalledWith('adminFacilityView.saveFacility.fail');
        });

        it('should go to facility list after successful save', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });

        it('should show success notification after successful save', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminFacilityView.saveFacility.success');
        });
    });

    describe('addProgram', function() {

        beforeEach(function() {
            this.vm.facilityWithPrograms = {};
            this.vm.facilityWithPrograms.supportedPrograms = [];
        });

        it('should add supported program to the list', function() {
            this.vm.selectedProgram = this.vm.programs[0];
            this.vm.selectedStartDate = new Date('08/10/2017');

            var program = this.vm.selectedProgram;

            this.vm.addProgram();

            expect(this.vm.facilityWithPrograms.supportedPrograms[0])
                .toEqual(angular.extend({}, program, {
                    supportStartDate: new Date('08/10/2017'),
                    supportActive: true
                }));
        });

        it('should clear selections', function() {
            this.vm.selectedProgram = this.vm.programs[0];
            this.vm.selectedStartDate = new Date('08/10/2017');

            this.vm.addProgram();

            expect(this.vm.selectedProgram).toBe(null);
            expect(this.vm.selectedStartDate).toBe(null);
        });

    });

    describe('addWard', function() {

        beforeEach(function() {
            this.vm.wards = [];
            this.vm.facility = {
                id: 'facility-id'
            };
            this.vm.newWard = {
                disabled: false
            };
            spyOn(this.vm, 'generateWardCode').andReturn('generated-code');
        });

        it('should generate ward code', function() {
            this.vm.addWard();

            expect(this.vm.generateWardCode).toHaveBeenCalled();
            expect(this.vm.wards[0].code).toEqual('generated-code');
        });

        it('should add new ward to the list', function() {
            var newWard = angular.copy(this.vm.newWard);
            newWard.facility = {
                id: this.vm.facility.id
            };
            newWard.code = 'generated-code';

            spyOn(this.wardService, 'getAllWards').andReturn(this.$q.when({
                content: []
            }));

            this.vm.addWard();
            this.$rootScope.$apply();

            expect(this.vm.wards[0]).toEqual(newWard);
        });

        it('should clear newWard', function() {
            spyOn(this.wardService, 'getAllWards').andReturn(this.$q.when({
                content: []
            }));

            this.vm.addWard();
            this.$rootScope.$apply();

            expect(this.vm.newWard).toEqual({
                disabled: false
            });
        });
    });

    describe('saveFacilityWards', function() {

        it('should prompt user for confirmation before saving', function() {
            this.vm.saveFacilityWards();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'adminFacilityView.savingConfirmation',
                'adminFacilityView.save'
            );
        });

        it('should open loading modal after user confirms', function() {
            this.confirmDeferred.resolve();
            this.vm.saveFacilityWards();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should call wardService.saveFacilityWards with correct parameters', function() {
            this.confirmDeferred.resolve();
            this.vm.saveFacilityWards();
            this.$rootScope.$apply();

            expect(this.wardService.saveFacilityWards).toHaveBeenCalledWith(this.vm.wards);
        });

        it('should show success notification and navigate to facility list if saved successfully', function() {
            this.confirmDeferred.resolve();
            this.saveFacilityDetailsDeferred.resolve(this.wards);
            this.vm.saveFacilityWards();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminFacilityView.saveWards.success');
            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });

        it('should show error notification and close loading modal if wards save has failed', function() {
            this.confirmDeferred.resolve();
            this.saveFacilityDetailsDeferred.reject();
            this.vm.saveFacilityWards();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminFacilityView.saveWards.fail');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });
    });
});
