(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .constant('TABLE_CONSTANTS', tableConstants());

    function tableConstants() {
        return {
            actionTypes: {
                REDIRECT: 'REDIRECT',
                CLICK: 'CLICK',
                DOWNLOAD: 'DOWNLOAD'
            },
            defaultDisplayActionFunction: function() {
                return true;
            }
        };
    }
})();
