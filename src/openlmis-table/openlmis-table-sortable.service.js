(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .factory('openlmisTableSortableService', openlmisTableSortableService);

    openlmisTableSortableService.$inject = ['$timeout', 'OPENLMIS_TABLE_SORTABLE'];

    function openlmisTableSortableService($timeout, OPENLMIS_TABLE_SORTABLE) {
        var openlmisTableSortableService = {
            sortArrayAccordingToPropertyType: sortArrayAccordingToPropertyType,
            getArrayName: getArrayName,
            setupPropertiesSortingOrder: setupPropertiesSortingOrder,
            toCamelCase: toCamelCase
        };
        return openlmisTableSortableService;

        function sortArrayAccordingToPropertyType(array, prop, propertiesSortingOrder, headerElements) {
            var firstElementPropertyValue = array[0][prop];
            if (typeof firstElementPropertyValue === 'undefined') {
                console.log('no such property: ' + prop);
                return;
            }
            var objAsDate = new Date(firstElementPropertyValue);
            var sortAscending = propertiesSortingOrder[prop];
            var sortingMultiplier = sortAscending ? 1 : -1;
            if (!isDateInvalid(objAsDate)) {
                sortDatesArray(array, prop, sortingMultiplier);
            } else if (typeof firstElementPropertyValue === 'number' ||
                       typeof firstElementPropertyValue === 'boolean') {
                sortNumbersOrBooleansArray(array, prop, sortingMultiplier);
            } else if (typeof firstElementPropertyValue === 'string') {
                sortStringsArray(array, prop, sortingMultiplier);
            }
            manageHeaderClasses(propertiesSortingOrder, prop, headerElements);
            propertiesSortingOrder[prop] = !propertiesSortingOrder[prop];
        }

        function sortStringsArray(array, prop, sortingMultiplier) {
            return array.sort(function(el1, el2) {
                return sortingMultiplier * el1[prop].localeCompare(el2[prop]);
            });
        }

        function sortDatesArray(array, prop, sortingMultiplier) {
            return array.sort(function(el1, el2) {
                var el1AsDate = new Date(el1[prop]), el2AsDate = new Date(el2[prop]);
                return sortingMultiplier * (el1AsDate.getTime() - el2AsDate.getTime());
            });
        }

        function sortNumbersOrBooleansArray(array, prop, sortingMultiplier) {
            return array.sort(function(el1, el2) {
                return sortingMultiplier * (el1[prop] - el2[prop]);
            });
        }

        function getArrayName(element) {
            var ngRepeatDirective = element.find('[ng-repeat]');
            var ngRepeatExpression = ngRepeatDirective[0].getAttribute('ng-repeat');
            if (ngRepeatExpression) {
                var arrayName = ngRepeatExpression.split(' ')[2];
                var toRet = arrayName.split('.')[1];
                return toRet;
            }
        }

        function manageHeaderClasses(propertiesSortingOrder, propertyName, headerElements) {
            var className = propertiesSortingOrder[propertyName]
                ? OPENLMIS_TABLE_SORTABLE.SORT_ASC_CLASSS : OPENLMIS_TABLE_SORTABLE.SORT_DESC_CLASSS;

            headerElements.forEach(function(element) {
                element.className =
                    toCamelCase(element.textContent) === propertyName ? className : '';
            });
        }

        function setupPropertiesSortingOrder(properties, propertiesSortingOrder) {
            properties.forEach(function(prop) {
                propertiesSortingOrder[prop] = true;
            });
        }

        function toCamelCase(text) {
            text = text.toLowerCase();
            return text.replace(/[-_\s](.)/g, function(match, group1) {
                return group1.toUpperCase();
            });
        }

        function isDateInvalid(date) {
            return isNaN(date.getTime());
        }
    }
})();
