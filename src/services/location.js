/**
 * @fileoverview Provides a service for interacting with the URL in the
 * browser address bar.
 *
 * WARNING: Because of a bug in Angular this service is not compatible with
 * the $location service. This further means that service is not compatible
 * with the $anchorScroll and $route services, and with the ng-include and
 * ng-view directives (which are based on the $anchorScroll and $route
 * services). See <https://github.com/angular/angular.js/issues/1417>.
 *
 * You can call `foolLocation` on the ngeo location provider to work-around
 * the bug. This is not bullet-proof but it may work for your application.
 *
 * app.config_ = function(ngeoLocationProvider) {
 *   ngeoLocationProvider.foolLocation();
 * };
 * app.module.config(app.config_);
 */

goog.provide('ngeo.Location');
goog.provide('ngeo.LocationProvider');

goog.require('goog.Uri');
goog.require('goog.object');
goog.require('ngeo');



/**
 * The ngeo Location type.
 * @param {Location} location Location.
 * @param {History} history History.
 * @constructor
 */
ngeo.Location = function(location, history) {
  /**
   * @type {History}
   * @private
   */
  this.history_ = history;

  /**
   * @type {!goog.Uri}
   * @private
   */
  this.uri_ = goog.Uri.parse(location);
};


/**
 * @param {Object.<string, string>=} opt_params Params.
 * @return {string} The URI.
 */
ngeo.Location.prototype.getUri = function(opt_params) {
  var extendedUri;
  if (goog.isDef(opt_params)) {
    extendedUri = this.uri_.clone();
    extendedUri.getQueryData().extend(opt_params);
  } else {
    extendedUri = this.uri_;
  }
  return extendedUri.toString();
};


/**
 * @param {string} key Param key.
 * @return {string} Param value.
 */
ngeo.Location.prototype.getParam = function(key) {
  return /** @type {string} */ (this.uri_.getQueryData().get(key));
};


/**
 * @param {Object.<string, string>} params
 */
ngeo.Location.prototype.updateParams = function(params) {
  var qd = this.uri_.getQueryData();
  goog.object.forEach(params, function(val, key) {
    qd.set(key, val);
  });
};


/**
 * @param {string} key Param key.
 */
ngeo.Location.prototype.deleteParam = function(key) {
  this.uri_.getQueryData().remove(key);
};


/**
 */
ngeo.Location.prototype.refresh = function() {
  this.history_.replaceState(null, '', this.getUri());
};



/**
 * The location provider constructor.
 * @constructor
 * @export
 */
ngeo.LocationProvider = function() {
  /**
   * @type {boolean}
   * @private
   */
  this.foolLocation_ = false;
};


/**
 * @param {string} url URL.
 * @param {angular.$injector} injector Angular injector service.
 * @private
 */
ngeo.LocationProvider.prototype.maybeFoolLocation_ = function(url, injector) {
  if (this.foolLocation_) {
    var locationService = /** @type {angular.$location} */
        (injector.get('$location'));
    // try to fool the $location service
    locationService['$$absUrl'] = url;
  }
};


/**
 * @param {angular.Scope} $rootScope The root scope.
 * @param {angular.$window} $window Angular window service.
 * @param {angular.$injector} $injector Angular injector service.
 * @return {ngeo.Location} The ngeo location service.
 * @ngInject
 * @export
 */
ngeo.LocationProvider.prototype.$get =
    function($rootScope, $window, $injector) {
  var history = $window.history;
  var service = new ngeo.Location($window.location, $window.history);

  var lastUri = service.getUri();
  $rootScope.$watch(goog.bind(function() {
    var newUri = service.getUri();
    if (lastUri !== newUri) {
      $rootScope.$evalAsync(goog.bind(function() {
        lastUri = newUri;
        if (goog.isDef(history) && goog.isDef(history.replaceState)) {
          this.maybeFoolLocation_(newUri, $injector);
          history.replaceState(null, '', newUri);
        }
        $rootScope.$broadcast('ngeoLocationChange');
      }, this));
    }
  }, this));

  return service;
};


/**
 * Function to enable the "fool $location" hack. The hack is a workaround for
 * @see https://github.com/angular/angular.js/issues/1417.
 */
ngeo.LocationProvider.prototype.foolLocation = function() {
  this.foolLocation_ = true;
};


ngeoModule.provider('ngeoLocation', function() {
  return new ngeo.LocationProvider();
});
