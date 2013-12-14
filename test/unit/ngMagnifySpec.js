'use strict';

/* jasmine specs */
describe('ngMagnify Directive', function () {
  var $compile, $rootScope;

  // load the module that contains the directive
  beforeEach(module('ngMagnify'));

  beforeEach(function () {
    this.addMatchers({
      toHaveClass: function (className) {
        return this.actual.hasClass(className);
      }
    });
  });

  // store references to $compile and $rootScope
  beforeEach(inject(function (_$compile_, _$rootScope_) {
    // from the doc, the injector unwraps the underscores (_)
    // from around the parameter names when matchin
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should replace the element with the correct content', function () {
    // compile the directive
    var element = $compile('<ng-magnify image-src="img/nexus5.jpg"></ng-magnify>')($rootScope);

    // fire all the watches so the expression will be evaluated
    $rootScope.$digest();

    expect(element).toHaveClass('magnify-container');
    expect(element.find('div')).toHaveClass('magnify-glass');
    expect(element.find('img')).toHaveClass('magnify-image');
    expect(element.find('img').attr('src')).toEqual('img/nexus5.jpg');
  });

});
