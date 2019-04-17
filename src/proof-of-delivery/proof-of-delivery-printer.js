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

    /**
     * @ngdoc service
     * @name proof-of-delivery.ProofOfDeliveryPrinter
     *
     * @description
     * Responsible for printing an instance of the Proof of Delivery with the specified ID.
     */
    angular
        .module('proof-of-delivery')
        .factory('ProofOfDeliveryPrinter', ProofOfDeliveryPrinter);

    ProofOfDeliveryPrinter.$inject = ['classExtender', 'OpenlmisPrinter', 'openlmisUrlFactory', 'accessTokenFactory'];

    function ProofOfDeliveryPrinter(classExtender, OpenlmisPrinter, openlmisUrlFactory, accessTokenFactory) {

        classExtender.extend(ProofOfDeliveryPrinter, OpenlmisPrinter);
        ProofOfDeliveryPrinter.prototype.print = print;

        return ProofOfDeliveryPrinter;

        function ProofOfDeliveryPrinter(proofOfDeliveryId) {
            this.super({
                resourceUri: '/api/reports/templates/angola/ca5bd717-71f9-473e-9c17-bdc86cb5d9f5/pdf',
                loadingMessage: 'proofOfDelivery.preparingProofOfDelivery',
                id: proofOfDeliveryId
            });
        }

        function print() {
            var url = openlmisUrlFactory(getUri.apply(this));
            url = accessTokenFactory.addAccessToken(url);
            this.tab.location.href = url;
        }

        function getUri() {
            return this.resourceUri + '?proofOfDelivery=' + this.id;
        }

    }

})();
