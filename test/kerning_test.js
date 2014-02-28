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

  module('No option', {
    setup: function() {
      this.h1 = $('h1');
      this.h1_text = this.h1.text();
      this.h2 = $('h2');
      this.h2_text = this.h2.text();
    }
  });

  test('is chainable', 2, function() {
    strictEqual(this.h1.kerning(), this.h1);
    strictEqual(this.h2.kerning(), this.h2);
  });

  test('元のテキストと同じように読める', 2, function() {
    strictEqual(this.h1.kerning().text(), this.h1_text);
    strictEqual(this.h2.kerning().text(), this.h2_text);
  });

  test('オプションなしの場合、約物のみカーニングする', 2, function() {
    strictEqual(this.h1.kerning().find('[data-kerned]').length, 2);
    strictEqual(this.h2.kerning().find('[data-kerned]').length, 0);
  });

  module('With option', {
    setup: function() {
      this.h1 = $('h1');
      this.h2 = $('h2');
      this.h3 = $('h3');
      this.kerningdata = [
        {
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

  test('オプションでカーニングデータを指定できる', 3, function() {
    strictEqual(this.h1.kerning({data:this.kerningdata}).find('[data-kerned]').length, 0);
    strictEqual(this.h2.kerning({data:this.kerningdata}).find('[data-kerned]').length, 1);
    strictEqual(this.h3.kerning({data:this.kerningdata}).find('[data-kerned]').length, 5);
  });



  module('With option async', {
    setup: function() {
      this.p = $('#paragraph');
    }
  });

  asyncTest( "jsonファイルを読み込んで使える", 1, function() {
    var target = this.p;
    $.getJSON("../data/mplus-2m-regular.json" , function(_data){
      start();
      strictEqual(target.kerning({data:_data}).find('[data-kerned]').length, 14);
    });
  });

  // test('Can destroy', 1, function() {
  //   strictEqual(this.elems.html(), this.elems.kerning().html(), 'should be kerned with no options');
  // });

}(jQuery));
