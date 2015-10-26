


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


/**
 * An "app-nav" directive defining the behavior of a tree-structured menu.
 *
 * The directive is to be placed on a `nav` element, with the following
 * structure:
 * <nav app-nav>
 *   <header>
 *     <a class="go-back" href="void(0)"></a>
 *     <span>Categories</span>
 *   </header>
 *   <ul>
 *     <li class="has-children">
 *       <a href="void(0)">Devices</a>
 *       <ul class="is-hidden">
 *         <li>
 *           <a href="void(0)">Mobile Phones</a>
 *         </li>
 *         <li>
 *           <a href="void(0)">Televisions</a>
 *         </li>
 *       </ul>
 *     </li>
 *     <li class="has-children">
 *       <a href="void(0)">Cars</a>
 *       <ul class="is-hidden">
 *         <li>
 *           <a href="void(0)">Camping Cars</a>
 *         </li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nav>
 *
 * When an element slides in the directive changes the text in the header.
 *
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
           * @type {Array.<jQuery>}
           */
          var slid = [];

          /**
           * Currently active sliding box.
           * @type {Array.<jQuery>}
           */
          var active = element.find('.active.slide');

          var header = element.find('> header');

          var backButton = element.find('header > .go-back');

          /**
           * @param {boolean} back Whether to move back.
           */
          function updateNavigationHeader(back) {
            back = !!back;
            header.toggleClass('back', back);

            // remove any inactive nav
            header.find('nav:not(.active)').remove();

            // deactivate the currently active nav
            header.find('nav.active').removeClass('active')
                .addClass('slide-out');

            // show the back button when relevant
            backButton.toggleClass('active', slid.length > 0);

            // create a new nav
            nav = $('<nav>');
            nav.append($('<span>', {
              text: active.attr('data-header-title')
            }));
            header.append(nav);
            window.setTimeout(function() {
              nav.addClass('active');
            }, 0);
          }

          // watch for clicks on items with children
          element.find('[data-toggle=slide-in]').on('click', function() {
            // the element to slide out is the div.slide parent
            var slideOut = $(this).parents('.slide');

            // push the item to the selected stack
            slid.push(slideOut);

            // slide the element
            slideOut.addClass('slide-out').removeClass('active');

            // element to slide in
            var slideIn = $($(this).attr('href'));
            slideIn.addClass('active');
            active = slideIn;
            updateNavigationHeader();
          });

          // watch for clicks on the header "go-back" link
          function goBack() {

            // slide active item to the right
            active.removeClass('active');

            // get the previously active item
            var slideBack = slid.pop();

            // slide previous item to the right
            slideBack.addClass('active').removeClass('slide-out');
            active = slideBack;
            updateNavigationHeader(true);
          }

          backButton.click(goBack);
        }
  };
};


app.module.directive('appNav', app.navDirective);



/**
 * @constructor
 * @ngInject
 * @export
 */
app.MainController = function() {

  /**
   * @type {boolean}
   * @export
   */
  this.leftNavVisible = false;

  /**
   * @type {boolean}
   * @export
   */
  this.rightNavVisible = false;

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    })
  });
};


/**
 * @export
 */
app.MainController.prototype.toggleLeftNavVisibility = function() {
  this.leftNavVisible = !this.leftNavVisible;
};


/**
 * @export
 */
app.MainController.prototype.toggleRightNavVisibility = function() {
  this.rightNavVisible = !this.rightNavVisible;
};


/**
 * Hide both navigation menus.
 * @export
 */
app.MainController.prototype.hideNav = function() {
  this.leftNavVisible = this.rightNavVisible = false;
};


/**
 * @return {boolean} Return true if one of the navigation menus is visible,
 * otherwise false.
 * @export
 */
app.MainController.prototype.navIsVisible = function() {
  return this.leftNavVisible || this.rightNavVisible;
};


/**
 * @return {boolean} Return true if the left navigation menus is visible,
 * otherwise false.
 * @export
 */
app.MainController.prototype.leftNavIsVisible = function() {
  return this.leftNavVisible;
};


/**
 * @return {boolean} Return true if the right navigation menus is visible,
 * otherwise false.
 * @export
 */
app.MainController.prototype.rightNavIsVisible = function() {
  return this.rightNavVisible;
};


app.module.controller('MainController', app.MainController);
