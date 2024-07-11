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

// describe('AdminIntegrationEmailListController', function() {

//     var $state, $controller, IntegrationEmailDataBuilder,
//         vm, emailList;

//     beforeEach(function() {
//         module('admin-integration-email-list');

//         inject(function($injector) {
//             $controller = $injector.get('$controller');
//             $state = $injector.get('$state');
//             this.integrationEmailService = $injector.get('integrationEmailService');
//             IntegrationEmailDataBuilder = $injector.get('IntegrationEmailDataBuilder');
//         });

//         emailList = [
//             new IntegrationEmailDataBuilder().build()
//         ];

//         vm = $controller('AdminIntegrationEmailListController', {
//             emailList: emailList
//         });

//         spyOn($state, 'go').andReturn();
//     });

//     describe('removeEmail', function() {

//         it('should remove email', function() {
//             this.vm.removeEmail(this.emailList[0]);
//             this.$rootScope.$apply();

//             expect(this.OrderableResource.prototype.update).toHaveBeenCalledWith(this.emailList[0].id);
//         });

//         it('should redirect to the list view on success', function() {
//             this.vm.removeEmail(this.emailList[0]);
//             this.$rootScope.$apply();

//             expect(this.$state.reload).toHaveBeenCalled();
//         });
//     });
// });
