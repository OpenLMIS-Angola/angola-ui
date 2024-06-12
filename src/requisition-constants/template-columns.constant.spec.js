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

describe('TEMPLATE_COLUMNS', function() {

    var TEMPLATE_COLUMNS;

    beforeEach(function() {

        module('requisition-constants');

        inject(function($injector) {
            TEMPLATE_COLUMNS = $injector.get('TEMPLATE_COLUMNS');
        });
    });

    describe('getStockBasedColumns', function() {

        it('should return list of stock based columns', function() {
            var returnedList = TEMPLATE_COLUMNS.getStockBasedColumns();

            expect(returnedList[0]).toEqual('beginningBalance');
            expect(returnedList[1]).toEqual('stockOnHand');
            expect(returnedList[2]).toEqual('totalLossesAndAdjustments');
            expect(returnedList[3]).toEqual('totalConsumedQuantity');
            expect(returnedList[4]).toEqual('totalReceivedQuantity');
            expect(returnedList[5]).toEqual('totalStockoutDays');
            expect(returnedList[6]).toEqual('averageConsumption');
        });
    });

    describe('getColumnsToBeBlockedIfQuarantined', function() {

        it('should return a list of columns to be blocked if quarantined', function() {
            var listOfColumns = TEMPLATE_COLUMNS.getColumnsToBeBlockedIfQuarantined();

            expect(listOfColumns[0]).toEqual('requestedQuantityExplanation');
            expect(listOfColumns[1]).toEqual('requestedQuantity');
        });
    });
});
