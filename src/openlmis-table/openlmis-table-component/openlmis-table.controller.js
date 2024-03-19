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
        .controller('OpenlmisTableController', OpenlmisTableController);

    OpenlmisTableController.$inject = ['openlmisTableService', 'openlmisTableSortingService'];

    function OpenlmisTableController(openlmisTableService, openlmisTableSortingService) {
        var $ctrl = this;
        $ctrl.sortTable = sortTable;
        $ctrl.$onInit = onInit;

        function onInit() {
            openlmisTableSortingService.prepareHeadersClasses($ctrl.tableConfig.columns);
            $ctrl.elementsConfiguration = openlmisTableService.getElementsConfiguration($ctrl.tableConfig);
        }

        function sortTable(chosenColumn) {
            openlmisTableSortingService.sortTable($ctrl.tableConfig.columns, chosenColumn);
        }
    }
})();
