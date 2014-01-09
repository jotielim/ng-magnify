/*global angular, DocumentTouch*/

(function () {
  'use strict';

  var magnify = angular.module('ngMagnify', []);

  magnify.directive('ngMagnify', function () {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div class="magnify-container" data-ng-style="getContainerStyle()">' +
                  '<div class="magnify-glass" data-ng-style="getGlassStyle()"></div>' +
                  '<img class="magnify-image" data-ng-src="{{ imageSrc }}"/>' +
                '</div>',
      scope: {
        imageSrc: '@',
        imageWidth: '=',
        imageHeight: '=',
        glassWidth: '=',
        glassHeight: '='
      },
      link: function (scope, element) {
        var glass = element.find('div'),
          image = element.find('img'),
          el = {},
          elOffset, nWidth, nHeight, magnifyCSS;

        // if touch devices, do something
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          return;
        }
        element.on('mouseenter', function () {
          elOffset = scope.getOffset(element[0]);
          el = {
            top: elOffset.top,
            left: elOffset.left,
            width: element[0].offsetWidth,
            height: element[0].offsetHeight,
            imageWidth: image[0].offsetWidth,
            imageHeight: image[0].offsetHeight,
            glassWidth: glass[0].offsetWidth,
            glassHeight: glass[0].offsetHeight
          };
        })
        .on('mousemove', function (evt) {
          elOffset = scope.getOffset(element[0]);
          el.top = elOffset.top;
          el.left = elOffset.left;
          magnifyCSS = scope.magnify(evt);

          if (magnifyCSS) {
            glass.css( magnifyCSS );
          }
        })
        .on('mouseout', function () {
          glass.on('mouseleave', function () {
            glass.css({
              display: 'none',
              opacity: 0,
              filter: 'alpha(opacity=0)'
            });
          });
        });

        scope.magnify = function (evt) {
          var mx, my, rx, ry, px, py, bgp, img;

          if (!nWidth && !nHeight) {
            img = new Image();
            img.onload = function () {
              nWidth = img.width;
              nHeight = img.height;
            };
            img.src = scope.imageSrc;
          } else {
            // IE8 uses evt.x and evt.y
            mx = (evt.pageX) ? (evt.pageX - el.left) : evt.x;
            my = (evt.pageY) ? (evt.pageY - el.top) : evt.y;

            if (mx < el.width && my < el.height && mx > 0 && my > 0) {
              glass.css({
                display: 'block',
                opacity: 1,
                filter: 'alpha(opacity=100)'
              });
            } else {
              glass.css({
                display: 'none',
                opacity: 0,
                filter: 'alpha(opacity=0)'
              });
              return;
            }

            if (el.glassWidth === 0 || el.glassHeight === 0) {
              el.glassWidth = glass[0].offsetWidth;
              el.glassHeight = glass[0].offsetHeight;
            }
            rx = Math.round(mx/el.imageWidth*nWidth - el.glassWidth/2)*-1;
            ry = Math.round(my/el.imageHeight*nHeight - el.glassHeight/2)*-1;
            bgp = rx + 'px ' + ry + 'px';

            px = mx - el.glassWidth/2;
            py = my - el.glassHeight/2;

            return { left: px+'px', top: py+'px', backgroundPosition: bgp };
          }
          return;
        };

        // Element contains another - from jquery sizzle.js
        // use native Node.contains, otherwise use Node.compareDocumentPosition, otherwise traverse DOM
        // explanation can be found here:
        // http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
        var rnative = /^[^{]+\{\s*\[native \w/,
          hasCompare = rnative.test(element[0].compareDocumentPosition);
        scope.contains = hasCompare || rnative.test(element[0].contains) ?
          function (a, b) {
            /*jshint bitwise: false*/
            var adown = a.nodeType === 9 ? a.documentElement : a,
              bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && (
              adown.contains ?
                adown.contains(bup) :
                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
          } :
          function (a, b) {
            if (b) {
              while ((b = b.parentNode)) {
                if (b === a) {
                  return true;
                }
              }
            }
            return false;
          };

        // from jquery.js - getWindow
        scope.getWindow = function (elem) {
          return (elem !== null && elem === elem.window) ?
            elem :
            elem.nodeType === 9 ?
              elem.defaultView || elem.parentWindow :
              false;
        };

        // from jquery.js - jQuery.fn.offset
        scope.getOffset = function (elem) {
          var docElem, win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

          if (!doc) {
            return;
          }

          docElem = doc.documentElement;

          // Make sure it's not a disconnected DOM node
          if (!scope.contains(docElem, elem)) {
            return box;
          }

          // If we don't have gBCR, just use 0,0 rather than error
          // BlackBerry 5, iOS 3 (original iPhone)
          if ( typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
          }
          win = scope.getWindow(doc);
          return {
            top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
          };
        };

        scope.getContainerStyle = function () {
          return {
            width: (scope.imageWidth) ? scope.imageWidth + 'px' : '',
            height: (scope.imageHeight) ? scope.imageHeight + 'px' : ''
          };
        };

        scope.getGlassStyle = function () {
          return {
            background: 'url(' + scope.imageSrc + ') no-repeat',
            width: (scope.glassWidth) ? scope.glassWidth + 'px' : '',
            height: (scope.glassHeight) ? scope.glassHeight + 'px' : ''
          };
        };
      }
    };
  });
})();
