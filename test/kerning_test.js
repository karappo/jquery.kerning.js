(function($) {
  module('No option', {
    setup: function() {
      this.h1 = $('h1');
      this.h1_text = this.h1.text();
      this.h2 = $('h2');
      return this.h2_text = this.h2.text();
    }
  });
  test('is chainable', 2, function() {
    strictEqual(this.h1.kerning(), this.h1);
    return strictEqual(this.h2.kerning(), this.h2);
  });
  test('元のテキストと同じように読める', 2, function() {
    strictEqual(this.h1.kerning().text(), this.h1_text);
    return strictEqual(this.h2.kerning().text(), this.h2_text);
  });
  test('オプションなしの場合、約物のみカーニングされる', 2, function() {
    strictEqual(this.h1.kerning().find('[data-kerned]').length, 2);
    return strictEqual(this.h2.kerning().find('[data-kerned]').length, 0);
  });
  module('With option', {
    setup: function() {
      this.h1 = $('h1');
      this.h2 = $('h2');
      this.h3 = $('h3');
      return this.kerningdata = {
        kerning: {
          "あ": [-0.1, -0.1],
          "い": [-0.1, -0.08],
          "う": [-0.13, -0.16],
          "え": [-0.1, -0.07],
          "お": [-0.09, -0.04]
        }
      };
    }
  });
  test('オプションでカーニングデータを指定できる', 3, function() {
    strictEqual(this.h1.kerning({
      data: this.kerningdata
    }).find('[data-kerned]').length, 0);
    strictEqual(this.h2.kerning({
      data: this.kerningdata
    }).find('[data-kerned]').length, 1);
    return strictEqual(this.h3.kerning({
      data: this.kerningdata
    }).find('[data-kerned]').length, 5);
  });
  module('With option async', {
    setup: function() {
      return this.p = $('#paragraph');
    }
  });
  asyncTest('jsonファイルを読み込んで使える', 1, function() {
    var target;
    target = this.p;
    return $.getJSON('../data/mplus-2m-regular.json', function(_data) {
      start();
      return strictEqual(target.kerning({
        data: _data
      }).find('[data-kerned]').length, 14);
    });
  });
  module('Destroy', {
    setup: function() {
      this.p = $('#paragraph');
      return this.p_clone = this.p.clone().insertAfter(this.p);
    },
    teardown: function() {
      return this.p_clone.remove();
    }
  });
  test('kening後は、元のhtmlと一致しない', 1, function() {
    return notStrictEqual(this.p.html(), this.p_clone.kerning().html());
  });
  test('destroy後は、元のhtmlと一致する', 1, function() {
    return strictEqual(this.p.html(), this.p_clone.kerning().kerning('destroy').html());
  });
  module('Repeat kerning', {
    setup: function() {
      this.p = $('#paragraph');
      return this.p_clone = this.p.clone().insertAfter(this.p);
    },
    teardown: function() {
      return this.p_clone.remove();
    }
  });
  test('1回と2回を比較', 1, function() {
    return strictEqual(this.p.kerning().html(), this.p_clone.kerning().kerning().html());
  });
  test('1回と3回を比較', 1, function() {
    return strictEqual(this.p.kerning().html(), this.p_clone.kerning().kerning().kerning().html());
  });
  test('1回と4回を比較', 1, function() {
    return strictEqual(this.p.kerning().html(), this.p_clone.kerning().kerning().kerning().kerning().html());
  });
  module('Deep Extending', {
    setup: function() {
      this.el = $('#deep_extend');
      this.el.kerning('destroy');
      return this.data = {
        kerning: {
          "あ": [-0.1, -0.1]
        }
      };
    },
    teardown: function() {
      return this.el.kerning('destroy');
    }
  });
  test('デフォルトでは、約物のみカーニングされる', 2, function() {
    strictEqual(this.el.kerning().find('[data-kerned]').length, 1);
    return strictEqual(this.el.find('[data-kerned]').text(), '。');
  });
  test('deep_extendingをセットせずにカーニングデータを指定した場合は、薬物がカーニングされない', 2, function() {
    strictEqual(this.el.kerning({
      data: this.data
    }).find('[data-kerned]').length, 1);
    return strictEqual(this.el.find('[data-kerned]').html(), 'あ');
  });
  test('deep_extendingをtrueにセットしてカーニングデータを指定した場合も、薬物がカーニングされる', 3, function() {
    strictEqual(this.el.kerning({
      data: this.data
    }, true).find('[data-kerned]').length, 2);
    strictEqual($(this.el.find('[data-kerned]')[0]).html(), 'あ');
    return strictEqual($(this.el.find('[data-kerned]')[1]).html(), '。');
  });
  module('Involve getJSON', {
    setup: function() {
      return this.p = $('#paragraph');
    }
  });
  return asyncTest('第１引数にjsonファイルへのパスを指定できる', 1, function() {
    var target;
    target = this.p;
    target.kerning('../data/mplus-2m-regular.json');
    return setTimeout(function() {
      start();
      return strictEqual(target.find('[data-kerned]').length, 14);
    }, 2000);
  });
})(jQuery);
