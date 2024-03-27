<<<<<<< HEAD
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
    var openlmisTableSortingService, $state, $stateParams, alertService, SORTING_SERVICE_CONSTANTS;
    var mockSelectedColumn,
        mockSelectedColumnNotSortable;
=======
describe('openlmisTableSortingService', function() {
    var openlmisTableSortingService, $state, $stateParams, alertService;
>>>>>>> bd3e59e (wip)

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            openlmisTableSortingService = $injector.get('openlmisTableSortingService');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            alertService = $injector.get('alertService');
<<<<<<< HEAD
            SORTING_SERVICE_CONSTANTS = $injector.get('SORTING_SERVICE_CONSTANTS');
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
=======
        });
    });

    describe('sortTable', function() {
        var mockSelectedColumn,
            mockSelectedColumnNotSortable;

        beforeEach(function() {
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

        it('should sort the table by the selected column if it is sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable').and.returnValue(true);

            $stateParams.sort = null;

>>>>>>> bd3e59e (wip)
            spyOn($state, 'go');
            openlmisTableSortingService.sortTable(mockSelectedColumn);

            expect($stateParams.sort).toBeDefined();
            expect($state.go).toHaveBeenCalled();
        });

        it('should display an alert if the column is not sortable', function() {
<<<<<<< HEAD
=======
            spyOn(openlmisTableSortingService, 'isColumnSortable').and.returnValue(false);
>>>>>>> bd3e59e (wip)
            spyOn(alertService, 'info');
            openlmisTableSortingService.sortTable(mockSelectedColumnNotSortable);

            expect(alertService.info).toHaveBeenCalledWith({
                title: 'column.notSortable.title',
                message: 'column.notSortable.message'
            });
        });
<<<<<<< HEAD
    });

    describe('isColumnSortable', function() {
        it('should return true if the column is sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable').
                andReturn(mockSelectedColumn.sortable === undefined || mockSelectedColumn.sortable);

            var result = openlmisTableSortingService.isColumnSortable(mockSelectedColumn);

            expect(result).toBe(true);
        });

        it('should return false if the column is not sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable')
                .andReturn(mockSelectedColumnNotSortable.sortable === undefined
                    || mockSelectedColumnNotSortable.sortable);

            var result = openlmisTableSortingService.isColumnSortable(mockSelectedColumn);

            expect(result).toBe(false);
        });
    });

    describe('setHeadersClasses', function() {
        var mockColumns;

        beforeEach(function() {
            mockColumns =  [
                {
                    header: 'adminFacilityList.name',
                    propertyPath: 'name'
                },
                {
                    header: 'adminFacilityList.code',
                    propertyPath: 'code'
                },
                {
                    header: 'adminFacilityList.geographicZone',
                    propertyPath: 'geographicZone.name'
                },
                {
                    header: 'adminFacilityList.type',
                    propertyPath: 'type.name'
                }
            ];
        });

        it('should assign the SORT_ASC_CLASS to the code column', function() {
            $stateParams.sort = 'code,asc';

            openlmisTableSortingService.setHeadersClasses(mockColumns);

            expect(mockColumns[1].class).toBe(SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS);
        });

        it('should assign the empty string class to every column', function() {
            $stateParams.sort = undefined;

            openlmisTableSortingService.setHeadersClasses(mockColumns);

            expect(mockColumns.map(function(col) {
                return col.class;
            })).toEqual(['', '', '', '']);
        });
    });
=======

        // Add more test cases for other scenarios (nested properties, state params update) as needed
    });

    // Tests for setHeadersClasses method
    // describe('setHeadersClasses', function () {
    //     it('should set classes for table headers', function () {
    //         // Your test logic here
    //     });

    //     // Add more tests as needed
    // });

    // // Tests for isColumnSortable method
    // describe('isColumnSortable', function () {
    //     it('should return true if the column is sortable', function () {
    //         // Your test logic here
    //     });

    //     it('should return false if the column is not sortable', function () {
    //         // Your test logic here
    //     });

    //     // Add more tests as needed
    // });

    // Add more describe blocks for other methods if needed
>>>>>>> bd3e59e (wip)
});
