


(function() {
  var module = angular.module('app', ['ngAnimate', 'ngeo']);


  /**
   * App-specific directive wrapping the ngeo map directive. The directive's
   * controller has a property "map" including a reference to the OpenLayers
   * map.
   */
  module.directive('appMap', [
    /**
     * @return {angular.Directive} The directive specs.
     */
    function() {
      return {
        restrict: 'E',
        scope: {
          'map': '=appMap',
          'class': '=appMapClass'
        },
        controller: function() {},
        controllerAs: 'ctrl',
        bindToController: true,
        template: '<div ngeo-map="ctrl.map" ngeo-resizemap="ctrl.map" ' +
            'ngeo-resizemap-class="ctrl.class"></div>'
      };
    }]);


  /**
   * The application's main controller.
   */
  module.controller('MainController', ['$scope',
    /**
     * @param {angular.Scope} $scope Scope.
     */
    function($scope) {
      /** @type {ol.Map} */
      this['map'] = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: [0, 0],
          zoom: 4
        })
      });

      // the initial class name
      this['class'] = '';
    }]);

})();
