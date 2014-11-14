

(function() {
  var module = angular.module('app', ['ngeo']);

  module.controller('MainController', ['$scope',
    /**
     * @param {angular.Scope} $scope Scope.
     */
    function($scope) {
      /** @type {ol.Map} */
      $scope['map'] = new ol.Map({
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

      /**
       * The "control" directive requires a function that creates the
       * control instance. And that function should be defined on the
       * scope.
       * @param {Element} target Target element.
       * @return {ol.control.MousePosition} Mouse position control.
       */
      $scope['createControl'] = function(target) {
        return new ol.control.MousePosition({
          className: 'mouse-position',
          target: target
        });
      };
    }]);

})();
