(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .constant('SORTING_SERVICE_CONSTANTS', sortingServiceConstants());

    function sortingServiceConstants() {
        return {
            SORT_ASC_CLASS: 'sorted-ascending',
            SORT_DESC_CLASS: 'sorted-descending',
            ASC: 'asc',
            DESC: 'desc'
        };
    }
})();
