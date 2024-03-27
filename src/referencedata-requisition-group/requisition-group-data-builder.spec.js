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

    angular
        .module('referencedata-requisition-group')
        .factory('RequisitionGroupDataBuilder', RequisitionGroupDataBuilder);

    RequisitionGroupDataBuilder.$inject = [
        'SupervisoryNodeDataBuilder', 'FacilityDataBuilder'
    ];

    function RequisitionGroupDataBuilder(SupervisoryNodeDataBuilder, FacilityDataBuilder) {

        RequisitionGroupDataBuilder.prototype.buildJson = buildJson;
        RequisitionGroupDataBuilder.prototype.withId = withId;
        RequisitionGroupDataBuilder.prototype.withCode = withCode;
        RequisitionGroupDataBuilder.prototype.withName = withName;
        RequisitionGroupDataBuilder.prototype.withDescription = withDescription;
        RequisitionGroupDataBuilder.prototype.withSupervisoryNode = withSupervisoryNode;
        RequisitionGroupDataBuilder.prototype.withoutSupervisoryNode = withoutSupervisoryNode;
        RequisitionGroupDataBuilder.prototype.withoutSupervisoryNodeFacility = withoutSupervisoryNodeFacility;
        RequisitionGroupDataBuilder.prototype.withMemberFacility = withMemberFacility;
        RequisitionGroupDataBuilder.prototype.withMemberFacilities = withMemberFacilities;

        return RequisitionGroupDataBuilder;

        function RequisitionGroupDataBuilder() {
            RequisitionGroupDataBuilder.instanceNumber = (RequisitionGroupDataBuilder.instanceNumber || 0) + 1;

            this.id = 'req-group-id-' + RequisitionGroupDataBuilder.instanceNumber;
            this.code = 'RG' + RequisitionGroupDataBuilder.instanceNumber;
            this.name = 'Test Req Group';
            this.description = 'test description';
            this.supervisoryNode = new SupervisoryNodeDataBuilder().build();
            this.memberFacilities = [new FacilityDataBuilder().build() ];
        }

        function withCode(newCode) {
            this.code = newCode;
            return this;
        }

        function withName(newName) {
            this.name = newName;
            return this;
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withDescription(newDescription) {
            this.description = newDescription;
            return this;
        }

        function withSupervisoryNode(newSupervisoryNode) {
            this.supervisoryNode = newSupervisoryNode;
            return this;
        }

        function withoutSupervisoryNode() {
            return this.withSupervisoryNode(undefined);
        }

        function withoutSupervisoryNodeFacility() {
            this.supervisoryNode.facility = undefined;
            return this;
        }

        function withMemberFacility(facility) {
            this.memberFacilities.push(facility);
            return this;
        }

        function withMemberFacilities(newMemberFacilities) {
            this.memberFacilities = newMemberFacilities;
            return this;
        }

        function buildJson() {
            return {
                id: this.id,
                code: this.code,
                name: this.name,
                description: this.description,
                supervisoryNode: this.supervisoryNode,
                memberFacilities: this.memberFacilities
            };
        }
    }
})();
