


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @return {angular.Directive} Directive Definition Object.
 */
app.searchDirective = function() {
  return {
    restrict: 'A',
    controller: 'AppSearchController'
  };
};


app.module.directive('appSearch', app.searchDirective);



/**
 * @constructor
 * @param {angular.Scope} $scope Angular scope.
 * @param {angular.JQLite} $element jQuery element.
 * @param {angular.Attributes} $attrs Element attributes.
 * @ngInject
 */
app.SearchController = function($scope, $element, $attrs) {

  var map = /** @type {ol.Map} */ ($scope.$eval($attrs['appSearchMap']));
  // goog.asserts.assertInstanceof(map, ol.Map);

  var featureOverlay = new ol.FeatureOverlay();
  featureOverlay.setMap(map);

  var geojsonFormat = new ol.format.GeoJSON();

  var engine = new Bloodhound(/** @type {BloodhoundOptions} */ ({
    remote: {
      url: 'http://devv3.geoportail.lu/main/wsgi/fulltextsearch?query=%QUERY',
      ajax: {
        dataType: 'jsonp'
      },
      filter: function(parsedResponse) {
        var featureCollection = /** @type {GeoJSONFeatureCollection} */
            (parsedResponse);
        return geojsonFormat.readFeatures(featureCollection,
            {featureProjection: 'EPSG:3857'});
      }
    },
    // datumTokenizer is required by the Bloodhound constructor but it
    // is not used when only a remote is passsed to Bloodhound.
    datumTokenizer: function(datum) {},
    queryTokenizer: Bloodhound.tokenizers.whitespace
  }));

  engine.initialize();

  $element.typeahead(null, {
    source: engine.ttAdapter(),
    displayKey: function(suggestion) {
      var feature = /** @type {ol.Feature} */ (suggestion);
      return feature.get('label');
    }
  });

  $element.on('typeahead:selected', function(element, suggestion, dataset) {
    var feature = /** @type {ol.Feature} */ (suggestion);
    var features = featureOverlay.getFeatures();
    var featureGeometry = /** @type {ol.geom.SimpleGeometry} */
        (feature.getGeometry());
    var mapSize = /** @type {ol.Size} */ (map.getSize());
    features.clear();
    features.push(feature);
    map.getView().fitGeometry(featureGeometry, mapSize,
        /** @type {olx.view.FitGeometryOptions} */ ({maxZoom: 16}));
  });

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
