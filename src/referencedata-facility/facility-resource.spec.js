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

describe('FacilityResource', function() {

    beforeEach(function() {
        this.OpenlmisCachedResourceMock = jasmine.createSpy('OpenlmisCachedResource');

        var OpenlmisCachedResourceMock = this.OpenlmisCachedResourceMock;
        module('referencedata-facility', function($provide) {
            $provide.factory('OpenlmisCachedResource', function() {
                return OpenlmisCachedResourceMock;
            });
        });

        inject(function($injector) {
            this.FacilityResource = $injector.get('FacilityResource');
        });
    });

    it('should extend OpenlmisCachedResource', function() {
        new this.FacilityResource();

        expect(this.OpenlmisCachedResourceMock).toHaveBeenCalledWith('/api/facilities', 'facilities', {
            paginated: true,
            versioned: false
        });
    });
});