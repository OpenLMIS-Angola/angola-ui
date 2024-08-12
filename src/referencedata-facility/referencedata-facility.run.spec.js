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

describe('referencedata-facility run', function() {

    beforeEach(function() {
        this.loginServiceSpy = jasmine.createSpyObj('loginService', [
            'registerPostLoginAction', 'registerPostLogoutAction'
        ]);

        var loginServiceSpy = this.loginServiceSpy;
        module('referencedata-facility', function($provide) {
            $provide.value('loginService', loginServiceSpy);
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.facilityService = $injector.get('facilityService');
        });

        this.getLastCall = function(method) {
            return method.calls[method.calls.length - 1];
        };

        this.postLogoutAction = this.getLastCall(loginServiceSpy.registerPostLogoutAction).args[0];
    });

    describe('run block', function() {

        it('should register post logout action', function() {
            expect(this.loginServiceSpy.registerPostLogoutAction).toHaveBeenCalled();
        });

    });
});
