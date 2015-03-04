



/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);



/**
 * @constructor
 * @param {angular.$http} $http The $http angular service.
 * @param {angular.Scope} $scope The $scope angular service.
 */
app.MainController = function($http, $scope) {

  $http.get('data/profile.json').then(angular.bind(this, function(resp) {
    this['profileData'] = resp.data['profile'];
  }));

  /**
   * @param {Object} item
   * @return {number}
   */
  var z = function(item) {
    return item['values']['mnt'];
  };

  /**
    * @param {Object} item
    * @return {number}
    */
  var dist = function(item) {
    return item['dist'];
  };

  /**
   * @type {ngeox.profile.ProfileExtractor}
   */
  var extractor = {z: z, dist: dist};


  // Using closures for hoverCallback and outCallback since
  // wrapping in angular.bind leads to a closure error.
  // See PR https://github.com/google/closure-compiler/pull/867
  var that = this;

  /**
   * @param {Object} point
   */
  var hoverCallback = function(point) {
    // An item in the list of points given to the profile.
    that['point'] = point;
  };

  var outCallback = function() {
    that['point'] = null;
  };


  this['profileOptions'] = {
    extractor: extractor,
    hoverCallback: hoverCallback,
    outCallback: outCallback
  };


  this['point'] = null;
};


app.module.controller('MainController', app.MainController);
