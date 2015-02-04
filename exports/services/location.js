goog.require('ngeo.Location');
goog.require('ngeo.LocationProvider');

goog.exportProperty(
    ngeo.Location.prototype,
    'getUri',
    ngeo.Location.prototype.getUri);
goog.exportProperty(
    ngeo.Location.prototype,
    'getParam',
    ngeo.Location.prototype.getParam);
goog.exportProperty(
    ngeo.Location.prototype,
    'updateParams',
    ngeo.Location.prototype.updateParams);
goog.exportProperty(
    ngeo.Location.prototype,
    'deleteParam',
    ngeo.Location.prototype.deleteParam);
goog.exportProperty(
    ngeo.Location.prototype,
    'refresh',
    ngeo.Location.prototype.refresh);

goog.exportProperty(
    ngeo.LocationProvider.prototype,
    'foolLocation',
    ngeo.LocationProvider.prototype.foolLocation);
