


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * The application-specific scale selector directive.
 *
 * @return {angular.Directive} Directive Definition Object.
 */
app.scaleselectorDirective = function() {
  return {
    restrict: 'E',
    scope: {
      'map': '=appScaleselectorMap'
    },
    templateUrl: 'partials/scaledropdown.html',
    controllerAs: 'ctrl',
    bindToController: true,
    controller: 'AppScaleselectorController'
  };
};


app.module.directive('appScaleselector', app.scaleselectorDirective);



/**
 * @constructor
 * @param {angular.Scope} $scope Directive scope.
 * @param {angular.$timeout} $timeout Angular timeout service.
 * @param {angular.$sce} $sce Angular sce service.
 * @export
 * @ngInject
 */
app.ScaleselectorController = function($scope, $timeout, $sce) {

  /**
   * @type {angular.Scope}
   * @private
   */
  this.$scope_ = $scope;

  /**
   * @type {angular.$timeout}
   * @private
   */
  this.$timeout_ = $timeout;

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.resolutionChangeKey_ = null;

  /**
   * The zoom level/scale map object.
   * @type {Object.<string, string>}
   * @const
   */
  this['scales'] = {
    '0': $sce.trustAsHtml('1&nbsp;:&nbsp;200\'000\'000'),
    '1': $sce.trustAsHtml('1&nbsp;:&nbsp;100\'000\'000'),
    '2': $sce.trustAsHtml('1&nbsp;:&nbsp;50\'000\'000'),
    '3': $sce.trustAsHtml('1&nbsp;:&nbsp;25\'000\'000'),
    '4': $sce.trustAsHtml('1&nbsp;:&nbsp;12\'000\'000')
  };

  /**
   * @type {ol.Map}
   */
  var map = this['map'];
  window.map = map;

  /**
   * @type {string}
   */
  this['currentScale'] = this['scales'][map.getView().getZoom().toString()];

  map.on('change:view', this.handleViewChange_, this);
  this.registerResolutionChangeListener_();

};


/**
 * @param {string} zoom Zoom level.
 * @export
 */
app.ScaleselectorController.prototype.changeZoom = function(zoom) {
  // setZoom triggers a change:resolution event, and our change:resolution
  // handler uses $apply to change the currentScale state, so we use $timeout
  // and make sure that setZoom is called outside Angular context.
  var view = this['map'].getView();
  this.$timeout_(function() {
    view.setZoom(+zoom);
  }, 0, false);
};


/**
 * @param {ol.ObjectEvent} e OpenLayers ObjectEvent.
 * @private
 */
app.ScaleselectorController.prototype.handleResolutionChange_ = function(e) {
  var view = this['map'].getView();
  var currentScale = this['scales'][view.getZoom().toString()];
  this.$scope_.$apply(
      /** @type {function(?)} */ (
      angular.bind(this, function() {
        this['currentScale'] = currentScale;
      })));
};


/**
 * @param {ol.ObjectEvent} e OpenLayers ObjectEvent.
 * @private
 */
app.ScaleselectorController.prototype.handleViewChange_ = function(e) {
  this.registerResolutionChangeListener_();
};


/**
 * @private
 */
app.ScaleselectorController.prototype.registerResolutionChangeListener_ =
    function() {
  if (this.resolutionChangeKey_ !== null) {
    ol.Observable.unByKey(this.resolutionChangeKey_);
  }
  var view = this['map'].getView();
  this.resolutionChangeKey_ = view.on('change:resolution',
      this.handleResolutionChange_, this);
};


app.module.controller('AppScaleselectorController',
    app.ScaleselectorController);



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
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [-10635142.37, 4813698.29],
      zoom: 1,
      maxZoom: 4
    })
  });
  this['map'] = map;

};


app.module.controller('MainController', app.MainController);
