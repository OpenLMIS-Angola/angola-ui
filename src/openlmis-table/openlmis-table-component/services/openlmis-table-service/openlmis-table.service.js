(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .service('openlmisTableService', openlmisTableService);

    openlmisTableService.$inject = [];

    function openlmisTableService() {
        return {
            getElementsConfiguration: getElementsConfiguration
        };

        function getElementsConfiguration(tableConfig) {
            var elementsConfiguration = [];
            tableConfig.data.forEach(function(item) {
                elementsConfiguration.push(getSingleRowConfig(tableConfig.columns, item));
            });
            return elementsConfiguration;
        }

        function getSingleRowConfig(tableColumns, item) {
            return tableColumns.map(function(column) {
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
    }
})();
