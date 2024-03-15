(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .service('openlmisTableSortingService', openlmisTableSortingService);

    openlmisTableSortingService.$inject = ['SORTING_SERVICE_CONSTANTS', '$state', '$stateParams'];

    function openlmisTableSortingService(SORTING_SERVICE_CONSTANTS, $state, $stateParams) {
        var sortingProperites = {
            isSortedBy: undefined,
            sortingOrder: undefined,
            headerClass: undefined
        };

        return {
            sortTable: sortTable,
            prepareHeadersClasses: prepareHeadersClasses
        };

        function sortTable(columns, selectedColumn) {
            var propertyToOrder = selectedColumn.propertyPath.split('.')[0];
            var stateParams = JSON.parse(JSON.stringify($stateParams));
            setSortingProperties(propertyToOrder);
            if (typeof sortingProperites.isSortedBy !== undefined) {
                stateParams.sort = propertyToOrder + ',' + sortingProperites.sortingOrder;
            }
            $state.go($state.current.name, stateParams);
            manageHeadersClasses(columns);
        }

        function setSortingProperties(propertyToOrder) {
            if (typeof sortingProperites.isSortedBy === undefined ||
                sortingProperites.isSortedBy !== propertyToOrder
            ) {
                sortingProperites = getSortingProperties(
                    propertyToOrder,
                    SORTING_SERVICE_CONSTANTS.ASC,
                    SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS
                );
            } else if (sortingProperites.sortingOrder === SORTING_SERVICE_CONSTANTS.ASC) {
                sortingProperites = getSortingProperties(
                    propertyToOrder,
                    SORTING_SERVICE_CONSTANTS.DESC,
                    SORTING_SERVICE_CONSTANTS.SORT_DESC_CLASS
                );
            } else {
                sortingProperites = getSortingProperties(undefined, '', '');
            }
        }

        function getSortingProperties(isSortedBy, sortingOrder, headerClass) {
            return {
                isSortedBy: isSortedBy,
                sortingOrder: sortingOrder,
                headerClass: headerClass
            };
        }

        function prepareHeadersClasses(columns) {
            columns.forEach(function(column) {
                column.class = '';
            });
        }

        function manageHeadersClasses(columns) {
            columns.forEach(function(column) {
                column.class =
                    isSortedByColumn(column, sortingProperites.isSortedBy) ? sortingProperites.headerClass : '';
            });
        }

        function isSortedByColumn(column, sortedColumn) {
            return column.propertyPath.split('.')[0] === sortedColumn;
        }
    }
})();
