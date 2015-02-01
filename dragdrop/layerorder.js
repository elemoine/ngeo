


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);



/**
 * @param {angular.Scope} $scope Scope.
 * @param {ngeo.DecorateLayer} ngeoDecorateLayer Decorate layer service.
 * @constructor
 * @ngInject
 */
app.MainController = function($scope, ngeoDecorateLayer) {

  /** @type {ol.layer.Tile} */
  var boundaries = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://demo.opengeo.org/geoserver/wms',
      params: {'LAYERS': 'topp:tasmania_state_boundaries'},
      serverType: 'geoserver'
    }),
    name: 'Boundaries'
  });

  /** @type {ol.layer.Tile} */
  var roads = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://demo.opengeo.org/geoserver/wms',
      params: {'LAYERS': 'topp:tasmania_roads'},
      serverType: 'geoserver'
    }),
    name: 'Roads'
  });

  /** @type {ol.layer.Tile} */
  var waterBodies = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://demo.opengeo.org/geoserver/wms',
      params: {'LAYERS': 'topp:tasmania_water_bodies'},
      serverType: 'geoserver'
    }),
    name: 'Water bodies'
  });

  /** @type {ol.layer.Tile} */
  var cities = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://demo.opengeo.org/geoserver/wms',
      params: {'LAYERS': 'topp:tasmania_cities'},
      serverType: 'geoserver'
    }),
    name: 'Cities'
  });


  /** @type {ol.Map} */
  this['map'] = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'}),
        name: 'MapQuest'
      }),
      boundaries,
      roads,
      waterBodies,
      cities
    ],
    view: new ol.View({
      center: [16339075, -5194965],
      zoom: 7
    })
  });

  // watch any change on layers array to refresh the map
  $scope.layers = this['map'].getLayers().getArray();
  $scope.$watchCollection('layers', goog.bind(function() {
    this['map'].render();
  }, this));
};


app.module.controller('MainController', app.MainController);
