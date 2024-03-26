(function() {
    'use strict';

    angular
        .module('openlmis-home-alerts-panel')
        .controller('openlmisHomeAlertsPanelController', controller);

    controller.$inject = ['openlmisHomeAlertsPanelService'];

    function controller(openlmisHomeAlertsPanelService) {
        var $ctrl = this;
        $ctrl.requisitionsStatusesStats = undefined;
        $ctrl.ordersStatusesStats = undefined;
        $ctrl.requisitionsToBeCreated = undefined;

        $ctrl.$onInit = onInit;

        /*
         * {
                "facilityId": "71f77cac-fe68-4a07-856e-e85bd210f828",
                "requisitionsToBeCreated": 2,
                "statusesStats": {
                    "RELEASED_WITHOUT_ORDER": 0,
                    "RELEASED": 0,
                    "IN_APPROVAL": 0,
                    "SKIPPED": 0,
                    "INITIATED": 1,
                    "SUBMITTED": 0,
                    "APPROVED": 0,
                    "AUTHORIZED": 3,
                    "REJECTED": 0
                }
            }
         *
        * */
        function onInit() {
            openlmisHomeAlertsPanelService.getRequisitionsStatusesData()
                .then(function(requisitionsData) {
                    $ctrl.requisitionsStatusesStats = requisitionsData.statusesStats;
                    $ctrl.requisitionsToBeCreated = requisitionsData.requisitionsToBeCreated;
                });

            openlmisHomeAlertsPanelService.getOrdersStatusesData()
                .then(function(ordersData) {
                    $ctrl.ordersStatusesStats = ordersData.statusesStats;
                });
        }
    }
})();
