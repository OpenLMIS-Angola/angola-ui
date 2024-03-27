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

describe('openlmisTableSortingService', function() {
    var openlmisTableSortingService, $state, $stateParams, alertService;
    var mockSelectedColumn,
        mockSelectedColumnNotSortable;

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            openlmisTableSortingService = $injector.get('openlmisTableSortingService');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            alertService = $injector.get('alertService');
        });
        mockSelectedColumn = {
            header: 'adminFacilityList.name',
            propertyPath: 'name'
        };

        mockSelectedColumnNotSortable = {
            header: 'test.name',
            propertyPath: 'facility.name',
            sortable: false
        };
    });

    describe('sortTable', function() {
        it('should sort the table by the selected column if it is sortable', function() {
            $stateParams.sort = null;
            spyOn($state, 'go');
            openlmisTableSortingService.sortTable(mockSelectedColumn);

            expect($stateParams.sort).toBeDefined();
            expect($state.go).toHaveBeenCalled();
        });

        it('should display an alert if the column is not sortable', function() {
            spyOn(alertService, 'info');
            openlmisTableSortingService.sortTable(mockSelectedColumnNotSortable);

            expect(alertService.info).toHaveBeenCalledWith({
                title: 'column.notSortable.title',
                message: 'column.notSortable.message'
            });
        });
    });

    describe('isColumnSortable', function() {
        it('should return true if the column is sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable').andReturn(true);
            var result = openlmisTableSortingService.isColumnSortable(mockSelectedColumn);

            expect(result).toBe(true);
        });

        it('should return false if the column is not sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable').andReturn(false);
            var result = openlmisTableSortingService.isColumnSortable(mockSelectedColumn);

            expect(result).toBe(false);
        });
    });
});
