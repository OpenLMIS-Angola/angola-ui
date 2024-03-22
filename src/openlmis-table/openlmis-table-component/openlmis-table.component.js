/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc component
     * @name openlmis-table.component:openlmisTable
     *
     * @description
     * Component responsible for displaying a table
     *
     * @param {TableConfig} tableConfig specifies what columns, actions, header, etc. will the table have
     * @typedef {Object} TableConfig
     * @property {string} caption - Caption for the table.
     * @property {boolean} displayCaption - Whether to display the caption based on the availability of facilities.
     * @property {Array.<ColumnConfig>} columns - Array of column configurations.
     * @property {ActionsConfig} actions - Configuration for table actions.
     * @property {Array.<Object>} data - Array of facility data to be displayed in the table.
     *
     * Configuration for a single column in the table.
     *
     * @typedef {Object} ColumnConfig
     * @property {string} header - Header text for the column.
     * @property {string} propertyPath - Property path to extract data for the column object.
     * @property {string|function} [template] - Optional template to customize the display of data in the column.
     * @property {string} classes - additional CSS classes which should be applied to the column header
     * It can be either string like this:
     * @example
     * 'item.name - item.code'
     * IMPORTANT: for string template we have to always
     * write item.{property}. Anything else will be displayed as string. So for example 'facility.name' won't work!
     * If we decide to use function which is more flexible solution we have to declare it like that:
     * @example
     * template: function(item) {
     *  return item.name + '-' + item.code
     * }
     * For any complex templates use function
     *
     * Configuration for table actions.
     *
     * @typedef {Object} ActionsConfig
     * @property {string} header - Header text for the actions column.
     * @property {Array.<Action>} data - Array of action data objects.
     *
     * Data object defining an action for the table.
     *
     * @typedef {Object} Action
     * @property {string} type - Type of action. Possible values: 'REDIRECT', 'CLICK', 'DOWNLOAD'
     * @property {function} redirectLink - Function which will be passed to ui-serf property. Needed only for
     *  'REDIRECT' action
     * @property {string} text - Text to be displayed for the action.
     * @property {function} displayAction - based on some item property decides should the action be displayed.
     *  If not passed action will be displayed
     * @property {string} classes - CSS classes which should be applied to the button
     *
     * @example
     * for action config like this:
     * {
            type: TABLE_CONSTANTS.actionTypes.CLICK,
            displayAction: function(item) {
                return item.status === ORDER_STATUSES.CREATING;
            },
            classes: 'order-edit primary',
            onClick: function(item) {
                vm.redirectToOrderEdit(item.id);
            },
            text: 'orderView.edit'
        }
        we will get the following result:
        <button class='order-edit primary'
            ng-if='$ctrl.actionConfig.displayAction($ctrl.item)'
            ng-click='$ctrl.actionConfig.onClick($ctrl.item)></button>
    */
    angular
        .module('openlmis-table')
        .component('openlmisTable', {
            templateUrl: 'openlmis-table/openlmis-table-component/openlmis-table.html',
            bindings: {
                tableConfig: '<?'
            },
            controller: 'OpenlmisTableController',
            controllerAs: '$ctrl'
        });
})();
