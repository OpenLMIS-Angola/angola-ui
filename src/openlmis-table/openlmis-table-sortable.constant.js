(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .constant('OPENLMIS_TABLE_SORTABLE', openlmisTableSortable());

    function openlmisTableSortable() {
        return {
            SORT_ASC_CLASSS: 'sorted-ascending',
            SORT_DESC_CLASSS: 'sorted-descending'
        };
    }
})();
