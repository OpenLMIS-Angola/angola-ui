(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-table.controller:OpenlmisTableController      *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .controller('OpenlmisTableController', openlmisTableController);

    openlmisTableController.$inject = [];

    function openlmisTableController() {
        var $ctrl = this;

        $ctrl.$onInit = function() {
            $ctrl.elementsConfiguration = $ctrl.getElementsConfiguration();
        };

        $ctrl.getElementsConfiguration = function() {
            var elementsConfiguration = [];
            $ctrl.tableConfig.data.forEach(function(item) {
                elementsConfiguration.push(getSingleRowConfig(item));
            });
            return elementsConfiguration;
        };

        function getSingleRowConfig(item) {
            return $ctrl.tableConfig.columns.map(function(column) {
                return {
                    propertyPath: column.propertyPath,
                    value: getElementPropertyValue(item, column.propertyPath),
                    template: column.template
                };
            });
        }

        function getElementPropertyValue(obj, propertyPath) {
            var keys = propertyPath.split('.');
            var value = obj;
            for (var i = 0; i < keys.length; i++) {
                value = value[keys[i]];
            }
            return value;
        }

        $ctrl.getElementConfig = function(elementProperty, $index) {
            return {
                propertyPath: elementProperty.propertyPath,
                value: $ctrl.tableConfig.data[$index][elementProperty.propertyPath],
                template: elementProperty.template,
                tableItemName: $ctrl.tableConfig.tableItemName
            };
        };
    }

})();
