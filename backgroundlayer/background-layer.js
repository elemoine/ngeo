


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
 * <select app-bglayer="ctrl.map" ng-model="ctrl.bgLayer"
 *     ng-options="layer.get('label') for layer in ctrl.bgLayers">
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
          var expr;

          expr = attrs['appBglayer'];
          var map = /** @type {ol.Map} */ (scope.$eval(expr));

          expr = attrs['ngModel'];
          scope.$watch(expr, function(newVal, oldVal) {
            var layer = /** @type {ol.layer.Layer} */ (newVal);
            map.getLayers().setAt(0, layer);
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
      center: [0, 0],
      zoom: 4
    })
  });
  this['map'] = map;

  /**
   * @type {ol.layer.Tile}
   */
  var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  osmLayer.set('label', 'OSM');

  /**
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
  this['bgLayers'] = [osmLayer, stamenLayer];

  /**
   * The current background layer.
   * @type {ol.layer.Layer}
   */
  this['bgLayer'] = osmLayer;
};


app.module.controller('MainController', app.MainController);
