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
     * @name stock-physical-inventory-draft.physicalInventoryDraftCacheService
     *
     * @description
     * Stores physical inventory drafts locally, deals with returning correct list of drafts for the current user.
     */
    angular
        .module('stock-physical-inventory-draft')
        .service('physicalInventoryDraftCacheService', physicalInventoryDraftCacheService);

    physicalInventoryDraftCacheService.$inject = [
        'localStorageFactory', '$q', 'OrderableResource'
    ];

    function physicalInventoryDraftCacheService(localStorageFactory, $q, OrderableResource) {

        var offlinePhysicalInventoryDrafts = localStorageFactory('physicalInventoryDrafts');
        // ANGOLASUP-825: Fixed inventory saving functionality
        var physicalInventoryDraftItemsWithNewLots = localStorageFactory('physicalInventoryDraftItemsWithNewLots');
        // ANGOLASUP-825: Ends here

        this.cacheDraft = cacheDraft;
        // ANGOLASUP-825: Fixed inventory saving functionality
        this.cacheItemsWithNewLots = cacheItemsWithNewLots;
        this.cacheSingleItemWithNewLot = cacheSingleItemWithNewLot;
        this.updateSingleItemWithNewLot = updateSingleItemWithNewLot;
        this.removeDraftItemsWithNewLots = removeDraftItemsWithNewLots;
        this.getPhysicalInventoryDraftItemsWithNewLots = getPhysicalInventoryDraftItemsWithNewLots;
        // ANGOLASUP-825: Ends here
        this.getDraft = getDraft;
        this.removeById = removeById;
        this.searchDraft = searchDraft;

        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name cacheDraft
         *
         * @description
         * Caches given physical inventory draft in the local storage.
         *
         * @param {Object} draft  the draft to be cached
         */
        function cacheDraft(draft) {
            var draftToSave = JSON.parse(JSON.stringify(draft));
            draftToSave.lineItems.forEach(function(lineItem) {
                lineItem.orderable = getVersionedObjectReference(lineItem.orderable);
            });
            offlinePhysicalInventoryDrafts.put(draftToSave);
        }

        // ANGOLASUP-825: Fixed inventory saving functionality
        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name cacheItemsWithNewLot
         *
         * @description
         * Caches line items with new Lots from given physical inventory
         * draft in the local storage.
         *
         * @param {Object} draft  the draft containing items with new Lots
         */
        function cacheItemsWithNewLots(draft) {
            var parsedDraft = JSON.parse(JSON.stringify(draft));

            var physicalInventoryNewLots = getPhysicalInventoryDraftItemsWithNewLots(draft.facilityId, draft.programId);
            var existingItemsWithNewLots = physicalInventoryNewLots ? physicalInventoryNewLots.lineItems : [];

            var itemsWithNewLots = parsedDraft.lineItems.filter(function(lineItem) {
                return lineItem.lot && (lineItem.lot.lotCode && !lineItem.lot.id) &&
                (existingItemsWithNewLots.filter(function(lineItemWithNewLot) {
                    return lineItemWithNewLot.displayLotMessage === lineItem.displayLotMessage &&
                        lineItemWithNewLot.orderable.id === lineItem.orderable.id;
                }).length === 0);
            });

            existingItemsWithNewLots.forEach((function(lineItem) {
                lineItem.stockAdjustments = getAdjustmentsReasonFromDraft(lineItem, parsedDraft);
            }));

            itemsWithNewLots.forEach(function(lineItem) {
                lineItem.stockAdjustments = getAdjustmentsReasonFromDraft(lineItem, parsedDraft);
                existingItemsWithNewLots.push(lineItem);
            });

            parsedDraft.lineItems = existingItemsWithNewLots;
            physicalInventoryDraftItemsWithNewLots.put(parsedDraft);
        }

        function getAdjustmentsReasonFromDraft(lineItem, draft) {
            var lineItemReasons = draft.lineItems.find(function(draftLineItem) {
                return draftLineItem.displayLotMessage === lineItem.displayLotMessage &&
                draftLineItem.orderable.id === lineItem.orderable.id;
            }).stockAdjustments;

            return lineItemReasons;
        }
        // ANGOLASUP-825: Ends here

        // ANGOLASUP-825: Fixed inventory saving functionality
        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name cacheSingleItemWithNewLot
         *
         * @description
         * Caches given line item with new Lot in the local storage.
         *
         * @param {Object} draft  the draft containing line items
         * @param {Object} item  the item with new Lot
         */
        function cacheSingleItemWithNewLot(draft, item) {
            var physicalInventoryNewLots = getPhysicalInventoryDraftItemsWithNewLots(draft.facilityId, draft.programId);
            if (!physicalInventoryNewLots) {
                cacheItemsWithNewLots(draft);
                physicalInventoryNewLots = getPhysicalInventoryDraftItemsWithNewLots(draft.facilityId, draft.programId);
            }

            if (!physicalInventoryNewLots.lineItems) {
                physicalInventoryNewLots.lineItems = [];
            }

            physicalInventoryNewLots.lineItems = physicalInventoryNewLots.lineItems.filter(function(lineItem) {
                return lineItem.lot.lotCode !== item.lot.lotCode;
            });

            physicalInventoryNewLots.lineItems.push(item);

            physicalInventoryDraftItemsWithNewLots.put(physicalInventoryNewLots);
        }
        // ANGOLASUP-825: Ends here

        // ANGOLASUP-825: Fixed inventory saving functionality
        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name updateSingleItemWithNewLot
         *
         * @description
         * Update given line item with new Lot in the local storage.
         *
         * @param {Object} draft  the draft containing line items
         * @param {Object} oldItem  the item to be edited
         * @param {Object} newLot  the Lot containing the new values
         */
        function updateSingleItemWithNewLot(draft, oldItem, newLot) {
            var physicalInventoryNewLots = getPhysicalInventoryDraftItemsWithNewLots(draft.facilityId, draft.programId);
            if (physicalInventoryNewLots) {
                physicalInventoryNewLots.lineItems.forEach(function(lineItem) {
                    if (lineItem.orderable.id === oldItem.orderable.id
                        && lineItem.lot.lotCode === oldItem.lot.lotCode) {
                        lineItem.lot = newLot;
                        lineItem.displayLotMessage = newLot.lotCode;
                    }
                });

                physicalInventoryDraftItemsWithNewLots.put(physicalInventoryNewLots);
            }
        }
        // ANGOLASUP-825: Ends here

        // ANGOLASUP-825: Fixed inventory saving functionality
        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name removeDraftItemsWithNewLots
         *
         * @description
         * Delete cached draft with line items that contains new Lots from given physical inventory
         * draft from the local storage.
         *
         * @param {Object} draft  the draft containing items with new Lots
         */
        function removeDraftItemsWithNewLots(draft) {
            physicalInventoryDraftItemsWithNewLots.removeBy('id', draft.id);
        }
        // ANGOLASUP-825: Ends here

        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name getDraft
         *
         * @description
         * Retrieves given physical inventory draft from the local storage.
         *
         * @param  {String}  draftId
         *
         */
        function getDraft(draftId) {
            var cachedDraft,
                identities;
            cachedDraft = offlinePhysicalInventoryDrafts.search({
                id: draftId
            });

            if (cachedDraft.length === 0) {
                return $q.resolve(undefined);
            }

            identities = getResourcesFromLineItems(cachedDraft[0]);
            return getByVersionIdentities(identities, new OrderableResource())
                .then(function(result) {
                    var orderablesMap = result.reduce(function(orderablesMap, orderable) {
                        orderablesMap[orderable.id + '/' + orderable.meta.versionNumber] = orderable;
                        return orderablesMap;
                    }, {});
                    cachedDraft[0].lineItems.map(function(lineItem) {
                        lineItem.orderable = orderablesMap[lineItem.orderable.id + '/'
                        + lineItem.orderable.versionNumber];
                    });
                    return cachedDraft[0];
                });
        }

        // ANGOLASUP-825: Fixed inventory saving functionality
        function getPhysicalInventoryDraftItemsWithNewLots(facilityId, programId) {
            return physicalInventoryDraftItemsWithNewLots.getAll().filter(function(draftWithNewLots) {
                return draftWithNewLots.facilityId === facilityId &&
                       draftWithNewLots.programId === programId;
            })[0];
        }
        // ANGOLASUP-825: Ends here

        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name searchDraft
         *
         * @description
         * Retrieves given physical inventory drafts from the local storage
         * by programId and facilityId.
         *
         * @param  {String}  programId program UUID
         * @param  {String}  facilityId facility UUID
         * @return {Promise}        Array of drafts
         */
        function searchDraft(programId, facilityId) {
            return $q.resolve(
                offlinePhysicalInventoryDrafts.search({
                    programId: programId,
                    facilityId: facilityId
                })
            );
        }

        /**
         * @ngdoc method
         * @methodOf stock-physical-inventory-draft.physicalInventoryDraftCacheService
         * @name removeById
         *
         * @description
         * Remove a physical inventory draft with the given ID.
         *
         * @param {String} draftId  the ID of the draft to delete
         */
        function removeById(draftId) {
            offlinePhysicalInventoryDrafts.removeBy('id', draftId);
        }

        function getVersionedObjectReference(resource) {
            if (resource.meta) {
                return {
                    id: resource.id,
                    versionNumber: resource.meta.versionNumber
                };
            }
            return resource;
        }

        function getResourcesFromLineItems(draft) {
            var identities = [];
            draft.lineItems.forEach(function(item) {
                identities.push(item.orderable);
            });
            return identities;
        }

        function getByVersionIdentities(identities, resource) {
            return resource.getByVersionIdentities(identities);
        }
    }
})();
