

(function() {
  var module = angular.module('app', ['ngeo']);

  module.controller('MainController', ['$scope', 'ngeoDecorateInteraction',
    /**
     * @param {angular.Scope} $scope Scope.
     * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
     *     interaction service.
     */
    function($scope, ngeoDecorateInteraction) {

      var source = new ol.source.Vector();

      var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      });

      /** @type {ol.Map} */
      var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
          }),
          vector
        ],
        view: new ol.View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      });
      $scope['map'] = map;

      /** @type {ol.interaction.Draw} */
      var drawPolygon = new ol.interaction.Draw(
          /** @type {olx.interaction.DrawOptions} */ ({
            type: 'Polygon',
            source: source
          }));
      ngeoDecorateInteraction(drawPolygon, map);
      this['drawPolygon'] = drawPolygon;

      /** @type {ol.interaction.Draw} */
      var drawPoint = new ol.interaction.Draw(
          /** @type {olx.interaction.DrawOptions} */ ({
            type: 'Point',
            source: source
          }));
      ngeoDecorateInteraction(drawPoint, map);
      this['drawPoint'] = drawPoint;

      /** @type {ol.interaction.Draw} */
      var drawLine = new ol.interaction.Draw(
          /** @type {olx.interaction.DrawOptions} */ ({
            type: 'LineString',
            source: source
          }));
      ngeoDecorateInteraction(drawLine, map);
      this['drawLine'] = drawLine;

    }]);

})();
