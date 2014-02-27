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

  module('jQuery#kerning', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit1');
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.kerning(), this.elems, 'should be chainable');
  });

  test('is readable', function() {
    expect(1);
    strictEqual(this.elems.kerning().text(), 'これは、テストです。', 'should be readable');
  });

  test('is kerned with no options', function() {
    expect(1);
    equal(this.elems.kerning().html(), 2, 'should be kerned with no options');
  });

  module('jQuery.kerning');

  test('is awesome', function() {
    expect(2);
    strictEqual($.kerning(), 'awesome.', 'should be awesome');
    strictEqual($.kerning({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  });

  module(':kerning selector', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture');
    }
  });

  test('is awesome', function() {
    expect(1);
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':kerning').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });

}(jQuery));
