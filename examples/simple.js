goog.provide('simple');

goog.require('ngeo.mapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @return {angular.Directive} The directive specs.
 * @ngInject
 */
app.testDirective = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/test.html'
  };
};

app.module.directive('appTest', app.testDirective);



/**
 * @constructor
 */
app.MainController = function() {
  /**
   * @type {ol.Map}
   */
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
};


app.module.controller('MainController', app.MainController);
