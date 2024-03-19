(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-table.controller:openlmisTableElementTemplateController      *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .controller('openlmisTableElementTemplateController', openlmisTableElementTemplateController);

    openlmisTableElementTemplateController.$inject = ['$compile', '$scope', '$timeout', 'uniqueIdService', 'jQuery'];

    function openlmisTableElementTemplateController($compile, $scope, $timeout, uniqueIdService, jQuery) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            $ctrl.divId = uniqueIdService.generate();
            $timeout(function() {
                if ($ctrl.elementConfig.template) {
                    injectHtmlContent();
                }
            });
        }

        function injectHtmlContent() {
            var htmlContent = getItemTemplateValue($ctrl.elementConfig.template, $ctrl.elementConfig.item);
            var compiledHtml = $compile(angular.element(htmlContent))($scope);
            if (compiledHtml.length === 0) {
                jQuery('#' + $ctrl.divId).append(htmlContent);
            } else {
                jQuery('#' + $ctrl.divId).append(compiledHtml);
            }
        }

        function getItemTemplateValue(template, item) {
            if (typeof template === 'function') {
                return template(item);
            }

            var regex = /item\.(\w+)/g;

            return template.replace(regex, function(match, property) {
                var value = item[property];
                return value ? value : match;
            });
        }
    }

})();
