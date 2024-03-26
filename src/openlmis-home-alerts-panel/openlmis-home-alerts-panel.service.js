(function () {
    'use strict';

    angular
        .module('openlmis-home-alerts-panel')
        .service('openlmisHomeAlertsPanelService', openlmisHomeAlertsPanelService);

    openlmisHomeAlertsPanelService.$inject = ['$resource', 'referencedataUrlFactory'];

    function openlmisHomeAlertsPanelService($resource, referencedataUrlFactory) {
        var requisitionStatusesResource = $resource(referencedataUrlFactory(' /api/requisitions/statusesStatsData'));
        var orderStatusesResource = $resource(referencedataUrlFactory(' /api/orders/statusesStatsData -'));

        return {
            getRequisitionsStatusesData: getRequisitionsStatusesData,
            getOrdersStatusesData: getOrdersStatusesData
        }

        function getRequisitionsStatusesData() {
            return requisitionStatusesResource.get().$promise;
        }

        function getOrdersStatusesData() {
            return orderStatusesResource.get().$promise;
        }
    }
})();
