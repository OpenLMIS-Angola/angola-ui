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
     * @ngdoc directive
     * @restrict E
     * @name openlmis-upload.directive:openlmisFileUpload
     *
     * @description
     * Wraps file input with buttons to select/clear file.
     *
     * @example
     * ```
     * <input id="file" type="file" ng-model="vm.file" accept=".csv">
     * ```
     */
    angular
        .module('openlmis-file-upload')
        .directive('input', directive);

    directive.$inject = ['$templateRequest', '$compile'];

    function directive($templateRequest, $compile) {

        var directive = {
            require: '?ngModel',
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, ngModelController) {
            if (element.attr('type') !== 'file') {
                return;
            }

            var fileExtension = element.attr('accept'),
                multipleSelection = element.attr('multiple');

            if (multipleSelection && !ngModelController.$viewValue.length) {
                ngModelController.$setViewValue([]);
            }

            scope.select = select;
            scope.clear = clear;
            scope.getFileName = getFileName;
            scope.getViewValue = getViewValue;
            scope.isMultipleSelectionEnabled = isMultipleSelectionEnabled;

            $templateRequest('openlmis-file-upload/file-upload.html')
                .then(function(html) {
                    var template = $compile(html)(scope);
                    element.before(template);
                });

            element.parent().addClass('openlmis-file-upload');
            element.parent().addClass('is-empty');

            element.on('change', function(event) {
                event.preventDefault();
                scope.$apply(function() {
                    var files = event.target.files;

                    if (files) {
                        if (element.attr('multiple')) {
                            var list = ngModelController.$viewValue;

                            for (var i = 0; i < files.length; i++) {
                                list.push(files[i]);
                            }

                            ngModelController.$setViewValue(list);
                            element.val(undefined);

                        } else {
                            ngModelController.$setViewValue(files[0]);
                        }
                    }

                    validate();
                });
            });

            function select() {
                element.trigger('click');
            }

            function clear(index) {
                if (index === null || index === undefined) {
                    ngModelController.$setViewValue(undefined);
                    scope.filename = undefined;
                    element.val(undefined);
                } else {
                    var list = ngModelController.$viewValue;
                    list.splice(index, 1);
                    ngModelController.$setViewValue(list);
                    element.val(undefined);
                }
                validate();
            }

            function getFileName(index) {
                if (!ngModelController.$viewValue) {
                    return undefined;
                }
                return index === null || index === undefined ?
                    ngModelController.$viewValue.name : ngModelController.$viewValue[index].name;
            }

            function getViewValue() {
                return ngModelController.$viewValue;
            }

            function isMultipleSelectionEnabled() {
                return multipleSelection;
            }

            function validate() {
                ngModelController.$setValidity('openlmisFileUpload.wrongFileExtension', true);
                ngModelController.$setValidity('openlmisFileUpload.fileEmpty', true);

                var files = ngModelController.$viewValue;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (fileExtension) {
                        var extensions = fileExtension.split(','),
                            valid = false;
                        extensions.forEach(function(extension) {
                            valid = valid || !file.name.endsWith(extension);
                        });
                        ngModelController.$setValidity('openlmisFileUpload.wrongFileExtension', valid);
                    }
                    if (file.size === 0) {
                        ngModelController.$setValidity('openlmisFileUpload.fileEmpty', false);
                    }
                }
            }
        }
    }

})();
