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

describe('LotListController', function() {

    beforeEach(function() {
        module('admin-lot-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');

            this.LotDataBuilder = $injector.get('LotDataBuilder');
        });

        this.lots = [
            new this.LotDataBuilder().build(),
            new this.LotDataBuilder().build()
        ];

        // ANGOLASUP-715: Filtering by lot code
        this.lotsList = [
            new this.LotDataBuilder().build(),
            new this.LotDataBuilder().build(),
            new this.LotDataBuilder().build()
        ];
        // ANGOLASUP-715: Ends here

        this.orderables = [
            {
                id: '1',
                fullProductName: 'Option 1'
            }
        ];

        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('LotListController', {
            lots: this.lots,
            orderables: this.orderables,
            // ANGOLASUP-715: Filtering by lot code
            lotsList: this.lotsList,
            // ANGOLASUP-715: Ends here
            $stateParams: this.stateParams
        });

        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(typeof this.vm.search).toBe('function');
        });

        it('should expose lots array', function() {
            expect(this.vm.lots).toEqual(this.lots);
        });

        it('should expose orderables', function() {
            expect(this.vm.orderables).toEqual(this.orderables);
        });
    });

    describe('search', function() {

        it('should set orderableId param', function() {
            this.vm.orderableId = 'abcd';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.lots', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                orderableId: 'abcd'
            }, {
                reload: true
            });
        });

        it('should set lotCode param', function() {
            this.vm.lotCode = 'abcd';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.lots', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                lotCode: 'abcd'
            }, {
                reload: true
            });
        });

        it('should set expirationDate range params', function() {
            this.vm.expirationDateFrom = '1970-01-01';
            this.vm.expirationDateTo = '1970-01-02';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.lots', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                expirationDateFrom: '1970-01-01',
                expirationDateTo: '1970-01-02'
            }, {
                reload: true
            });
        });

    });
});
