(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-table.controller:OpenlmisTableActionsController      *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .controller('OpenlmisTableActionsController', OpenlmisTableActionsController);

    OpenlmisTableActionsController.$inject = [];

    function OpenlmisTableActionsController() {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            $ctrl.actionsConfig.data.forEach(function(action) {
                action.item = $ctrl.item;
            });
        }
    }
})();
