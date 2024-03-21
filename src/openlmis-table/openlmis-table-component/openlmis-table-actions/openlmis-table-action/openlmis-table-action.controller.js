(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-table.controller:OpenlmisTableActionController      *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .controller('OpenlmisTableActionController', OpenlmisTableActionController);

    OpenlmisTableActionController.$inject = ['TABLE_CONSTANTS'];

    function OpenlmisTableActionController(TABLE_CONSTANTS) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            if (typeof $ctrl.actionConfig.displayAction === 'undefined') {
                $ctrl.actionConfig.displayAction = TABLE_CONSTANTS.defaultDisplayActionFunction;
            }
            if (typeof $ctrl.actionConfig.classes === 'undefined') {
                $ctrl.actionConfig.classes = '';
            }
        }
    }
})();
