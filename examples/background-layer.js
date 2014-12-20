goog.provide('backgroundlayer');

goog.require('ngeo.mapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Image');
goog.require('ol.layer.Tile');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.OSM');
goog.require('ol.source.Stamen');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * Directive used together with ng-model to set a new layer at index 0 in the
 * map when the model changes. To be used with a select control and ng-options.
 *
 * Example usage:
 *
 * <select ng-model="ctrl.bgLayer"
 *     ng-options="layer.get('label') for layer in ctrl.bgLayers"
 *     app-bglayer="ctrl.bgLayers" app-bglayers-map="ctrl.map">
 * </select>
 *
 * @return {angular.Directive} Directive Definition Object.
 */
app.bglayerDirective = function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link:
        /**
         * @param {angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Attributes.
         */
        function(scope, element, attrs) {

          var bgLayers = /** @type {Array.<ol.layer.Layer>} */
              (scope.$eval(attrs['appBglayer']));

          var map = /** @type {ol.Map} */
              (scope.$eval(attrs['appBglayerMap']));

          scope.$watch(attrs['ngModel'], function(newVal, oldVal) {
            var newLayer = /** @type {ol.layer.Layer} */ (newVal);
            var layersCollection = map.getLayers();
            var curLayer = layersCollection.item(0);
            if (bgLayers.indexOf(curLayer) >= 0) {
              layersCollection.setAt(0, newLayer);
            } else {
              layersCollection.insertAt(0, newLayer);
            }
          });
        }
  };
};


app.module.directive('appBglayer', app.bglayerDirective);



/**
 * @constructor
 * @param {angular.Scope} $scope Controller scope.
 * @ngInject
 */
app.MainController = function($scope) {

  /**
   * @type {ol.Map}
   */
  var map = new ol.Map({
    view: new ol.View({
      center: [-10635142.37, 4813698.29],
      zoom: 4
    })
  });
  this['map'] = map;

  /**
   * The "Blank" background layer.
   * @type {ol.layer.Tile}
   */
  var blankLayer = new ol.layer.Tile();
  blankLayer.set('label', 'Blank');

  /**
   * The "OSM" background layer.
   * @type {ol.layer.Tile}
   */
  var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  osmLayer.set('label', 'OSM');

  /**
   * The "Stamen" background layer.
   * @type {ol.layer.Tile}
   */
  var stamenLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'watercolor'
    })
  });
  stamenLayer.set('label', 'Stamen');

  /**
   * The background layers.
   * @type {Array.<ol.layer.Layer>}
   */
  this['bgLayers'] = [blankLayer, osmLayer, stamenLayer];

  /**
   * The current background layer.
   * @type {ol.layer.Layer}
   */
  this['bgLayer'] = blankLayer;

  /**
   * An overlay layer.
   * @type {ol.layer.Image}
   */
  var overlay = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: 'http://demo.boundlessgeo.com/geoserver/wms',
      params: {'LAYERS': 'topp:states'},
      serverType: 'geoserver'
    })
  });

  map.addLayer(overlay);

};


app.module.controller('MainController', app.MainController);
