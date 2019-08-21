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

describe('ServiceDeskController', function() {

    beforeEach(function() {
        module('angola-service-desk');

        var $q, $controller, UserDataBuilder;
        inject(function($injector) {
            UserDataBuilder = $injector.get('UserDataBuilder');

            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.$location = $injector.get('$location');
            this.ServiceDeskResource = $injector.get('ServiceDeskResource');

            this.ISSUE_TYPE = $injector.get('ISSUE_TYPE');
            this.PRIORITY_TYPE = $injector.get('PRIORITY_TYPE');
            this.IMPACT_TYPE = $injector.get('IMPACT_TYPE');
        });

        this.user = new UserDataBuilder().build();
        this.issueKey = 'ServiceDesk-1';
        this.issueId = '1';
        this.message = 'test-message';

        spyOn(this.ServiceDeskResource.prototype, 'create').andReturn($q.resolve({
            issueKey: this.issueKey,
            issueId: this.issueId
        }));
        spyOn(this.ServiceDeskResource.prototype, 'addAttachment');

        this.notificationService = jasmine.createSpyObj('notificationService', ['success']);

        this.loadingModalService = jasmine.createSpyObj('loadingModalService', ['open']);

        this.messageService = jasmine.createSpyObj('messageService', ['get']);
        this.messageService.get.andReturn(this.message);

        this.vm = $controller('ServiceDeskController', {
            issueTypes: new this.ISSUE_TYPE.toList(),
            priorities: new this.PRIORITY_TYPE.toList(),
            impactTypes: new this.IMPACT_TYPE.toList(),
            notificationService: this.notificationService,
            messageService: this.messageService,
            loadingModalService: this.loadingModalService,
            user: this.user
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose send method', function() {
            expect(angular.isFunction(this.vm.send)).toBe(true);
        });

        it('should expose redirectToHome method', function() {
            expect(angular.isFunction(this.vm.redirectToHome)).toBe(true);
        });

        it('should expose issue types', function() {
            expect(this.vm.issueTypes).toEqual(new this.ISSUE_TYPE.toList());
        });

        it('should expose priority types', function() {
            expect(this.vm.priorities).toEqual(new this.PRIORITY_TYPE.toList());
        });

        it('should expose impact types', function() {
            expect(this.vm.impactTypes).toEqual(new this.IMPACT_TYPE.toList());
        });

        it('should expose issue', function() {
            expect(this.vm.issue).toEqual({
                email: this.user.email,
                displayName: this.user.firstName + ' ' + this.user.lastName,
                username: this.user.username,
                url: this.$location.absUrl()
            });
        });

        it('should expose attachments', function() {
            expect(this.vm.attachments).toEqual([]);
        });
    });

    describe('send', function() {

        beforeEach(function() {
            this.vm.attachments.push('attachment1');
            this.vm.attachments.push('attachment2');

            this.vm.send();

            this.$rootScope.$apply();
        });

        it('should open loading modal', function() {
            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should create issue', function() {
            expect(this.ServiceDeskResource.prototype.create).toHaveBeenCalledWith(this.vm.issue);
        });

        it('should attach files', function() {
            expect(this.ServiceDeskResource.prototype.addAttachment).toHaveBeenCalledWith('attachment1', this.issueId);
            expect(this.ServiceDeskResource.prototype.addAttachment).toHaveBeenCalledWith('attachment2', this.issueId);
        });

        it('should call message service', function() {
            expect(this.messageService.get).toHaveBeenCalledWith('serviceDesk.sendSuccessfully', {
                ticketNumber: this.issueKey,
                userEmailAddress: this.user.email
            });
        });

        it('should show notification', function() {
            expect(this.notificationService.success).toHaveBeenCalledWith(this.message);
        });

        it('should call state go method', function() {
            expect(this.$state.go).toHaveBeenCalledWith('openlmis.home');
        });
    });

    describe('redirectToHome', function() {

        it('should redirect to home page', function() {
            this.vm.redirectToHome();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.home');
        });
    });
});
