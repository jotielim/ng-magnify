/*global angular, DocumentTouch*/

(function () {
    'use strict';

    var magnify = angular.module('ngMagnifyModule', []);

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
            link: function (scope, element, attrs) {
                var glass = element.find('div'),
                    image = element.find('img'),
                    el, nWidth, nHeight;

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

                // if touch devices, do something
                if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                    return;
                }
                element.on('mouseenter', function () {
                    el = angular.extend(getOffset(element[0]), {
                        width: element[0].offsetWidth,
                        height: element[0].offsetHeight
                    });
                })
                .on('mousemove', function (evt) {
                    if (magnify(evt)) {
                        glass.css( magnify(evt) );
                    }
                })
                .on('mouseout', function () {
                    glass.on('mouseleave', function () {
                        glass.css('display', 'none');
                    });
                });

                function magnify (evt) {
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
                            glass.css('display', 'block');
                        } else {
                            glass.css('display', 'none');
                            return;
                        }

                        rx = Math.round(mx/image[0].offsetWidth*nWidth - glass[0].offsetWidth/2)*-1;
                        ry = Math.round(my/image[0].offsetHeight*nHeight - glass[0].offsetHeight/2)*-1;
                        bgp = rx + 'px ' + ry + 'px';

                        px = mx - glass[0].offsetWidth/2;
                        py = my - glass[0].offsetHeight/2;

                        // glass.css({ left: px+'px', top: py+'px', backgroundPosition: bgp });
                        return { left: px+'px', top: py+'px', backgroundPosition: bgp };
                    }
                    return;
                }

                function getOffset (el) {
                    var offsetLeft = 0,
                        offsetTop = 0;

                    do {
                        if (!isNaN(el.offsetLeft)) {
                            offsetLeft += el.offsetLeft;
                            offsetTop += el.offsetTop;
                        }
                    } while (el = el.offsetParent);

                    return {
                        left: offsetLeft,
                        top: offsetTop
                    };
                }
            }
        };
    });
})();
