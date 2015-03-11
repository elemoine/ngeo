


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @return {angular.Directive} Directive Definition Object.
 */
app.searchDirective = function() {
  return {
    restrict: 'E',
    scope: {
      'map': '=appSearchMap'
    },
    controller: 'AppSearchController',
    bindToController: true,
    controllerAs: 'ctrl',
    template:
        '<input type="text" placeholder="search…" ' +
        'ngeo-search="ctrl.options" ' +
        'ngeo-search-datasets="ctrl.datasets" ' +
        'ngeo-search-listeners="ctrl.listeners">',
    link:
        /**
         * @param {angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Atttributes.
         */
        function(scope, element, attrs) {
          element.find('input').on('focus', function() {
            $(this).val('');
          });
        }
  };
};


app.module.directive('appSearch', app.searchDirective);



/**
 * @constructor
 * @param {ngeo.CreateGeoJSONBloodhound} ngeoCreateGeoJSONBloodhound The ngeo
 *     create GeoJSON Bloodhound service.
 * @ngInject
 */
app.SearchController = function(ngeoCreateGeoJSONBloodhound) {

  /**
   * @type {ol.FeatureOverlay}
   * @private
   */
  this.featureOverlay_ = this.createFeatureOverlay_();

  /** @type {Bloodhound} */
  var bloodhoundEngine = this.createAndInitBloodhound_(
      ngeoCreateGeoJSONBloodhound);

  /** @type {TypeaheadOptions} */
  this['options'] = null;

  /** @type {Array.<TypeaheadDataset>} */
  this['datasets'] = [{
    source: bloodhoundEngine.ttAdapter(),
    displayKey: function(suggestion) {
      var feature = /** @type {ol.Feature} */ (suggestion);
      return feature.get('label');
    },
    templates: {
      header: function() {
        return '<div class="header">Addresses</div>';
      }
    }
  }];

  this['listeners'] = /** @type {ngeox.SearchDirectiveListeners} */ ({
    selected: angular.bind(this, app.SearchController.selected_)
  });

};


/**
 * @return {ol.FeatureOverlay} The feature overlay.
 * @private
 */
app.SearchController.prototype.createFeatureOverlay_ = function() {
  var featureOverlay = new ol.FeatureOverlay();
  featureOverlay.setMap(this['map']);
  return featureOverlay;
};


/**
 * @param {ngeo.CreateGeoJSONBloodhound} ngeoCreateGeoJSONBloodhound The ngeo
 *     create GeoJSON Bloodhound service.
 * @return {Bloodhound} The bloodhound engine.
 * @private
 */
app.SearchController.prototype.createAndInitBloodhound_ =
    function(ngeoCreateGeoJSONBloodhound) {
  var url = 'http://devv3.geoportail.lu/main/wsgi/fulltextsearch?query=%QUERY';
  var bloodhound = ngeoCreateGeoJSONBloodhound(url, ol.proj.get('EPSG:3857'));
  bloodhound.initialize();
  return bloodhound;
};


/**
 * @param {jQuery.event} event Event.
 * @param {Object} suggestion Suggestion.
 * @param {TypeaheadDataset} dataset Dataset.
 * @this {app.SearchController}
 * @private
 */
app.SearchController.selected_ = function(event, suggestion, dataset) {
  var map = /** @type {ol.Map} */ (this['map']);
  var feature = /** @type {ol.Feature} */ (suggestion);
  var features = this.featureOverlay_.getFeatures();
  var featureGeometry = /** @type {ol.geom.SimpleGeometry} */
      (feature.getGeometry());
  var mapSize = /** @type {ol.Size} */ (map.getSize());
  features.clear();
  features.push(feature);
  map.getView().fitGeometry(featureGeometry, mapSize,
      /** @type {olx.view.FitGeometryOptions} */ ({maxZoom: 16}));
};


app.module.controller('AppSearchController', app.SearchController);



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
