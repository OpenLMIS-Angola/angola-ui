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

(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-table:openlmisTableSortingService
     *
     * @description
     * Responsible for every operation regarding sorting the table
     */
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

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name sortTable
         *
         * @description Orders a table by given column. By sending request with updated
         *  sort state param
         *
         * @param {Object} selectedColumn
         */
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

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name setHeadersClasses
         *
         * @description
         *  Sets the classes of table headers. If table is ordered by some header
         *   it will assign a special class
         * @param  {Array<Object>} columns
         */
        function setHeadersClasses(columns) {
            setInitialSortingProperties();

            columns.forEach(function(column) {
                column.class = getColumnClass(column);
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

        function getColumnClass(column) {
            var baseClass = column.classes ? column.classes : '';

            return isSortedByColumn(column.propertyPath) ?
                baseClass + sortingProperites.headerClass : baseClass;
        }

        function isSortedByColumn(propertyPath) {
            return propertyPath === sortingProperites.isSortedBy;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-table:openlmisTableSortingService
         * @name isColumnSortable
         *
         * @description Checks if column is sortable
         *
         * @param  {Object} column
         */
        function isColumnSortable(column) {
            return column.sortable === undefined || column.sortable;
        }
    }
})();
