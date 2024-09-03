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

describe('ShipmentViewLineItem', function() {

    var shipmentViewLineItem, ShipmentViewLineItem, OrderableDataBuilder, orderable;

    beforeEach(function() {
        module('shipment-view');

        inject(function($injector) {
            ShipmentViewLineItem = $injector.get('ShipmentViewLineItem');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        orderable = new OrderableDataBuilder()
            .withNetContent(5)
            .buildJson();

        shipmentViewLineItem = new ShipmentViewLineItem(orderable);
    });

    describe('constructor', function() {

        it('should set net content', function() {
            var result = new ShipmentViewLineItem(orderable);

            expect(result.netContent).toEqual(orderable.netContent);
        });

    });

    describe('getRemainingSoh', function() {

        beforeEach(function() {
            spyOn(shipmentViewLineItem, 'getAvailableSoh');
            spyOn(shipmentViewLineItem, 'getFillQuantity');
        });

        it('should return quantity in packs by default', function() {
            shipmentViewLineItem.getAvailableSoh.andReturn(160);
            shipmentViewLineItem.getFillQuantity.andReturn(33);

            var result = shipmentViewLineItem.getRemainingSoh();

            expect(result).toEqual(127);
        });
    });

    describe('getOrderQuantity', function() {

        it('should return 0 if order quantity is equal to zero', function() {
            var lineItem = new ShipmentViewLineItem({
                orderQuantity: 0,
                lineItems: []
            });

            var result = lineItem.getOrderQuantity(false);

            expect(result).toBe(0);
        });

        it('should return undefined if order quantity is undefined', function() {
            var lineItem = new ShipmentViewLineItem({
                lineItems: []
            });

            var result = lineItem.getOrderQuantity(false);

            expect(result).toBeUndefined();
        });

        it('should return undefined if order quantity is null', function() {
            var lineItem = new ShipmentViewLineItem({
                orderQuantity: null,
                lineItems: []
            });

            var result = lineItem.getOrderQuantity(false);

            expect(result).toBeUndefined();
        });

    });

});