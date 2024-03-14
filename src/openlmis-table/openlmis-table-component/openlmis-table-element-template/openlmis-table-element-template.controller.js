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
            var htmlContent = $ctrl.elementConfig.template;
            var elementPropertyPath = 'item.' + $ctrl.elementConfig.propertyPath;
            htmlContent = htmlContent.replace(elementPropertyPath, $ctrl.elementConfig.value);
            var compiledHtml = $compile(angular.element(htmlContent))($scope);
            jQuery('#' + $ctrl.divId).append(compiledHtml);
        }
    }

})();
