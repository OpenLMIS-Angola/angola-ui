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

describe('RoleListController', function() {

    beforeEach(function() {
        module('admin-role-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.rolesList = [
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build()
        ];

        this.vm = this.$controller('RoleListController', {
            roles: this.rolesList
        });

        this.vm.$onInit();
        this.$rootScope.$apply();
    });

    describe('$onInit', function() {
        it('should expose roles property', function() {
            expect(this.vm.roles).toBe(this.rolesList);
        });

        it('should set roles page as undefined', function() {
            expect(this.vm.rolesPage).toBe(undefined);
        });

    });
});
