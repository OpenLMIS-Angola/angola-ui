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

describe('OrganizationAddController', function() {

    beforeEach(function() {

        module('organization-add');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.organizationService = $injector.get('organizationService');
            this.confirmService = $injector.get('confirmService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.stateTrackerService = $injector.get('stateTrackerService');
        });

        this.programs = ['Program 1'];
        this.facilityTypes = [{
            id: 1
        }];
        this.geoLevels = [{
            id: 1
        }];

        this.controller = this.$controller('OrganizationAddController', {
            programs: this.programs,
            facilityTypes: this.facilityTypes,
            geoLevels: this.geoLevels
        });
    });

    describe('onSubmit', function() {

        beforeEach(function() {
            this.organizationId = '123';
            this.validSource = {
                id: '456'
            };
            this.validDestination = {
                id: '789'
            };

            this.confirmDeferred = this.$q.defer();
            this.saveDeferred = this.$q.defer();
            this.loadingDeferred = this.$q.defer();

            spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
            spyOn(this.stateTrackerService, 'goToPreviousState').andCallFake(this.loadingDeferred.resolve);
            spyOn(this.$state, 'go');
            spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
            spyOn(this.loadingModalService, 'close').andCallFake(this.loadingDeferred.resolve);
            spyOn(this.notificationService, 'success');
            spyOn(this.notificationService, 'error');
        });

        it('should show notification if organization creation has failed', function() {
            this.controller.program = this.programs[0];
            this.controller.facilityType = this.facilityTypes[0];
            this.controller.geoLevel = null;
            this.controller.$onInit();

            this.controller.onSubmit();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('organizationAdd.organizationCreateError');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });
    });

});