(function () {
    'use strict';

    angular
        .module('openlmis-table')
        .directive('openlmisTableSortable', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            compile: compile,
            restrict: 'C',
            priority: 10,
            require: 'openlmisTableSortable'
        };
        return directive;
    }

    function compile(element) {
        var header = element.find('thead tr');
        header.children().each(function () {
            var child = angular.element(this);
            child.on('click', function () {
                console.log('Clicked on:', child.text());
            });
        });
        return link;
    }

    function link(scope, element) {
        console.log(element);
    }

})();
