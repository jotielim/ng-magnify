/*global angular*/

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
            controller: function Ctrl ($scope) {

            },
            link: function (scope, element, attrs, Ctrl) {
                var glass = element.find('div'),
                    image = element.find('img'),
                    nWidth, nHeight;

                scope.getContainerStyle = function () {
                    return {
                        width: scope.imageWidth + 'px',
                        height: scope.imageHeight + 'px'
                    };
                };

                scope.getGlassStyle = function () {
                    return {
                        background: 'url(' + scope.imageSrc + ') no-repeat',
                        width: scope.glassWidth + 'px',
                        height: scope.glassHeight + 'px'
                    };
                }

                // if touch devices, do something
                // if () {
                // }
                element.on('mousemove', function (evt) {
                    scope.magnify(evt);
                });

                scope.magnify = function (evt) {
                    var el, mx, my, rx, ry, px, py, bgp, img;

                    if (!nWidth && !nHeight) {
                        img = new Image();
                        img.onload = function () {
                            nWidth = img.width;
                            nHeight = img.height;
                        };
                        img.src = scope.imageSrc;
                    } else {
                        el = {
                            left: element[0].offsetLeft,
                            top: element[0].offsetTop,
                            width: element[0].offsetWidth,
                            height: element[0].offsetHeight
                        };

                        mx = evt.clientX - el.left;
                        my = evt.clientY - el.top;

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

                        glass.css({ left: px+'px', top: py+'px', backgroundPosition: bgp });
                    }
                };
            }
        }
    });
})();