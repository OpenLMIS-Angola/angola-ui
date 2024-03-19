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
        $ctrl.REDIRECT_TYPE = TABLE_CONSTANTS.actionTypes.REDIRECT;
        $ctrl.DOWNLOAD_TYPE = TABLE_CONSTANTS.actionTypes.DOWNLOAD;
        $ctrl.CLICK_TYPE = TABLE_CONSTANTS.actionTypes.CLICK;

        $ctrl.$onInit = onInit;

        function onInit() {
            if (typeof $ctrl.actionConfig.displayItem === 'undefined') {
                $ctrl.actionConfig.displayAction = TABLE_CONSTANTS.defaultDisplayActionFunction;
            }
            if (typeof $ctrl.actionConfig.classes === 'undefined') {
                $ctrl.actionConfig.classes = '';
            }
        }
    }
})();
