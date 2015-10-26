


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);



/**
 * @constructor
 * @param {Document} $document Document.
 * @export
 * @ngInject
 */
app.MainController = function($document) {

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


};


/**
 * @export
 */
app.MainController.prototype.saveKML = function() {
  var features = this.vectorSource_.getFeatures();
  var kml = this.kmlFormat_.writeFeatures(features);

  var charset = this.$document_.characterSet || 'UTF-8';
  var type = 'application/vnd.google-earth.kml+xml;charset=' + charset;
  var blob = new Blob([kml], {type: type});

  saveAs(blob, 'file.kml');
};


app.module.controller('MainController', app.MainController);
