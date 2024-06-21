(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-order-create.orderCreateService
     *
     * @description
     * Communicates with the /api/orders endpoint of the OpenLMIS server.
     */
    angular
        .module('requisition-order-create')
        .service('orderCreateService', service);

    service.$inject = ['$resource', '$http', 'openlmisUrlFactory'];

    function service($resource, $http, openlmisUrlFactory) {

        var resource = $resource(openlmisUrlFactory('/api/orders/:id'), {}, {
            update: {
                method: 'PUT'
            },
            create: {
                url: openlmisUrlFactory('/api/orders/requisitionLess'),
                method: 'POST'
            },
            send: {
                url: openlmisUrlFactory('/api/orders/:id/requisitionLess/send'),
              method: 'PUT'
            }
        });

        this.get = get;
        this.create = create;
        this.update = update;
        this.send = send;
        this.delete = deleteOrders;

        function get(orderId) {
            return resource.get({
                id: orderId
            }).$promise;
        }

        function create(orderId) {
            return resource.create(orderId).$promise;
        }

        function update(order) {
            return resource.update({
                id: order.id
            }, order).$promise;
        }

        function send(order) {
            return resource.send({
                id: order.id
            }, order).$promise;
        }

        function deleteOrders(orderIds) {
            return $http({
                method: 'DELETE',
                url: openlmisUrlFactory('/api/orders'),
                data: {
                    ids: orderIds
                },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        }
    }
})();
