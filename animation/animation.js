


(function() {
  var module = angular.module('app', ['ngAnimate', 'ngeo']);


  /**
   * App-specific directive wrapping the ngeo map directive. The directive's
   * controller has a property "map" including a reference to the OpenLayers
   * map.
   */
  module.directive('appMap', ['$animate', '$window',
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
        controller: 'AppMapController',
        controllerAs: 'ctrl',
        bindToController: true,
        template: '<div ngeo-map="ctrl.map"></div>'
      };
    }]);


  /**
   * Controller for the appMap directive. The controller is responsible for
   * adding/removing the animation class to/from the map element. It runs
   * a requestAnimationFrame loop to update the map size during the animation.
   */
  module.controller('AppMapController', [
    '$scope', '$element', '$animate', '$window',
    /**
     * @param {angular.Scope} $scope Scope.
     * @param {angular.JQLite} $element Element.
     * @param {angular.$animate} $animate Angular animate service.
     * @param {angular.$window} $window Angular window service.
     */
    function($scope, $element, $animate, $window) {
      var map = this['map'];
      $scope.$watch(angular.bind(this, function() {
        return this['class'];
      }), function(newVal, oldVal) {
        if (newVal != oldVal) {
          var stop = false;
          var mapElement = $element.find('div');
          var promise = $animate.setClass(mapElement, newVal, oldVal);
          $window.requestAnimationFrame(function cb() {
            if (!stop) {
              map.updateSize();
              $window.requestAnimationFrame(cb);
            }
          });
          // the promise is resolved when the animation completes
          promise.then(function() {
            map.updateSize();
            stop = true;
          });
        }
      });
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
