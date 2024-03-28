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

describe('openlmisTableService', function() {
    var openlmisTableService;
    var objectWithtoutProp, notDefinedObject, objectWithProperty,
        testCountry = 'Poland';

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            openlmisTableService = $injector.get('openlmisTableService');
        });

        objectWithProperty = {
            country: {
                name: testCountry
            }
        };

        notDefinedObject = undefined;

        objectWithtoutProp = {
            country: {
                continent: 'Europe'
            }
        };
    });

    describe('getElementPropertyValue', function() {
        it('return value of a given object property if it is defined', function() {
            var result = openlmisTableService.
                getElementPropertyValue(objectWithProperty, 'country.name');

            expect(result).toBe(testCountry);
        });

        it('return undefined if object was not passed', function() {
            var result = openlmisTableService.
                getElementPropertyValue(notDefinedObject, 'country.name');

            expect(result).toBe(undefined);
        });

        it('return undefined if property is not on an object', function() {
            var result = openlmisTableService.
                getElementPropertyValue(objectWithtoutProp, 'country.name');

            expect(result).toBe(undefined);
        });
    });
});
