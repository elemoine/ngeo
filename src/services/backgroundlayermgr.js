/**
 * @fileoverview Provides a service for setting/unsetting background layers
 * in maps.
 *
 * The notion of background/base layers doesn't exist in OpenLayers 3. This
 * service adds that notion.
 *
 * Setting a background layer to map is done with the `set` function:
 *
 * ngeoBackgroundLayerMgr.set(map, layer);
 *
 * To unset the background layer pass `null` as the `layer` argument:
 *
 * ngeoBackgroundLayerMgr.set(map, null);
 *
 * The `get` function returns the current background layer of the map passed
 * as an argument. `null` is returned if the map doesn't have a background
 * layer.
 *
 * The background layer is always added at index 0 in the map's layers
 * collection. When a background layer is set it is inserted (at index 0)
 * if the map does not already have a background layer, otherwise the
 * new background layer replaces the previous one at index 0.
 */

goog.provide('ngeo.BackgroundLayerMgr');

goog.require('goog.asserts');
goog.require('ngeo');



/**
 * @constructor
 */
ngeo.BackgroundLayerMgr = function() {
  /**
   * Object used to track if maps have background layers.
   * @type {Object.<string, boolean>}
   * @private
   */
  this.mapUids_ = {};
};


/**
 * Return the current background layer of a given map. `null` is returned if
 * the map does not have a background layer.
 * @param {ol.Map} map Map.
 * @return {ol.layer.Base} layer The background layer.
 */
ngeo.BackgroundLayerMgr.prototype.get = function(map) {
  var mapUid = goog.getUid(map).toString();
  return mapUid in this.mapUids_ ? map.getLayers().item(0) : null;
};


/**
 * Set the background layer of a map. If `layer` is `null` the background layer
 * is removed.
 * @param {ol.Map} map The map.
 * @param {ol.layer.Base} layer The new background layer.
 * @return {ol.layer.Base} The previous background layer.
 */
ngeo.BackgroundLayerMgr.prototype.set = function(map, layer) {
  var mapUid = goog.getUid(map).toString();
  var previous = this.get(map);
  if (!goog.isNull(previous)) {
    goog.asserts.assert(mapUid in this.mapUids_);
    if (!goog.isNull(layer)) {
      map.getLayers().setAt(0, layer);
    } else {
      map.getLayers().removeAt(0);
      delete this.mapUids_[mapUid];
    }
  } else if (!goog.isNull(layer)) {
    map.getLayers().insertAt(0, layer);
    this.mapUids_[mapUid] = true;
  }
  return previous;
};


ngeoModule.service('ngeoBackgroundLayerMgr', ngeo.BackgroundLayerMgr);
