


/** @const **/
var app = {};


/** @type {!angular.Module} **/
var module = angular.module('app', ['ngeo']);



/**
 * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
 *     interaction service.
 * @constructor
 * @ngInject
 */
app.MainController = function(ngeoDecorateInteraction) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
      })
    ],
    view: new ol.View({
      center: [-10997148, 4569099],
      zoom: 4
    })
  });

  var map = this.map;

  var featureOverlay = new ol.FeatureOverlay();
  featureOverlay.setMap(map);

  /**
   * @type {ol.interaction.Draw}
   * @export
   */
  this.interaction = new ol.interaction.Draw(
      /** @type {olx.interaction.DrawOptions} */ ({
        type: 'Point',
        features: featureOverlay.getFeatures()
      }));

  var interaction = this.interaction;
  interaction.setActive(false);
  map.addInteraction(interaction);
  ngeoDecorateInteraction(interaction);

};


module.controller('MainController', app.MainController);
