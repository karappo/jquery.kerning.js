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

  module('jQuery.kerning.js - with no option', {
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
    strictEqual(this.h1.kerning(), this.h1);
    strictEqual(this.h2.kerning(), this.h2);
  });

  test('元のテキストと同じように読める', function() {
    expect(2);
    strictEqual(this.h1.kerning().text(), this.h1_text);
    strictEqual(this.h2.kerning().text(), this.h2_text);
  });

  test('オプションなしの場合、約物のみカーニングする', function() {
    expect(2);
    strictEqual(this.h1.kerning().find('[data-kerned]').length, 2);
    strictEqual(this.h2.kerning().find('[data-kerned]').length, 0);
  });

  module('jQuery.kerning.js - with option', {
    // This will run before each test in this module.
    setup: function() {
      this.h1 = $('h1');
      this.h2 = $('h2');
      this.h3 = $('h3');
      this.p = $('#paragraph');

      $.getJSON("./data/mplus-2m-regular.json" , function(_data) {
        $('.kern').kerning({"data":data});
      });

      this.kerningdata = [
        {
          "font":"M+ 1mn Regular",
          "kerning":{
            "あ":{"L":-0.1,"R":-0.1},
            "い":{"L":-0.1,"R":-0.08},
            "う":{"L":-0.13,"R":-0.16},
            "え":{"L":-0.1,"R":-0.07},
            "お":{"L":-0.09,"R":-0.04}
          }
        }
      ];

    }
  });

  test('オプションでカーニングデータを指定できる', function() {
    expect(3);
    // Not a bad test to run on collection methods.
    strictEqual(this.h1.kerning({data:this.kerningdata}).find('[data-kerned]').length, 0);
    strictEqual(this.h2.kerning({data:this.kerningdata}).find('[data-kerned]').length, 1);
    strictEqual(this.h3.kerning({data:this.kerningdata}).find('[data-kerned]').length, 5);
  });

  asyncTest( "jsonファイルを読み込んで使える", function() {
    expect(1);
    var keningdata,
        target = this.p;
    $.getJSON("../data/mplus-2m-regular.json" , function(_data){
      keningdata = _data;
    });

    setTimeout(function(){
      start();
      console.log(target.kerning({data:keningdata}));
      strictEqual(target.find('[data-kerned]').length, 14);
    },100);
  });

  // test('Can destroy', function() {
  //   expect(1);
  //   strictEqual(this.elems.html(), this.elems.kerning().html(), 'should be kerned with no options');
  // });

}(jQuery));
