(function () {
    'use strict';

    angular
        .module('openlmis-table')
        .directive('openlmisTableSortable', directive);

    directive.$inject = ['$timeout'];

    function directive($timeout) {
        var directive = {
            link: link,
            restrict: 'C',
            priority: 10,
        };
        return directive;

        /*
            TODO:
            - add styling to the header element:
                - arrow pointing the sorting direction
                - cursor pointer
            - allow to sort by multiple properties
            - find out what to do when there is different header name than the property
            - persist the sorting when
        */

        function link(scope, element) {
            var propertiesSortingOrder = {};
            var properties = [];
            var header = element.find('thead tr');
            var arrayName = '';
            $timeout(function () {
                arrayName = getArrayName(element);
                header.children().each(function (i, child) {
                    var childElement = angular.element(child);
                    var headerTextContent = childElement.text();
                    properties.push(headerTextContent);
                    childElement.on('click', function () {
                        console.log('Clicked on:', headerTextContent);
                        scope.$apply(function () {
                            sortTableBy(toCamelCase(headerTextContent));
                        })
                    });
                });
                setupPropertiesSortingOrder();
            })

            function sortTableBy(propertyToOrder) {
                var tbody = $(angular.element.find('tbody'));
                var tableScope = tbody.scope();
                var array = tableScope.vm[arrayName];
                console.log(array);
                sortArrayAccordingToPropertyType(array, propertyToOrder);
                console.log(array);
            }

            function sortArrayAccordingToPropertyType(array, prop) {
                var firstElementPropertyValue = array[0][prop];
                if (typeof firstElementPropertyValue === 'undefined') {
                    console.log('no such property: ' + prop);
                    return
                }
                var objAsDate = new Date(firstElementPropertyValue);
                var sortAscending = propertiesSortingOrder[prop];
                var sortingMultiplier = sortAscending ? 1 : -1;
                if (!isDateInvalid(objAsDate)) {
                    sortDatesArray(array, prop, sortingMultiplier);
                } else if (typeof firstElementPropertyValue === 'number' || typeof firstElementPropertyValue === 'boolean') {
                    sortNumbersOrBooleansArray(array, prop, sortingMultiplier)
                } else if (typeof firstElementPropertyValue === 'string') {
                    sortStringsArray(array, prop, sortingMultiplier);
                }
                propertiesSortingOrder[prop] = !propertiesSortingOrder[prop];
            }

            function sortStringsArray(array, prop, sortingMultiplier) {
                return array.sort(function (el1, el2) {
                    return sortingMultiplier * el1[prop].localeCompare(el2[prop]);
                })
            }

            function sortDatesArray(array, prop, sortingMultiplier) {
                return array.sort(function (el1, el2) {
                    var el1AsDate = new Date(el1[prop]), el2AsDate = new Date(el2[prop]);
                    return sortingMultiplier * (el1AsDate.getTime() - el2AsDate.getTime());
                })
            }

            function sortNumbersOrBooleansArray(array, prop, sortingMultiplier) {
                return array.sort(function (el1, el2) {
                    return sortingMultiplier * (el1[prop] - el2[prop]);
                })
            }

            function getArrayName(element) {
                var ngRepeatDirective = element.find('[ng-repeat]');
                var ngRepeatExpression = ngRepeatDirective[0].getAttribute('ng-repeat');
                if (ngRepeatExpression) {
                    var arrayName = ngRepeatExpression.split(' ')[2];
                    var toRet = arrayName.split('.')[1];
                    console.log(toRet)
                    return toRet;
                }
            }

            function setupPropertiesSortingOrder() {
                properties.forEach(prop => {
                    propertiesSortingOrder[toCamelCase(prop)] = true;
                });
            }

            function toCamelCase(text) {
                text = text.toLowerCase()
                return text.replace(/[-_\s](.)/g, function (match, group1) {
                    return group1.toUpperCase();
                });
            }

            function isDateInvalid(date) {
                return isNaN(date.getTime());
            }
        }
    }
})();
