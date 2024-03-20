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
            setHeadersClasses: setHeadersClasses,
            isColumnSortable: isColumnSortable
        };

        function sortTable(selectedColumn) {
            if (isColumnSortable(selectedColumn)) {
                var propertyPathParts = selectedColumn.propertyPath.split('.');
                if (isNestedProperty(propertyPathParts)) {
                    return;
                }

                var propertyToOrder = propertyPathParts[0];
                var stateParams = JSON.parse(JSON.stringify($stateParams));
                setSortingProperties(selectedColumn.propertyPath);
                stateParams.sort = getSortingParamValue(propertyToOrder);
                $state.go($state.current.name, stateParams);
            } else {
                alertService.info({
                    title: 'column.notSortable.title',
                    message: 'column.notSortable.message'
                });
            }
        }

        function isNestedProperty(propertyPathParts) {
            if (propertyPathParts.length > 1) {
                alertService.error('sorting.error.nestedProperty.message');
                return true;
            }
            return false;
        }

        function getSortingParamValue(propertyToOrder) {
            if (typeof sortingProperites.isSortedBy === 'undefined') {
                return undefined;
            }
            return propertyToOrder + ',' + sortingProperites.sortingOrder;
        }

        function setSortingProperties(propertyToOrder) {
            if (sortingProperites.isSortedBy === undefined ||
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

        function setHeadersClasses(columns) {
            setInitialSortingProperties();

            columns.forEach(function(column) {
                column.class = getColumnClass(column.propertyPath);
            });
        }

        function setInitialSortingProperties() {
            var sortParam = $stateParams.sort;

            if (sortParam) {
                var sortParamParts = sortParam.split(',');
                var isSortedBy = sortParamParts[0];
                var sortingOrder = sortParamParts[1];
                var headerClass = sortingOrder === SORTING_SERVICE_CONSTANTS.ASC ?
                    SORTING_SERVICE_CONSTANTS.SORT_ASC_CLASS : SORTING_SERVICE_CONSTANTS.SORT_DESC_CLASS;

                setSortingPropertiesValue(isSortedBy, sortingOrder, headerClass);
            } else {
                setSortingPropertiesValue(undefined, '', '');
            }
        }

        function getColumnClass(propertyPath) {
            return isSortedByColumn(propertyPath) ? sortingProperites.headerClass : '';
        }

        function isSortedByColumn(propertyPath) {
            return propertyPath === sortingProperites.isSortedBy;
        }

        function isColumnSortable(column) {
            return column.sortable === undefined || column.sortable;
        }
    }
})();
