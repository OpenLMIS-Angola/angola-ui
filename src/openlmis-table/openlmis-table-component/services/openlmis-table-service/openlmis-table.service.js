(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .service('openlmisTableService', openlmisTableService);

    openlmisTableService.$inject = [];

    function openlmisTableService() {
        return {
            getElementsConfiguration: getElementsConfiguration,
            getElementPropertyValue: getElementPropertyValue
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
                    template: column.template,
                    item: item
                };
            });
        }

        function getElementPropertyValue(obj, propertyPath) {
            if (!obj) {
                return undefined;
            }

            var keys = propertyPath.split('.');
            var value = obj;
            for (var i = 0; i < keys.length; i++) {
                if (value === undefined || value === null) {
                    return undefined;
                }
                value = value[keys[i]];
            }
            return value;
        }
    }
})();
