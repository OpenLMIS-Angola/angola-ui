(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .service('openlmisTableSortingService', openlmisTableSortingService);

    openlmisTableSortingService.$inject = ['SORTING_SERVICE_CONSTANTS', '$state', '$stateParams', 'alertService'];

    function openlmisTableSortingService(SORTING_SERVICE_CONSTANTS, $state, $stateParams, alertService) {
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
            if (typeof selectedColumn.sortable === 'undefined' || selectedColumn.sortable) {
                var propertyToOrder = selectedColumn.propertyPath.split('.')[0];
                var stateParams = JSON.parse(JSON.stringify($stateParams));
                setSortingProperties(propertyToOrder);
                stateParams.sort = getSortingParamValue(propertyToOrder);
                $state.go($state.current.name, stateParams);
                manageHeadersClasses(columns);
            } else {
                alertService.info({
                    title: 'column.notSortable.title',
                    message: 'column.notSortable.message'
                });
            }
        }

        function getSortingParamValue(propertyToOrder) {
            if (typeof sortingProperites.isSortedBy === 'undefined') {
                return undefined;
            }
            return propertyToOrder + ',' + sortingProperites.sortingOrder;
        }

        function setSortingProperties(propertyToOrder) {
            if (typeof sortingProperites.isSortedBy === 'undefined' ||
                sortingProperites.isSortedBy !== propertyToOrder
            ) {
                setSortingPropertiesValue(
                    propertyToOrder,
                    SORTING_SERVICE_CONSTANTS.ASC,
                    SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS
                );
            } else if (sortingProperites.sortingOrder === SORTING_SERVICE_CONSTANTS.ASC) {
                setSortingPropertiesValue(
                    propertyToOrder,
                    SORTING_SERVICE_CONSTANTS.DESC,
                    SORTING_SERVICE_CONSTANTS.SORT_DESC_CLASS
                );
            } else {
                setSortingPropertiesValue(undefined, '', '');
            }
        }

        function setSortingPropertiesValue(isSortedBy, sortingOrder, headerClass) {
            sortingProperites = {
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
                column.class = getColumnClass(column.propertyPath);
            });
        }

        function getColumnClass(propertyPath) {
            return isSortedByColumn(propertyPath) ? sortingProperites.headerClass : '';
        }

        function isSortedByColumn(propertyPath) {
            return propertyPath.split('.')[0] === sortingProperites.isSortedBy;
        }
    }
})();
