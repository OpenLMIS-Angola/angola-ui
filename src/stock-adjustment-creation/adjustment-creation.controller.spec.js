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

describe('StockAdjustmentCreationController', function() {

    var that;

    beforeEach(function() {

        that = this;

        module('stock-adjustment-creation');

        inject(function($injector) {
            that.q = $injector.get('$q');
            that.rootScope = $injector.get('$rootScope');
            that.stateParams = $injector.get('$stateParams');
            that.$controller = $injector.get('$controller');
            that.VVM_STATUS = $injector.get('VVM_STATUS');
            that.ADJUSTMENT_TYPE = $injector.get('ADJUSTMENT_TYPE');
            that.messageService = $injector.get('messageService');
            that.confirmService = $injector.get('confirmService');
            that.stockAdjustmentCreationService = $injector.get('stockAdjustmentCreationService');
            that.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            that.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            that.ReasonDataBuilder = $injector.get('ReasonDataBuilder');
            that.OrderableGroupDataBuilder = $injector.get('OrderableGroupDataBuilder');
            that.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            that.alertService = $injector.get('alertService');
            that.notificationService = $injector.get('notificationService');
            that.LotDataBuilder = $injector.get('LotDataBuilder');
            that.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            that.OrderableChildrenDataBuilder = $injector.get('OrderableChildrenDataBuilder');
            that.LotResource = $injector.get('LotResource');
            that.UNPACK_REASONS = $injector.get('UNPACK_REASONS');
        });

        that.state = jasmine.createSpyObj('$state', ['go']);
        that.state.current = {
            name: '/a/b'
        };
        that.state.params = {
            page: 0
        };

        that.program = new that.ProgramDataBuilder().build();
        that.facility = new that.FacilityDataBuilder().build();

        that.orderableGroups = [
            new that.OrderableGroupDataBuilder().build()
        ];
        that.reasons = [
            new that.ReasonDataBuilder().build()
        ];

        that.kitConstituents = [
            new this.OrderableChildrenDataBuilder().withId('child_product_1_id')
                .withQuantity(30)
                .buildJson()
        ];

        that.kitOrderable = new this.OrderableDataBuilder().withId('kit_product_id')
            .withChildren(that.kitConstituents)
            .buildJson();

        that.orderableGroup = new that.OrderableGroupDataBuilder()
            .withOrderable(new that.OrderableDataBuilder().withExtraData({
                useVVM: 'true'
            })
                .build())
            .build();

        that.scope = that.rootScope.$new();
        that.scope.productForm = jasmine.createSpyObj('productForm', ['$setUntouched', '$setPristine']);

        that.vm = initController(that.orderableGroups);
        that.vm.$onInit();
    });

    describe('onInit', function() {

        it('should init page properly', function() {
            expect(that.stateParams.page).toEqual(0);
        });

        it('should set showVVMStatusColumn to true if any orderable use vvm', function() {
            that.vm = initController([that.orderableGroup]);
            that.vm.$onInit();

            expect(that.vm.showVVMStatusColumn).toBe(true);
        });

        it('should set hasPermissionToAddNewLot to true', function() {
            expect(that.vm.hasPermissionToAddNewLot).toBe(true);
        });

        it('should set showVVMStatusColumn to false if no orderable use vvm', function() {
            var orderableGroup = new that.OrderableGroupDataBuilder()
                .withOrderable(new that.OrderableDataBuilder().withExtraData({
                    useVVM: 'false'
                })
                    .build())
                .build();

            that.vm = initController([orderableGroup]);
            that.vm.$onInit();

            expect(that.vm.showVVMStatusColumn).toBe(false);
        });
    });

    describe('validate', function() {

        it('line item quantity is valid given positive integer', function() {
            var lineItem = {
                id: '1',
                quantity: 1,
                $errors: {}
            };
            that.vm.validateQuantity(lineItem);

            expect(lineItem.$errors.quantityInvalid).toBeFalsy();
        });

        it('line item quantity is invalid given 0', function() {
            var lineItem = {
                id: '1',
                quantity: 0,
                $errors: {}
            };
            that.vm.validateQuantity(lineItem);

            expect(lineItem.$errors.quantityInvalid).toEqual('stockAdjustmentCreation.positiveInteger');
        });

        // AO-535: Added quantity validation for DEBIT reason type
        it('line item quantity is invalid when is greater than stock on hand and reason type is DEBIT', function() {
            var lineItem = {
                id: '1',
                quantity: 6,
                $previewSOH: 5,
                reason: {
                    reasonType: 'DEBIT'
                },
                $errors: {}
            };
            that.vm.validateQuantity(lineItem);

            expect(lineItem.$errors.quantityInvalid).toEqual('stockAdjustmentCreation.quantityGreaterThanStockOnHand');
        });
        // AO-535: ends here

        it('line item quantity is invalid given -1', function() {
            var lineItem = {
                id: '1',
                quantity: -1,
                $errors: {}
            };
            that.vm.validateQuantity(lineItem);

            expect(lineItem.$errors.quantityInvalid).toEqual('stockAdjustmentCreation.positiveInteger');
        });
    });

    it('should reorder all added items when quantity validation failed', function() {
        var date1 = new Date(2017, 3, 20);
        var lineItem1 = {
            reason: {
                id: '123',
                reasonType: 'DEBIT'
            },
            orderable: {
                productCode: 'C100'
            },
            occurredDate: date1,
            $errors: {}
        };

        var lineItem2 = {
            reason: {
                id: '123',
                reasonType: 'DEBIT'
            },
            orderable: {
                productCode: 'C150'
            },
            occurredDate: date1,
            $errors: {}
        };

        var date2 = new Date(2017, 3, 25);
        var lineItem3 = {
            reason: {
                id: '123',
                reasonType: 'DEBIT'
            },
            orderable: {
                productCode: 'C100'
            },
            occurredDate: date2,
            $errors: {
                quantityInvalid: 'stockAdjustmentCreation.sohCanNotBeNegative'
            }
        };

        var lineItem4 = {
            reason: {
                id: '123',
                reasonType: 'DEBIT'
            },
            orderable: {
                productCode: 'C120'
            },
            occurredDate: date2,
            $errors: {
                quantityInvalid: 'stockAdjustmentCreation.sohCanNotBeNegative'
            }
        };

        that.vm.addedLineItems = [lineItem1, lineItem2, lineItem3, lineItem4];

        that.vm.submit();

        var expectItems = [lineItem3, lineItem1, lineItem4, lineItem2];

        expect(that.vm.displayItems).toEqual(expectItems);
    });

    it('should remove all line items', function() {
        var lineItem1 = {
            id: '1',
            quantity: 0
        };
        var lineItem2 = {
            id: '2',
            quantity: 1
        };
        that.vm.addedLineItems = [lineItem1, lineItem2];
        that.vm.displayItems = [lineItem1];
        spyOn(that.confirmService, 'confirmDestroy');
        var deferred = that.q.defer();
        deferred.resolve();
        that.confirmService.confirmDestroy.andReturn(deferred.promise);

        that.vm.removeDisplayItems();
        that.rootScope.$apply();

        expect(that.confirmService.confirmDestroy).toHaveBeenCalledWith('stockAdjustmentCreation.clearAll',
            'stockAdjustmentCreation.clear');

        expect(that.vm.addedLineItems).toEqual([lineItem2]);
        expect(that.vm.displayItems).toEqual([]);
    });

    it('should remove one line item from added line items', function() {
        var lineItem1 = {
            id: '1',
            quantity: 0
        };
        var lineItem2 = {
            id: '2',
            quantity: 1
        };
        that.vm.addedLineItems = [lineItem1, lineItem2];

        that.vm.remove(lineItem1);

        expect(that.vm.addedLineItems).toEqual([lineItem2]);
    });

    describe('addProduct', function() {

        beforeEach(function() {
            that.vm.selectedOrderableGroup = new that.OrderableGroupDataBuilder()
                .withOrderable(new that.OrderableDataBuilder().withFullProductName('Implanon')
                    .build())
                .withStockOnHand(2)
                .build();
            that.vm.addProduct();
        });

        it('should add one line item to addedLineItem array', function() {
            var addedLineItem = that.vm.addedLineItems[0];

            expect(addedLineItem.stockOnHand).toEqual(2);
            expect(addedLineItem.orderable.fullProductName).toEqual('Implanon');
            expect(typeof(addedLineItem.occurredDate)).toBe('string');
        });

        it('should properly add another line item to addedLineItem array', function() {
            that.vm.selectedOrderableGroup = new that.OrderableGroupDataBuilder()
                .withOrderable(new that.OrderableDataBuilder().withFullProductName('Adsorbentia')
                    .build())
                .withStockOnHand(10)
                .build();
            that.vm.addProduct();

            var addedLineItem = that.vm.addedLineItems[0];

            expect(addedLineItem.stockOnHand).toEqual(10);
            expect(addedLineItem.orderable.fullProductName).toEqual('Adsorbentia');
            expect(addedLineItem.occurredDate).toEqual(that.vm.addedLineItems[1].occurredDate);
        });

        it('should add line item if missing lot provided', function() {
            that.vm.newLot.lotCode = 'NewLot001';
            that.vm.addedItems = [];

            var newLot = {
                lotCode: that.vm.newLot.lotCode,
                expirationDate: that.vm.newLot.expirationDate,
                tradeItemId: that.vm.selectedOrderableGroup[0].orderable.identifiers.tradeItem,
                active: true
            };

            that.vm.addProduct();

            var addedLineItem = that.vm.addedLineItems[0];

            expect(addedLineItem.orderable).toEqual(that.vm.selectedOrderableGroup[0].orderable);
            expect(addedLineItem.lot).toEqual(newLot);
            expect(addedLineItem.displayLotMessage).toEqual(newLot.lotCode);
        });
    });

    it('should search from added line items', function() {
        var lineItem1 = {
            id: '1',
            quantity: 0
        };
        var lineItem2 = {
            id: '2',
            quantity: 1
        };
        that.vm.addedLineItems = [lineItem1, lineItem2];

        spyOn(that.stockAdjustmentCreationService, 'search');
        that.stockAdjustmentCreationService.search.andReturn([lineItem1]);
        var params = {
            page: 0,
            program: that.program,
            facility: that.facility,
            reasons: that.reasons,
            orderableGroups: that.orderableGroups,
            addedLineItems: [lineItem1, lineItem2],
            displayItems: [lineItem1],
            keyword: undefined
        };

        that.vm.search();

        expect(that.vm.displayItems).toEqual([lineItem1]);
        expect(that.state.go).toHaveBeenCalledWith('/a/b', params, {
            reload: true,
            notify: false
        });
    });

    describe('getStatusDisplay', function() {
        it('should expose getStatusDisplay method', function() {
            expect(angular.isFunction(that.vm.getStatusDisplay)).toBe(true);
        });

        it('should call messageService', function() {
            spyOn(that.messageService, 'get').andReturn(true);
            that.vm.getStatusDisplay(that.VVM_STATUS.STAGE_1);

            expect(that.messageService.get).toHaveBeenCalled();
        });
    });

    describe('submit', function() {
        beforeEach(function() {
            spyOn(that.alertService, 'error');
            spyOn(that.confirmService, 'confirm');
            spyOn(that.notificationService, 'success');
            that.confirmService.confirm.andReturn(that.q.resolve());
        });

        it('should rediect with proper state params after success', function() {
            spyOn(that.stockAdjustmentCreationService, 'submitAdjustments');
            that.stockAdjustmentCreationService.submitAdjustments.andReturn(that.q.resolve());

            that.vm.submit();
            that.rootScope.$apply();

            expect(that.state.go).toHaveBeenCalledWith('openlmis.stockmanagement.stockCardSummaries', {
                facility: that.facility.id,
                program: that.program.id
            });

            expect(that.notificationService.success).toHaveBeenCalledWith('stockAdjustmentCreation.submitted');
            expect(that.alertService.error).not.toHaveBeenCalled();
        });

        it('should not rediect after error', function() {
            spyOn(that.stockAdjustmentCreationService, 'submitAdjustments');
            that.stockAdjustmentCreationService.submitAdjustments
                .andReturn(that.q.reject({
                    data: {
                        message: 'error occurred'
                    }
                }));

            that.vm.submit();
            that.rootScope.$apply();

            expect(that.state.go).not.toHaveBeenCalled();
            expect(that.alertService.error).toHaveBeenCalledWith('error occurred');
            expect(that.notificationService.success).not.toHaveBeenCalled();
        });

        it('should generate kit constituent if the state is unpacking', function() {
            spyOn(that.stockAdjustmentCreationService, 'submitAdjustments');
            that.stockAdjustmentCreationService.submitAdjustments.andReturn(that.q.resolve());

            that.vm = initController([that.orderableGroup], that.ADJUSTMENT_TYPE.KIT_UNPACK);

            that.vm.addedLineItems = [{
                reason: {
                    id: that.UNPACK_REASONS.KIT_UNPACK_REASON_ID
                },
                orderable: that.kitOrderable,
                occurredDate: new Date(),
                quantity: 2,
                $errors: {}
            }];

            that.vm.submit();

            that.rootScope.$apply();

            var unpackingLineItem = that.stockAdjustmentCreationService.submitAdjustments
                .mostRecentCall.args[2];

            expect(unpackingLineItem.length).toEqual(2);
            expect(unpackingLineItem[1].reason.id).toEqual(that.UNPACK_REASONS.UNPACKED_FROM_KIT_REASON_ID);
            expect(unpackingLineItem[0].reason.id).toEqual(that.UNPACK_REASONS.KIT_UNPACK_REASON_ID);
            expect(unpackingLineItem[1].quantity).toEqual(60);
            expect(unpackingLineItem[0].quantity).toEqual(2);
        });
    });

    describe('orderableSelectionChanged', function() {

        it('should unselect lot', function() {
            that.vm.selectedLot = new that.LotDataBuilder().build();

            that.vm.orderableSelectionChanged();

            expect(that.vm.selectedLot).toBe(null);
        });

        it('should clear new lot code', function() {
            that.vm.newLot.lotCode = 'NewLot001';
            that.vm.orderableSelectionChanged();

            expect(that.vm.newLot.lotCode).not.toBeDefined();
        });

        it('should clear new lot expiration date', function() {
            that.vm.newLot.expirationDate = '2019-08-06';
            that.vm.orderableSelectionChanged();

            expect(that.vm.newLot.expirationDate).not.toBeDefined();
        });

        it('should set canAddNewLot as false', function() {
            that.vm.canAddNewLot = true;
            that.vm.orderableSelectionChanged();

            expect(that.vm.canAddNewLot).toBeFalsy();
        });

        it('should clear form', function() {
            that.vm.selectedLot = new that.LotDataBuilder().build();

            that.vm.orderableSelectionChanged();

            expect(that.scope.productForm.$setPristine).toHaveBeenCalled();
            expect(that.scope.productForm.$setUntouched).toHaveBeenCalled();
        });

    });

    describe('lotChanged', function() {

        it('should clear new lot code', function() {
            that.vm.newLot.lotCode = 'NewLot001';
            that.vm.lotChanged();

            expect(that.vm.newLot.lotCode).not.toBeDefined();
        });

        it('should clear new lot expiration date', function() {
            that.vm.newLot.expirationDate = '2019-08-06';
            that.vm.lotChanged();

            expect(that.vm.newLot.expirationDate).not.toBeDefined();
        });

        it('should set canAddNewLot as true', function() {
            that.vm.selectedLot = new that.LotDataBuilder()
                .withCode('orderableGroupService.addMissingLot')
                .build();
            that.vm.lotChanged();

            expect(that.vm.canAddNewLot).toBeTruthy();
        });

        it('should set canAddNewLot as false', function() {
            that.vm.selectedLot = new that.LotDataBuilder().build();
            that.vm.lotChanged();

            expect(that.vm.canAddNewLot).toBeFalsy();
        });

    });

    function initController(orderableGroups, adjustmentType) {
        return that.$controller('StockAdjustmentCreationController', {
            $scope: that.scope,
            $state: that.state,
            $stateParams: that.stateParams,
            program: that.program,
            facility: that.facility,
            adjustmentType: adjustmentType ? adjustmentType : that.ADJUSTMENT_TYPE.ADJUSTMENT,
            srcDstAssignments: undefined,
            user: {},
            reasons: that.reasons,
            orderableGroups: orderableGroups,
            displayItems: [],
            hasPermissionToAddNewLot: true
        });
    }

});
