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

// (function() {

//     'use strict';

//     angular
//         .module('admin-integration-email-list')
//         .factory('IntegrationIntegrationEmailDataBuilder', IntegrationEmailDataBuilder);

//     IntegrationEmailDataBuilder.$inject = ['Email'];

//     function IntegrationEmailDataBuilder(Email) {

//         IntegrationEmailDataBuilder.prototype.build = build;
//         IntegrationEmailDataBuilder.prototype.withId = withId;
//         IntegrationEmailDataBuilder.prototype.withName = withName;

//         return IntegrationEmailDataBuilder;

//         function IntegrationEmailDataBuilder() {
//             IntegrationEmailDataBuilder.instanceNumber = (IntegrationEmailDataBuilder.instanceNumber || 0) + 1;

//             this.id = 'email-id-' + IntegrationEmailDataBuilder.instanceNumber;
//             this.name = 'test-' + IntegrationEmailDataBuilder.instanceNumber + '@openlmis.com';
//         }

//         function withName(newName) {
//             this.name = newName;
//             return this;
//         }

//         function withId(newId) {
//             this.id = newId;
//             return this;
//         }

//         function build() {
//             return new Email(
//                 this.id,
//                 this.name
//             );
//         }

//     }

// })();
