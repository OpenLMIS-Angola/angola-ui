(function() {
    'use strict';

    angular
        .module('openlmis-home-alerts-panel')
        .component('openlmisHomeAlertsPanel', {
            bindings: {},
            controller: 'openlmisHomeAlertsPanelController',
            controllerAs: '$ctrl',
            templateUrl: 'openlmis-home-alerts-panel/openlmis-home-alerts-panel.html'
        });
}());
