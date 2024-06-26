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

describe('orderableGroupService', function() {

    var $q, $rootScope, service, stockCardRepositoryMock, stockCardSummaries;

    beforeEach(function() {
        stockCardRepositoryMock = jasmine.createSpyObj('stockCardSummaryRepository', ['query']);
        module('stock-orderable-group', function($provide) {
            $provide.factory('StockCardSummaryRepository', function() {
                return function() {
                    return stockCardRepositoryMock;
                };
            });
        });
        module('referencedata');
        module('referencedata-orderable');
        module('referencedata-lot');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            service = $injector.get('orderableGroupService');
            this.StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            this.CanFulfillForMeEntryDataBuilder = $injector.get('CanFulfillForMeEntryDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.LotDataBuilder = $injector.get('LotDataBuilder');
            this.OrderableChildrenDataBuilder = $injector.get('OrderableChildrenDataBuilder');
            this.OrderableGroupDataBuilder = $injector.get('OrderableGroupDataBuilder');
            this.orderableGroupService = $injector.get('orderableGroupService');
        });

        this.lot1 = {
            id: 'lot id 1',
            expirationDate: '2022-05-08'
        };
        this.lot2 = {
            id: 'lot id 2',
            expirationDate: '2019-01-20'
        };
        this.lot3 = {
            id: 'lot id 3',
            expirationDate: '2018-04-03'
        };

        this.item1 = {
            orderable: {
                id: 'a'
            },
            lot: this.lot1
        };
        this.item2 = {
            orderable: {
                id: 'a'
            }
        };
        this.item3 = {
            orderable: {
                id: 'b'
            }
        };
        this.item4 = {
            orderable: {
                id: 'a'
            },
            lot: this.lot2
        };
        this.item5 = {
            orderable: {
                id: 'a'
            },
            lot: this.lot3
        };
        this.items = [this.item1, this.item2, this.item3];

        this.kitConstituents = [
            new this.OrderableChildrenDataBuilder().withId('child_product_1_id')
                .withQuantity(30)
                .buildJson()
        ];
        this.orderable = new this.OrderableDataBuilder().withChildren(this.kitConstituents)
            .buildJson();
        this.kitOrderableGroup = new this.OrderableGroupDataBuilder().withOrderable(this.orderable)
            .build();
        this.orderableGroups = [
            new this.OrderableGroupDataBuilder().withOrderable(
                new this.OrderableDataBuilder().withChildren([])
                    .buildJson()
            )
                .build(),
            new this.OrderableGroupDataBuilder().withOrderable(this.orderable)
                .build()
        ];

    });

    it('should group items by orderable id', function() {
        expect(this.orderableGroupService.groupByOrderableId(this.items)).toEqual([
            [this.item1, this.item2],
            [this.item3]
        ]);
    });

    it('should find item in group by lot', function() {
        expect(this.orderableGroupService.findByLotInOrderableGroup(this.items, this.lot1)).toBe(this.item1);
    });

    it('should find item in group by NULL lot', function() {
        expect(this.orderableGroupService.findByLotInOrderableGroup(this.items, null)).toBe(this.item2);
    });

    it('should find item with new lot', function() {
        var newLot = new this.LotDataBuilder().build(),
            newItem = this.item2;
        newItem.lot = newLot;
        newItem.stockOnHand = 0;

        expect(this.orderableGroupService.findByLotInOrderableGroup(this.items, newLot)).toBe(newItem);
    });

    it('should find lots in orderable group', function() {
        //given
        var group = [this.item1, this.item2];

        //when
        var lots = service.lotsOf(group);

        // ANGOLASUP-516: Removed the 'No Lot Defined' option
        expect(lots[0]).toEqual(this.lot1);
        expect(lots[0].expirationDate.toString())
            .toEqual('Sun May 08 2022 00:00:00 GMT+0000 (Coordinated Universal Time)');
    });

    it('should return kit only orderableGroups', function() {
        var item = service.getKitOnlyOrderablegroup(this.orderableGroups);

        expect(item).toEqual([this.orderableGroups.pop()]);

    });

    describe('findAvailableProductsAndCreateOrderableGroups', function() {
        beforeEach(function() {
            prepareStockCardSummaries(
                new this.StockCardSummaryDataBuilder().build(),
                new this.StockCardSummaryDataBuilder().build()
            );

            this.lots = [
                new this.LotDataBuilder().withTradeItemId('trade-item-id-1')
                    .build(),
                new this.LotDataBuilder().withTradeItemId('trade-item-id-2')
                    .build()
            ];
        });

        it('should query stock card summaries', function() {
            service.findAvailableProductsAndCreateOrderableGroups('program-id', 'facility-id', false);

            expect(stockCardRepositoryMock.query).toHaveBeenCalledWith({
                programId: 'program-id',
                facilityId: 'facility-id'
            });
        });

        it('should create orderable groups from canFulfillForMe', function() {
            var orderableGroups = findAvailableProductsAndCreateOrderableGroups(false);

            expect(orderableGroups.length).toBe(2);
            orderableGroupElementEquals(orderableGroups[0][0], stockCardSummaries[0].canFulfillForMe[0]);
            orderableGroupElementEquals(orderableGroups[1][0], stockCardSummaries[1].canFulfillForMe[0]);
        });

        it('should create orderable groups from approved products', function() {
            var orderableOne = new this.OrderableDataBuilder()
                    .withIdentifiers({
                        tradeItem: 'trade-item-id-1'
                    })
                    .build(),
                orderableTwo = new this.OrderableDataBuilder()
                    .withIdentifiers({
                        tradeItem: 'trade-item-id-2'
                    })
                    .build();

            var stockCardSummaryOne = new this.StockCardSummaryDataBuilder()
                .withOrderable(orderableOne)
                .withCanFulfillForMe([
                    new this.CanFulfillForMeEntryDataBuilder()
                        .withoutLot()
                        .withOrderable(orderableOne)
                        .buildJson(),
                    new this.CanFulfillForMeEntryDataBuilder()
                        .withLot(this.lots[0])
                        .withOrderable(orderableOne)
                        .buildJson()
                ])
                .build();
            var stockCardSummaryTwo = new this.StockCardSummaryDataBuilder()
                .withOrderable(orderableTwo)
                .withCanFulfillForMe([
                    new this.CanFulfillForMeEntryDataBuilder()
                        .withoutLot()
                        .withOrderable(orderableTwo)
                        .buildJson(),
                    new this.CanFulfillForMeEntryDataBuilder()
                        .withLot(this.lots[1])
                        .withOrderable(orderableTwo)
                        .buildJson()
                ])
                .build();
            prepareStockCardSummaries(stockCardSummaryOne, stockCardSummaryTwo);

            var orderableGroups = findAvailableProductsAndCreateOrderableGroups(true);

            expect(orderableGroups.length).toBe(2);
            orderableGroupElementEqualsNoLot(orderableGroups[0][0], stockCardSummaryOne);
            orderableGroupElementEqualsNoLot(orderableGroups[1][0], stockCardSummaryTwo);
            orderableGroupElementEqualsWithLot(orderableGroups[0][1], stockCardSummaryOne, this.lots[0]);
            orderableGroupElementEqualsWithLot(orderableGroups[1][1], stockCardSummaryTwo, this.lots[1]);
        });

        function prepareStockCardSummaries(stockCardSummaryOne, stockCardSummaryTwo) {
            stockCardSummaries = [
                stockCardSummaryOne,
                stockCardSummaryTwo
            ];
            stockCardRepositoryMock.query.andReturn($q.when({
                content: stockCardSummaries
            }));
        }

        function findAvailableProductsAndCreateOrderableGroups(includeApprovedProducts) {
            var orderableGroups;
            service
                .findAvailableProductsAndCreateOrderableGroups('program-id', 'facility-id', includeApprovedProducts)
                .then(function(response) {
                    orderableGroups = response;
                });
            $rootScope.$apply();
            return orderableGroups;
        }

        function orderableGroupElementEquals(orderableGroupElement, expected) {
            expect(orderableGroupElement.orderable).toEqual(expected.orderable);
            expect(orderableGroupElement.lot).toEqual(expected.lot);
            expect(orderableGroupElement.stockOnHand).toEqual(expected.stockOnHand);
        }

        function orderableGroupElementEqualsNoLot(orderableGroupElement, expected) {
            expect(orderableGroupElement.orderable).toEqual(expected.orderable);
            expect(orderableGroupElement.stockOnHand).toEqual(expected.stockOnHand);
            expect(orderableGroupElement.lot).toBe(null);
        }

        function orderableGroupElementEqualsWithLot(orderableGroupElement, expected, lot) {
            expect(orderableGroupElement.orderable).toEqual(expected.orderable);
            expect(orderableGroupElement.stockOnHand).toEqual(expected.stockOnHand);
            expect(orderableGroupElement.lot).toEqual(lot);
        }

    });

});
