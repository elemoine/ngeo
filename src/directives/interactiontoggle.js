goog.provide('go_interactiontoggle_directive');

goog.require('go');
goog.require('goog.asserts');


goModule.constant('goInteractionToggleActiveClass', 'active');


/**
 * This directive listens to "click" events on the element and
 * toggles (a) the "active" class on the element, and (b) the
 * OpenLayers interaction.
 */
goModule.directive('goInteractionToggle', ['goInteractionToggleActiveClass',

  /**
   * @param {string} goInteractionToggleActiveClass The "active" class name.
   * @return {angular.Directive} The directive specs.
   */
  function(goInteractionToggleActiveClass) {
    var activeClass = goInteractionToggleActiveClass;

    return {
      restrict: 'A',
      scope: {
        'interaction': '=goInteractionToggle',
        'map': '=goMap'
      },
      link:
          /**
           * @param {angular.Scope} scope Scope.
           * @param {angular.JQLite} element Element.
           * @param {angular.Attributes} attrs Attributes.
           */
          function(scope, element, attrs) {
            /** @type {ol.interaction.Interaction} */
            var interaction = scope['interaction'];
            goog.asserts.assertInstanceof(
                interaction, ol.interaction.Interaction);

            /** @type {ol.Map} */
            var map = scope['map'];
            goog.asserts.assertInstanceof(map, ol.Map);

            // UI -> model
            element.bind('click', function() {
              if (goog.isNull(interaction.getMap())) {
                map.addInteraction(interaction);
              } else {
                map.removeInteraction(interaction);
              }
            });

            // model -> UI
            var interactions = map.getInteractions();
            interactions.on('add', function(e) {
              if (e.element == interaction) {
                element.addClass(activeClass);
              }
            });
            interactions.on('remove', function(e) {
              if (e.element == interaction) {
                element.removeClass(activeClass);
              }
            });

            // initial state
            element.toggleClass(
                activeClass, !goog.isNull(interaction.getMap()));
          }
    };
  }]);
