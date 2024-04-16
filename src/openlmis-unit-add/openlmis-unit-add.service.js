(function() {
    'use strict';

    angular
        .module('openlmis-unit-add')
        .service('openlmisUnitAddService', openlmisUnitAddService);

    openlmisUnitAddService.$inject = [];

    function openlmisUnitAddService() {
        return {
            save: save
        };

        function save() {
            console.log('Saving form');
        }
    }
})();