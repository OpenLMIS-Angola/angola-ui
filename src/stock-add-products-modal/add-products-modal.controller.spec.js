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

describe('AddProductsModalController', function() {

    beforeEach(function() {
        module('stock-add-products-modal');
        module('referencedata-orderable');
        module('referencedata');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.LotDataBuilder = $injector.get('LotDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');

            this.deferred = this.$q.defer();
            this.scope = this.$rootScope.$new();

            spyOn(this.scope, '$broadcast').andCallThrough();

            this.orderable = new this.OrderableDataBuilder()
                .withIdentifiers({
                    tradeItem: 'trade-item-id-1'
                })
                .build();
            this.lot = new this.LotDataBuilder().build();

            this.item1 = {
                orderable: this.orderable,
                lot: this.lot
            };

            this.scope.productForm = jasmine.createSpyObj('productForm', ['$setUntouched', '$setPristine']);

            this.vm = this.$controller('AddProductsModalController', {
                items: [this.item1],
                hasLot: true,
                modalDeferred: this.deferred,
                $scope: this.scope,
                addMissingLotAllowed: true
            });
        });
    });

    it('should NOT add if select box is empty', function() {
        //given
        //do nothing here, to simulate that select box is empty

        //when
        this.vm.addOneProduct();

        //then
        expect(this.vm.addedItems).toEqual([]);
    });

    it('should NOT add twice if selected item already added', function() {
        //given
        this.vm.selectedOrderableGroup = [this.item1];
        this.vm.selectedLot = this.item1.lot;

        this.vm.addedItems = [this.item1];
        //when
        this.vm.addOneProduct();

        //then
        //only appear once, not twice
        expect(this.vm.addedItems).toEqual([this.item1]);
    });

    it('should add if selected item not added yet', function() {
        //given
        this.vm.selectedOrderableGroup = [this.item1];
        this.vm.selectedLot = this.item1.lot;

        this.vm.addedItems = [];

        //when
        this.vm.addOneProduct();

        //then
        expect(this.vm.addedItems).toEqual([this.item1]);
    });

    it('should add if missing lot provided', function() {
        this.vm.selectedOrderableGroup = [this.item1];
        this.vm.newLotCode = 'NewLot001';

        this.vm.addedItems = [];

        var newLot = {
            lotCode: this.vm.newLotCode,
            expirationDate: this.vm.newExpirationDate,
            tradeItemId: this.vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem,
            active: true
        };

        this.vm.addOneProduct();

        expect(this.vm.addedItems).toEqual([{
            orderable: this.vm.selectedOrderableGroup[0].orderable,
            lot: newLot,
            displayLotMessage: 'NewLot001'
        }]);
    });

    it('should remove added product and reset its quantity value', function() {
        //given
        var item = {
            quantity: 123
        };
        this.vm.addedItems = [item];

        //when
        this.vm.removeAddedProduct(item);

        //then
        expect(item.quantity).not.toBeDefined();
        expect(this.vm.addedItems).toEqual([]);
    });

    it('should reset all item quantities and error messages when cancel', function() {
        //given
        var item1 = {
            quantity: 123,
            quantityInvalid: 'blah'
        };
        var item2 = {
            quantity: 456
        };
        this.vm.addedItems = [item1, item2];

        //when
        //pretend modal was closed by user
        this.deferred.reject();
        this.$rootScope.$apply();

        //then
        expect(item1.quantity).not.toBeDefined();
        expect(item1.quantityInvalid).not.toBeDefined();

        expect(item2.quantity).not.toBeDefined();
    });

    it('should assign error message when quantity missing', function() {
        //given
        var item1 = {
            quantity: undefined
        };

        //when
        this.vm.validate(item1);

        //then
        expect(item1.quantityInvalid).toBeDefined();
    });

    it('should remove error message when quantity filled in', function() {
        //given
        var item1 = {
            quantityInvalid: 'blah'
        };

        //when
        item1.quantity = 123;
        this.vm.validate(item1);

        //then
        expect(item1.quantityInvalid).not.toBeDefined();
    });

    it('should broadcast form submit when confirming', function() {
        this.vm.confirm();

        expect(this.scope.$broadcast).toHaveBeenCalledWith('openlmis-form-submit');
    });

    it('should confirm add products if all items have quantities', function() {
        //given
        var item1 = {
            quantity: 1
        };
        var item2 = {
            quantity: 2
        };
        this.vm.addedItems = [item1, item2];

        spyOn(this.deferred, 'resolve');

        //when
        this.vm.confirm();

        //then
        expect(this.deferred.resolve).toHaveBeenCalled();
    });

    it('should NOT confirm add products if some items have no quantity', function() {
        //given
        var item1 = {
            quantity: 1
        };
        var item2 = {
            quantity: undefined
        };
        this.vm.addedItems = [item1, item2];

        spyOn(this.deferred, 'resolve');

        //when
        this.vm.confirm();

        //then
        expect(this.deferred.resolve).not.toHaveBeenCalled();
    });

    describe('orderableSelectionChanged', function() {

        it('should unselect lot', function() {
            this.vm.selectedLot = this.vm.items[0].lot;

            this.vm.orderableSelectionChanged();

            expect(this.vm.selectedLot).toBe(null);
        });

        it('should clear new lot code', function() {
            this.vm.newLotCode = 'NewLot001';
            this.vm.orderableSelectionChanged();

            expect(this.vm.newLotCode).toBe(null);
        });

        it('should clear new lot expiration date', function() {
            this.vm.newExpirationDate = '2019-08-06';
            this.vm.orderableSelectionChanged();

            expect(this.vm.newExpirationDate).toBe(null);
        });

        it('should set canAddNewLot as false', function() {
            this.vm.canAddNewLot = true;
            this.vm.orderableSelectionChanged();

            expect(this.vm.canAddNewLot).toBeFalsy();
        });

        it('should clear form', function() {
            this.vm.selectedLot = this.vm.items[0].lot;

            this.vm.orderableSelectionChanged();

            expect(this.scope.productForm.$setPristine).toHaveBeenCalled();
            expect(this.scope.productForm.$setUntouched).toHaveBeenCalled();
        });

    });

    describe('lotChanged', function() {

        it('should clear new lot code', function() {
            this.vm.newLotCode = 'NewLot001';
            this.vm.lotChanged();

            expect(this.vm.newLotCode).toBe(null);
        });

        it('should clear new lot expiration date', function() {
            this.vm.newExpirationDate = '2019-08-06';
            this.vm.lotChanged();

            expect(this.vm.newExpirationDate).toBe(null);
        });

        it('should set canAddNewLot as true', function() {
            this.vm.selectedLot = this.vm.items[0].lot;
            this.vm.selectedLot.lotCode = 'orderableGroupService.addMissingLot';
            this.vm.lotChanged();

            expect(this.vm.canAddNewLot).toBeTruthy();
        });

        it('should set canAddNewLot as false', function() {
            this.vm.selectedLot = this.vm.items[0].lot;
            this.vm.lotChanged();

            expect(this.vm.canAddNewLot).toBeFalsy();
        });

    });

});