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

describe('OrderableEditKitUnpackListController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService =  $injector.get('confirmService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService =  $injector.get('notificationService');
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.alertService =  $injector.get('alertService');
            this.selectProductsModalService =  $injector.get('selectProductsModalService');
            this.OrderableResource =  $injector.get('OrderableResource');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableChildrenDataBuilder = $injector.get('OrderableChildrenDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
            this.stateTrackerService = $injector.get('stateTrackerService');
        });

        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build()
        ];

        this.children = [
            new this.OrderableChildrenDataBuilder()
                .withId(this.orderables[0].id)
                .buildJson(),
            new this.OrderableChildrenDataBuilder()
                .withId(this.orderables[1].id)
                .buildJson()
        ];

        this.orderable = new this.OrderableDataBuilder().withId('orderable1_id')
            .withChildren(this.children)
            .buildJson();

        this.orderables.push(this.orderable);

        this.orderablesMap = {};
        this.orderablesMap[this.orderables[0].id] = this.orderables[0];
        this.orderablesMap[this.orderables[1].id] = this.orderables[1];
        this.orderablesMap[this.orderables[2].id] = this.orderables[2];
        this.orderablesMap[this.orderables[3].id] = this.orderables[3];
        this.orderablesMap[this.orderables[4].id] = this.orderables[4];

        spyOn(this.selectProductsModalService, 'show');
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.$q.resolve(this.orderable));
        spyOn(this.alertService, 'error').andReturn();
        spyOn(this.stateTrackerService, 'goToPreviousState').andReturn(true);

        this.vm = this.$controller('OrderableEditKitUnpackListController', {
            orderable: this.orderable,
            children: this.children,
            orderables: this.orderables,
            orderablesMap: this.orderablesMap
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should expose children', function() {
            expect(this.vm.children).toEqual(this.children);
        });

        it('should expose orderablesMap', function() {
            expect(this.vm.orderablesMap).toEqual(this.orderablesMap);
        });
    });

    describe('addChild', function() {

        it('should add children', function() {
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.orderables[0],
                this.orderables[1],
                this.orderables[2],
                this.orderables[3]
            ]));

            this.vm.addChild();
            this.$rootScope.$apply();

            expect(this.orderable.children.length).toEqual(4);
        });

        it('should remove unselected children', function() {
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.orderables[0]
            ]));

            this.vm.addChild();
            this.$rootScope.$apply();

            var expectedMap = {};
            expectedMap[this.orderables[0].id] = this.orderables[0];

            expect(this.orderable.children.length).toEqual(1);
            expect(this.orderable.children[0].orderable.id).toEqual(this.orderables[0].id);
            expect(this.vm.orderablesMap).toEqual(expectedMap);
        });

        it('should not add children if orderable selection rejects', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            this.vm.addChild();
            this.$rootScope.$apply();

            expect(this.orderable.children.length).toEqual(2);
        });

        it('should not clear quantities of existing children', function() {
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.orderables[2],
                this.orderables[3]
            ]));

            this.vm.addChild();
            this.$rootScope.$apply();

            this.vm.orderable.children[0].quantity = 150;
            this.vm.orderable.children[1].quantity = 300;

            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.orderables[1],
                this.orderables[2],
                this.orderables[3]
            ]));

            this.vm.addChild();
            this.$rootScope.$apply();

            expect(this.vm.orderable.children[1].quantity).toEqual(150);
            expect(this.vm.orderable.children[2].quantity).toEqual(300);
        });

    });

    describe('removeChild', function() {

        it('should remove existing child', function() {
            var toRemove = this.orderable.children[0];

            this.vm.removeChild(toRemove);

            expect(this.orderable.children.length).toEqual(1);
            expect(this.orderable.children[0]).not.toEqual(toRemove);
        });

        it('should not remove non existing child', function() {
            this.vm.removeChild(new this.OrderableChildrenDataBuilder().buildJson());

            expect(this.orderable.children.length).toEqual(2);
        });

    });

    describe('goToOrderableList', function() {

        it('should call state go with correct params', function() {
            this.vm.goToOrderableList();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalledWith(
                // AO-584: added reloading state to sync orderable with backend, 
                // can be removed after incorporating 3.8 release
                'openlmis.administration.orderables', {}, {
                    reload: true
                }
                // AO-584
            );
        });
    });

    describe('saveOrderable', function() {

        it('should save orderable', function() {
            this.vm.saveOrderable();

            expect(this.OrderableResource.prototype.update).toHaveBeenCalledWith(this.orderable);
        });

        it('should redirect to the list view on success', function() {
            this.vm.saveOrderable();
            this.$rootScope.$apply();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalledWith(
                // AO-584: added reloading state to sync orderable with backend, 
                // can be removed after incorporating 3.8 release
                'openlmis.administration.orderables', {}, {
                    reload: true
                }
                // AO-584
            );
        });

        it('should not redirect to the list view on failure', function() {
            this.OrderableResource.prototype.update.andReturn(this.$q.reject());

            this.vm.saveOrderable();
            this.$rootScope.$apply();

            expect(this.stateTrackerService.goToPreviousState).not.toHaveBeenCalled();
        });

    });

});