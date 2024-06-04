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
        .module('report-embedded')
        .factory('reportEmbeddedService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/reports/embeddedReports'), {}, {
            get: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/embeddedReports/:id')
            },
            getAll: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/embeddedReports')
            },
            add: {
                method: 'POST',
                url: openlmisUrlFactory('/api/reports/embeddedReports')
            },
            edit: {
                method: 'PUT',
                url: openlmisUrlFactory('/api/reports/embeddedReports/:id')
            },
            remove: {
                method: 'DELETE',
                url: openlmisUrlFactory('/api/reports/embeddedReports/:id')
            },
            getAllByCategory: {
                method: 'POST',
                url: openlmisUrlFactory('/api/reports/embeddedReports?category=:categoryName')
            },
            addReportCategory: {
                method: 'POST',
                url: openlmisUrlFactory('/api/reports/embeddedReportCategories')
            },
            getReportCategories: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/embeddedReportCategories')
            },
            getReportCategory: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/embeddedReportCategories?category_id=:categoryId')
            },
            deleteReportCategory: {
                method: 'DELETE',
                url: openlmisUrlFactory('/api/reports/embeddedReportCategories?category_id=:categoryId')
            }
        });

        return {
            get: get,
            getAll: getAll,
            add: add,
            edit: edit,
            remove: remove,
            getAllByCategory: getAllByCategory,
            addReportCategory: addReportCategory,
            getReportCategories: getReportCategories,
            getReportCategory: getReportCategory,
            deleteReportCategory: deleteReportCategory
        };

        function getAll(searchParams) {
            return resource.getAll(searchParams).$promise;
        }

        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        function add(report) {
            return resource.add(report).$promise;
        }

        function edit(report) {
            return resource.edit({
                id: report.id
            }, report).$promise;
        }

        function remove(id) {
            return resource.remove({
                id: id
            }).$promise;
        }

        function getAllByCategory(categoryName) {
            return resource.getAllByCategory({
                categoryName: categoryName
            }).$promise;
        }

        function addReportCategory(category) {
            return resource.addReportCategory(category).$promise;
        }

        function getReportCategories() {
            return resource.getReportCategories().$promise;
        }

        function getReportCategory(category) {
            return resource.getReportCategory(category).$promise;
        }

        function deleteReportCategory(categoryId) {
            return resource.deleteReportCategory({
                categoryId: categoryId
            }).$promise;
        }

    }
})();