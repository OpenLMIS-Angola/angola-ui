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
     * @ngdoc service
     * @name requisition.LineItem
     *
     * @description
     * Responsible for adding required methods for line items.
     */
    angular
        .module('requisition')
        .factory('LineItem', lineItem);

    lineItem.$inject = ['calculationFactory', 'COLUMN_SOURCES', 'COLUMN_TYPES', 'TEMPLATE_COLUMNS', 'messageService'];

    function lineItem(calculationFactory, COLUMN_SOURCES, COLUMN_TYPES, TEMPLATE_COLUMNS, messageService) {

        LineItem.prototype.getFieldValue = getFieldValue;
        LineItem.prototype.updateFieldValue = updateFieldValue;
        LineItem.prototype.updateDependentFields = updateDependentFields;
        LineItem.prototype.canBeSkipped = canBeSkipped;
        LineItem.prototype.isNonFullSupply = isNonFullSupply;

        return LineItem;

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name LineItem
         *
         * @description
         * Adds needed properties and methods to line items based on it and requisition parent.
         *
         * @param {Object} lineItem Requisition line item to be updated
         * @param {Object} requisition Requisition that has given line item
         */
        function LineItem(lineItem, requisition) {
            angular.copy(lineItem, this);

            this.orderable = lineItem.orderable;
            this.stockAdjustments = lineItem.stockAdjustments;

            this.$errors = {};
            this.$program = this.orderable.$program ?
                this.orderable.$program :
                getProgramById(lineItem.orderable.programs, requisition.program.id);

            var newLineItem = this;
            requisition.template.getColumns(!this.$program.fullSupply).forEach(function(column) {
                newLineItem.updateFieldValue(column, requisition);
            });
        }

        function getFieldValue(name) {
            var value = this;
            if (name === 'pricePerPack') {
                name = '$program.pricePerPack';
            }

            angular.forEach(name.split('.'), function(property) {
                value =
                  property === 'productCode' && value.quarantined
                      ? value[property] +
                      ' [' +
                      messageService.get('requisition.quarantinedLabel') +
                      ']'
                      : value[property];
            });

            return value;
        }

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name updateFieldValue
         *
         * @description
         * Updates column value in the line item based on column type and source.
         *
         * @param {Object} column Requisition template column
         * @param {Object} requisition Requisition to which line item belongs
         */
        function updateFieldValue(column, requisition) {
            var fullName = column.name,
                object = getObject(this, fullName),
                propertyName = getPropertyName(column.name);

            if (object) {
                if (column.source === COLUMN_SOURCES.CALCULATED) {
                    object[propertyName] = calculationFactory[fullName] ?
                        calculationFactory[fullName](this, requisition) :
                        null;
                } else if (column.$type === COLUMN_TYPES.NUMERIC || column.$type === COLUMN_TYPES.CURRENCY) {
                    if (
                        Boolean(object.orderable.quarantined) &&
                        fullName === TEMPLATE_COLUMNS.APPROVED_QUANTITY
                    ) {
                        // If the orderable is quarantined, the approved quantity must be 0
                        object[propertyName] = 0;
                    }

                    checkIfNullOrZero(object[propertyName]);
                } else {
                    object[propertyName] = object[propertyName] ? object[propertyName] : '';
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name updateDependentFields
         *
         * @description
         * This field kicks off updating each of a columns dependancies. The
         * actual work done by the updateDependentFieldsHelper function, this
         * function just starts the process.
         *
         * @param {Object} column Requisition template column
         * @param {Object} requisition Requisition to which line item belongs
         */
        function updateDependentFields(column, requisition) {
            updateDependentFieldsHelper(this, column, requisition, []);
        }

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name updateDependentFieldsHelper
         *
         * @description
         * Recursively goes through a column's dependencies, updating their
         * values. All columns are only updated once, because of the updated
         * columns field that recursively tracks dependencies.
         *
         * @param {Object} lineItem Reference to the lineItem being updated
         * @param {Object} column Requisition template column
         * @param {Object} requisition Requisition to which line item belongs
         * @param {Array} updatedColumns Array of column names that have already been updated
         *
         */
        function updateDependentFieldsHelper(lineItem, column, requisition, updatedColumns) {

            // Protecting against circular dependencies, by keeping track of the
            // fields that we have already updated.
            if (updatedColumns.indexOf(column.name) >= 0) {
                return;
            }
            updatedColumns.push(column.name);

            // Update the dependencies for the column
            angular.forEach(requisition.template.columnsMap, function(dependantColumn) {
                var dependencies = [];
                if (dependantColumn.$dependencies && Array.isArray(dependantColumn.$dependencies)) {
                    dependencies = dependantColumn.$dependencies;
                }

                if (dependencies.indexOf(column.name) >= 0) {
                    lineItem.updateFieldValue(dependantColumn, requisition);
                    updateDependentFieldsHelper(lineItem, dependantColumn, requisition, updatedColumns);
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name canBeSkipped
         *
         * @description
         * Determines whether the line item from given requisition can be marked as skipped.
         *
         * @param {Object} requisition Requisition to which line item belongs
         * @return {Boolean} true if line item can be skipped
         */
        function canBeSkipped(requisition) {
            var result = true,
                lineItem = this,
                columns = requisition.template.getColumns(!this.$program.fullSupply);

            if (requisition.$isApproved() || requisition.$isReleased()) {
                return false;
            }

            columns.forEach(function(column) {
                if (isInputDisplayedAndNotEmpty(column, lineItem)) {
                    result = false;
                }
            });
            return result;
        }

        /**
         * @ngdoc method
         * @methodOf requisition.LineItem
         * @name isNonFullSupply
         *
         * @description
         * Determines whether line item is full or non full supply.
         *
         * @return  {Boolean}   true if line item is non full supply, false otherwise
         */
        function isNonFullSupply() {
            return !this.$program.fullSupply;
        }

        function isInputDisplayedAndNotEmpty(column, lineItem) {
            return column.$display
                && column.source === COLUMN_SOURCES.USER_INPUT
                && column.$type !== COLUMN_TYPES.BOOLEAN
                && !isEmpty(lineItem[column.name]);
        }

        function isEmpty(value) {
            return !value || !value.toString().trim();
        }

        function getProgramById(programs, programId) {
            var match;
            programs.forEach(function(program) {
                if (program.programId === programId) {
                    match = program;
                }
            });
            return match;
        }

        function getObject(from, path) {
            var object = from;
            if (path.indexOf('.') > -1) {
                var properties = path.split('.');
                properties.pop();
                properties.forEach(function(property) {
                    object = object[property];
                });
            }
            return object;
        }

        function getPropertyName(fullPath) {
            var id = fullPath.lastIndexOf('.');
            return id > -1 ? fullPath.substr(id) : fullPath;
        }

        function checkIfNullOrZero(value) {
            if (value === 0) {
                value = 0;
            } else if (value === null) {
                value = null;
            }
        }
    }

})();
