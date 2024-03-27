describe('openlmisTableSortingService', function() {
    var openlmisTableSortingService, $state, $stateParams, alertService;

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            openlmisTableSortingService = $injector.get('openlmisTableSortingService');
            $state = $injector.get('$state');
            $stateParams = $injector.get('$stateParams');
            alertService = $injector.get('alertService');
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

            spyOn($state, 'go');
            openlmisTableSortingService.sortTable(mockSelectedColumn);

            expect($stateParams.sort).toBeDefined();
            expect($state.go).toHaveBeenCalled();
        });

        it('should display an alert if the column is not sortable', function() {
            spyOn(openlmisTableSortingService, 'isColumnSortable').and.returnValue(false);
            spyOn(alertService, 'info');
            openlmisTableSortingService.sortTable(mockSelectedColumnNotSortable);

            expect(alertService.info).toHaveBeenCalledWith({
                title: 'column.notSortable.title',
                message: 'column.notSortable.message'
            });
        });

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
});
