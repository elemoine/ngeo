goog.provide('exportfeatures');

goog.require('ngeo.mapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.format.KML');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.OSM');
goog.require('ol.source.Vector');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @param {angular.$window} $window The Angular window service.
 * @return {angular.Directive} Directive Definition Object.
 * @ngInject
 */
app.filereadDirective = function($window) {
  if (!$window.FileReader) {
    throw new Error('Browser does not support FileReader');
  }
  return {
    restrict: 'A',
    scope: {
      'fileread': '=appFileread'
    },
    link:
        /**
         * @param {angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Attributes.
         */
        function(scope, element, attrs) {
          element.bind('change', function(changeEvent) {
            var fileReader = new FileReader();
            fileReader.onload = function(loadEvent) {
              scope.$apply(function() {
                scope.fileread = loadEvent.target.result;
              });
            };
            fileReader.readAsText(changeEvent.target.files[0]);
          });
        }
  };
};


app.module.directive('appFileread', app.filereadDirective);



/**
 * @constructor
 * @param {angular.Scope} $scope Scope.
 * @param {Document} $document Document.
 * @export
 * @ngInject
 */
app.MainController = function($scope, $document) {

  /**
   * @private
   * @type {Document}
   */
  this.$document_ = $document;

  /**
   * @private
   * @type {ol.format.KML}
   */
  this.kmlFormat_ = new ol.format.KML();

  /**
   * @private
   * @type {ol.source.Vector}
   */
  this.vectorSource_ = new ol.source.Vector({
    url: 'data/2012-02-10.kml',
    format: this.kmlFormat_
  });

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Vector({
        source: this.vectorSource_
      })
    ],
    view: new ol.View({
      center: [876970.8463461736, 5859807.853963373],
      zoom: 10
    })
  });

  /**
   * @type {string}
   * @export
   */
  this.fileread = '';

  $scope.$watch(angular.bind(this, function() {
    return this.fileread;
  }), angular.bind(this, this.importKml_));

};


/**
 * @export
 */
app.MainController.prototype.exportAsKml = function() {
  var features = this.vectorSource_.getFeatures();
  var kml = this.kmlFormat_.writeFeatures(features);

  var charset = this.$document_.characterSet || 'UTF-8';
  var type = 'application/vnd.google-earth.kml+xml;charset=' + charset;
  var blob = new Blob([kml], {type: type});

  saveAs(blob, 'file.kml');
};


/**
 * @param {string} kml KML document.
 * @private
 */
app.MainController.prototype.importKml_ = function(kml) {
  var features = this.kmlFormat_.readFeatures(kml);
  this.vectorSource_.clear(true);
  this.vectorSource_.addFeatures(features);
};


app.module.controller('MainController', app.MainController);
