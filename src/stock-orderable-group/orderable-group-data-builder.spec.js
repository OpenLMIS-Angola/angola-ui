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

    angular
        .module('stock-orderable-group')
        .factory('OrderableGroupDataBuilder', OrderableGroupDataBuilder);

    OrderableGroupDataBuilder.$inject = ['OrderableDataBuilder', 'LotDataBuilder'];

    function OrderableGroupDataBuilder(OrderableDataBuilder, LotDataBuilder) {

        OrderableGroupDataBuilder.prototype.build = build;
        OrderableGroupDataBuilder.prototype.withOrderable = withOrderable;
        OrderableGroupDataBuilder.prototype.withStockOnHand = withStockOnHand;
        OrderableGroupDataBuilder.prototype.withUnit = withUnit;

        return OrderableGroupDataBuilder;

        function OrderableGroupDataBuilder() {
            this.orderable = new OrderableDataBuilder().build();
            this.lot = new LotDataBuilder().build();
            this.stockOnHand = 10;
            this.unitOfOrderable = {
                id: '123'
            };
        }

        function build() {
            return [{
                orderable: this.orderable,
                lot: this.lot,
                stockOnHand: this.stockOnHand
            }, {
                orderable: this.orderable,
                stockOnHand: this.stockOnHand
            }];
        }

        function withOrderable(orderable) {
            this.orderable = orderable;
            return this;
        }

        function withStockOnHand(stockOnHand) {
            this.stockOnHand = stockOnHand;
            return this;
        }

        function withUnit(unitId) {
            this.unitOfOrderable = {
                id: unitId
            };

            return this;
        }
    }
})();
