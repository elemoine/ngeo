goog.provide('app.navDirective');

goog.require('app');


/**
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 */
app.navDirective = function() {
  return {
    restrict: 'A',
    link:
        /**
         * @param {angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Atttributes.
         */
        function(scope, element, attrs) {

          /**
           * Stack of slid-in items.
           * @type {Array.<!jQuery>}
           */
          var slid = [];
          /**
           * Currently active sliding box.
           * @type {!jQuery}
           */
          var active = $(element.find('.active.slide'));

          /**
           * The navigation header.
           * @type {!jQuery}
           */
          var header = $(element.find('> header'));

          /**
           * The back button in the navigation header.
           * @type {!jQuery}
           */
          var backButton = $(element.find('header > .go-back'));

          // watch for clicks on "slide-in" elements
          element.find('[data-toggle=slide-in]').on('click', function() {

            // the element to slide out is the div.slide parent
            var slideOut = $(this).parents('.slide');

            // push the item to the selected stack
            slid.push(slideOut);

            // slide the "old" element out
            slideOut.addClass('slide-out').removeClass('active');

            // element to slide in
            var slideIn = $($(this).attr('href'));

            // slide the "new" element in
            slideIn.addClass('active');

            // update the navigation header
            updateNavigationHeader(slideIn, false);

            active = slideIn;
          });

          // watch for clicks on the header "go-back" link
          backButton.click(function() {
            // slide active item to the right
            active.removeClass('active');

            // get the previously active item
            var slideBack = slid.pop();

            // slide previous item to the right
            slideBack.addClass('active').removeClass('slide-out');

            // update the navigation header
            updateNavigationHeader(slideBack, true);

            active = slideBack;
          });

          /**
           * @param {!jQuery} active The currently active sliding box.
           * @param {boolean} back Whether to move back.
           */
          function updateNavigationHeader(active, back) {
            header.toggleClass('back', back);

            // remove any inactive nav
            header.find('nav:not(.active)').remove();

            // deactivate the currently active nav
            header.find('nav.active').removeClass('active')
                .addClass('slide-out');

            // show the back button when relevant
            backButton.toggleClass('active', slid.length > 0);

            // create a new nav
            var nav = $('<nav>');
            nav.append($('<span>', {
              text: active.attr('data-header-title')
            }));
            header.append(nav);

            // Delay the activation of the new navigation so that the previous
            // one is properly deactivated. This prevents weird animation
            // effects.
            window.setTimeout(function() {
              nav.addClass('active');
            }, 0);
          }

        }
  };
};


app.module.directive('appNav', app.navDirective);
