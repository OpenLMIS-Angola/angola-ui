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

describe('openlmis.administration.users.form', function() {

    beforeEach(function() {
        module('openlmis-main-state');
        module('admin-user-form');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            this.facilityService = $injector.get('facilityService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.$state = $injector.get('$state');
            this.$templateCache = $injector.get('$templateCache');
            this.authUserService = $injector.get('authUserService');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.VerificationEmailDataBuilder = $injector.get('VerificationEmailDataBuilder');
            this.UserService = $injector.get('UserService');
            this.UserRepository = $injector.get('UserRepository');
        });

        this.facilities = [
            new this.MinimalFacilityDataBuilder().build(),
            new this.MinimalFacilityDataBuilder().build(),
            new this.MinimalFacilityDataBuilder().build()
        ];

        this.users = new this.PageDataBuilder()
            .withContent([
                new this.UserDataBuilder().build(),
                new this.UserDataBuilder().build(),
                new this.UserDataBuilder().build()
            ])
            .build();

        this.verificationEmail = new this.VerificationEmailDataBuilder().build();

        spyOn(this.facilityService, 'getFacilitiesWithoutWards').andReturn(this.$q.resolve(this.facilities));
        spyOn(this.UserRepository.prototype, 'query').andReturn(this.$q.resolve(this.users));
        spyOn(this.UserService.prototype, 'get').andReturn(this.$q.resolve(this.users.content[0]));
        spyOn(this.authUserService, 'getVerificationEmail').andReturn(this.$q.resolve(this.verificationEmail));
        spyOn(this.$templateCache, 'get').andCallThrough();

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    describe('state', function() {

        it('should be available under "/profile" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.administration.users.form');

            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.$state.current.name).toEqual('openlmis.administration.users.form');
        });

        it('should use template', function() {
            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-form/user-form.html');
        });

        it('should resolve facilities', function() {
            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.getResolvedValue('facilities')).toEqual(this.facilities);
        });

        it('should resolve user', function() {
            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.getResolvedValue('user')).toEqual(this.users.content[0]);
            expect(this.UserService.prototype.get).toHaveBeenCalledWith(this.users.content[0].id);
        });

        it('should resolve pending email verification', function() {
            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.getResolvedValue('pendingVerificationEmail')).toEqual(this.verificationEmail);
        });

        it('should resolve pending verification email to undefined if creating new user', function() {
            var user = new this.UserDataBuilder()
                .asNew()
                .build();

            this.UserService.prototype.get.andReturn(this.$q.resolve(user));

            this.goToUrl(
                '/administration/users/form/' + this.users.content[0].id + '?usersPage=0&usersSize=10&sort=username'
            );

            expect(this.getResolvedValue('pendingVerificationEmail')).toBeUndefined();
        });

    });

});
