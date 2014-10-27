

(function() {
  var module = angular.module('app', ['ngeo']);

  module.controller('MainController', ['$scope', 'ngeoDecorateLayer',
    /**
     * @param {angular.Scope} $scope Scope.
     * @param {ngeo.DecorateLayer} ngeoDecorateLayer Decorate layer service.
     */
    function($scope, ngeoDecorateLayer) {

      /** @type {ol.layer.Tile} */
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      ngeoDecorateLayer(layer);
      $scope['layer'] = layer;

      /** @type {ol.Map} */
      $scope['map'] = new ol.Map({
        layers: [layer],
        view: new ol.View({
          center: [0, 0],
          zoom: 4
        })
      });
    }]);
})();
