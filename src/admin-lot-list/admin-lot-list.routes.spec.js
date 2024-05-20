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

describe('openlmis.administration.lot state', function() {

    'use strict';

    beforeEach(function() {
        module('admin-lot-list');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.$templateCache = $injector.get('$templateCache');
            this.$stateParams = $injector.get('$stateParams');

            this.orderableService = $injector.get('orderableService');
            this.lotService = $injector.get('lotService');

            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.LotDataBuilder = $injector.get('LotDataBuilder');
        });

        this.orderableWithTradeItem = new this.OrderableDataBuilder().build();
        this.orderableWithTradeItem.identifiers = {
            tradeItem: 'tradeItem'
        };
        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build()
        ];

        spyOn(this.orderableService, 'search').andReturn(this.$q.when(
            new this.PageDataBuilder()
                .withContent(this.orderables)
                .build()
        ));

        this.defaultLot = new this.LotDataBuilder().build();

        spyOn(this.lotService, 'query').andReturn(this.$q.when(
            new this.PageDataBuilder()
                .withContent([this.defaultLot])
                .build()
        ));

        this.$state.go('openlmis');
        this.$rootScope.$apply();

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    it('should be available under /administration/lots URL', function() {
        expect(this.$state.current.name).not.toEqual('openlmis.administration.lots');

        this.goToUrl('/administration/lots');

        expect(this.$state.current.name).toEqual('openlmis.administration.lots');
    });

    it('should use html template', function() {
        spyOn(this.$templateCache, 'get').andCallThrough();

        this.goToUrl('/administration/lots');

        expect(this.$templateCache.get).toHaveBeenCalledWith('admin-lot-list/lot-list.html');
    });

    it('should resolve orderables', function() {
        this.goToUrl('/administration/lots');

        expect(this.$state.current.name).toEqual('openlmis.administration.lots');
        expect(this.getResolvedValue('orderables')).toEqual(this.orderables);
        expect(this.orderableService.search).toHaveBeenCalled();
    });

    it('should resolve non-empty paginatedLots when orderableId filter is empty ', function() {
        this.goToUrl('/administration/lots');

        var paginatedLots = this.getResolvedValue('paginatedLots');

        expect(paginatedLots.length).toNotEqual(0);
    });

    it('should resolve non-empty paginatedLots when expirationDateFrom filter is set ', function() {
        var lot = new this.LotDataBuilder().build();
        this.lotService.query.andReturn(this.$q.when({
            content: [lot]
        }));

        this.goToUrl('/administration/lots?expirationDateFrom=1970-01-01');

        var paginatedLots = this.getResolvedValue('paginatedLots');

        expect(this.lotService.query).toHaveBeenCalledWith({
            page: 0,
            size: 10,
            tradeItemIdIgnored: true,
            expirationDateFrom: '1970-01-01'
        });

        expect(paginatedLots.length).toEqual(1);
        expect(paginatedLots[0]).toEqual(lot);
    });

    it('should resolve non-empty paginatedLots when expirationDateTo filter is set ', function() {
        var lot = new this.LotDataBuilder().build();
        this.lotService.query.andReturn(this.$q.when({
            content: [lot]
        }));

        this.goToUrl('/administration/lots?expirationDateTo=1970-01-01');

        var paginatedLots = this.getResolvedValue('paginatedLots');

        expect(this.lotService.query).toHaveBeenCalledWith({
            page: 0,
            size: 10,
            tradeItemIdIgnored: true,
            expirationDateTo: '1970-01-01'
        });

        expect(paginatedLots.length).toEqual(1);

        expect(paginatedLots[0]).toEqual(lot);
    });

    it('should resolve lots ', function() {
        var orderableWithTradeItem = new this.OrderableDataBuilder().build();
        orderableWithTradeItem.identifiers = {
            tradeItem: 'tradeItem'
        };

        this.orderableService.search.andReturn(this.$q.when(
            new this.PageDataBuilder()
                .withContent([orderableWithTradeItem])
                .build()
        ));

        var lotWithMatchingOrderable = new this.LotDataBuilder().build();
        lotWithMatchingOrderable.tradeItemId = 'tradeItem';

        this.lotService.query.andReturn(this.$q.when({
            content: [
                lotWithMatchingOrderable,
                new this.LotDataBuilder().build()
            ]
        }));

        this.goToUrl('/administration/lots');

        var lots = this.getResolvedValue('lots');

        expect(lots.length).toEqual(2);
    });

});
