(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .directive('openlmisTableSortable', directive);

    directive.$inject = ['$timeout', 'OPENLMIS_TABLE_SORTABLE', 'openlmisTableSortableService'];

    function directive($timeout, OPENLMIS_TABLE_SORTABLE, openlmisTableSortableService) {
        var directive = {
            link: link,
            restrict: 'C',
            priority: 10
        };
        return directive;

        /*
            TODO:
            - find out what to do when there is different header name than the property
            - persist the sorting when page is changed
        */

        function link(scope, element) {
            var propertiesSortingOrder = {};
            var properties = [];
            var header = element.find('thead tr');
            var arrayName = '';
            var headerElements = Array.from(header.children());
            $timeout(function() {
                arrayName = openlmisTableSortableService.getArrayName(element);
                headerElements.forEach(function(child) {
                    var headerElement = angular.element(child);
                    var headerTextContent = openlmisTableSortableService.toCamelCase(headerElement.text());
                    properties.push(headerTextContent);
                    headerElement.on('click', function() {
                        scope.$apply(function() {
                            sortTableBy(headerTextContent);
                        });
                    });
                });
                openlmisTableSortableService.setupPropertiesSortingOrder(properties, propertiesSortingOrder);
            });

            function sortTableBy(propertyToOrder) {
                var tbody = $(angular.element.find('tbody'));
                var tableScope = tbody.scope();
                var array = tableScope.vm[arrayName];
                openlmisTableSortableService.
                    sortArrayAccordingToPropertyType(array, propertyToOrder, propertiesSortingOrder, headerElements);
            }
        }
    }
})();
