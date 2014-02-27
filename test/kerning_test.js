(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery.kerning', {
    // This will run before each test in this module.
    setup: function() {
      this.h1 = $('h1');
      this.h1_text = this.h1.text();
      this.h2 = $('h2');
      this.h2_text = this.h2.text();
    }
  });

  test('is chainable', function() {
    expect(2);
    // Not a bad test to run on collection methods.
    strictEqual(this.h1.kerning(), this.h1, 'should be chainable');
    strictEqual(this.h2.kerning(), this.h2, 'should be chainable');
  });

  test('is readable', function() {
    expect(2);
    strictEqual(this.h1.kerning().text(), this.h1_text, 'is readable');
    strictEqual(this.h2.kerning().text(), this.h2_text, 'is readable');
  });

  test('Can use with no option', function() {
    expect(2);
    strictEqual(this.h1.kerning().find('[data-kerned]').length, 2, 'should be kerned with no options');
    strictEqual(this.h2.kerning().find('[data-kerned]').length, 0, 'should be kerned with no options');
  });

  // test('Can destroy', function() {
  //   expect(1);
  //   strictEqual(this.elems.html(), this.elems.kerning().html(), 'should be kerned with no options');
  // });
  
  // test('is awesome', function() {
  //   expect(2);
  //   strictEqual($.kerning(), 'awesome.', 'should be awesome');
  //   strictEqual($.kerning({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  // });

}(jQuery));
