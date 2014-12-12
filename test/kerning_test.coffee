do ($ = jQuery) ->
  # ======== A Handy Little QUnit Reference ========
  # http://api.qunitjs.com/

  # Test methods:
  #   module(name, {[setup][ ,teardown]})
  #   test(name, callback)
  #   expect(numberOfAssertions)
  #   stop(increment)
  #   start(decrement)
  # Test assertions:
  #   ok(value, [message])
  #   equal(actual, expected, [message])
  #   notEqual(actual, expected, [message])
  #   deepEqual(actual, expected, [message])
  #   notDeepEqual(actual, expected, [message])
  #   strictEqual(actual, expected, [message])
  #   notStrictEqual(actual, expected, [message])
  #   throws(block, [expected], [message])

  # ---------------------------------
  
  module 'No option',
    setup: ->
      this.h1 = $ 'h1'
      this.h1_text = this.h1.text()
      this.h2 = $ 'h2'
      this.h2_text = this.h2.text()
  
  test 'is chainable', 2, ->
    strictEqual this.h1.kerning(), this.h1
    strictEqual this.h2.kerning(), this.h2
  
  test '元のテキストと同じように読める', 2, ->
    strictEqual this.h1.kerning().text(), this.h1_text
    strictEqual this.h2.kerning().text(), this.h2_text

  test 'オプションなしの場合、約物のみカーニングされる', 2, ->
    strictEqual this.h1.kerning().find('[data-kerned]').length, 2
    strictEqual this.h2.kerning().find('[data-kerned]').length, 0


  # ---------------------------------

  module 'With option',
    setup: ->
      this.h1 = $ 'h1'
      this.h2 = $ 'h2'
      this.h3 = $ 'h3'
      this.kerningdata =
        kerning:
          "あ":[-0.1,-0.1]
          "い":[-0.1,-0.08]
          "う":[-0.13,-0.16]
          "え":[-0.1,-0.07]
          "お":[-0.09,-0.04]

  test 'オプションでカーニングデータを指定できる', 3, ->
    strictEqual this.h1.kerning({data:this.kerningdata}).find('[data-kerned]').length, 0
    strictEqual this.h2.kerning({data:this.kerningdata}).find('[data-kerned]').length, 1
    strictEqual this.h3.kerning({data:this.kerningdata}).find('[data-kerned]').length, 5


  # ---------------------------------

  module 'With option async',
    setup: ->
      this.el = $ '#paragraph'
  
  asyncTest 'jsonファイルを読み込んで使える', 1, ->
    target = this.el
    $.getJSON '../data/mplus-2m-regular.json' , (_data) ->
      start()
      strictEqual target.kerning({data:_data}).find('[data-kerned]').length, 14


  # ---------------------------------

  module 'Destroy',
    setup: ->
      this.el = $ '#paragraph'
      this.el_clone = this.el.clone().insertAfter(this.el)
    teardown: ->
      this.el_clone.remove()

  test 'kening後は、元のhtmlと一致しない', 1, ->
    notStrictEqual this.el.html(), this.el_clone.kerning().html()

  test 'destroy後は、元のhtmlと一致する', 1, ->
    strictEqual this.el.html(), this.el_clone.kerning().kerning('destroy').html()


  # ---------------------------------

  module 'Repeat kerning',
    setup: ->
      this.el = $ '#paragraph'
      this.el_clone = this.el.clone().insertAfter(this.el)
    teardown: ->
      this.el_clone.remove()

  test '1回と2回を比較', 1, ->
    strictEqual this.el.kerning().html(), this.el_clone.kerning().kerning().html()

  test '1回と3回を比較', 1, ->
    strictEqual this.el.kerning().html(), this.el_clone.kerning().kerning().kerning().html()

  test '1回と4回を比較', 1, ->
    strictEqual this.el.kerning().html(), this.el_clone.kerning().kerning().kerning().kerning().html()


  # ---------------------------------

  module 'Deep Extending',
    setup: ->
      this.el = $ '#deep_extend'
      this.el.kerning('destroy')
      this.data =
        kerning:
          "あ":[-0.1,-0.1]
    teardown: ->
      this.el.kerning('destroy')

  test 'デフォルトでは、約物のみカーニングされる', 2, ->
    strictEqual this.el.kerning().find('[data-kerned]').length, 1
    strictEqual this.el.find('[data-kerned]').text(), '。'

  test 'deep_extendingをセットせずにカーニングデータを指定した場合は、薬物がカーニングされない', 2, ->
    strictEqual this.el.kerning({data:this.data}).find('[data-kerned]').length, 1
    strictEqual this.el.find('[data-kerned]').html(), 'あ'

  test 'deep_extendingをtrueにセットしてカーニングデータを指定した場合も、薬物がカーニングされる', 3, ->
    strictEqual this.el.kerning({data:this.data}, true).find('[data-kerned]').length, 2
    strictEqual $(this.el.find('[data-kerned]')[0]).html(), 'あ'
    strictEqual $(this.el.find('[data-kerned]')[1]).html(), '。'


  # ---------------------------------

  module 'Involve getJSON',
    setup: ->
      this.el = $ '#paragraph'
  
  asyncTest '第１引数にjsonファイルへのパスを指定できる', 1, ->
    target = this.el
    target.kerning('../data/mplus-2m-regular.json')
    setTimeout () ->
      start()
      strictEqual target.find('[data-kerned]').length, 14
    , 2000

  # ---------------------------------

  # TODO [data-kerning]要素をcloneして、jsに置き換えて実行した時と結果がおなじになるようにテストする
  module 'data属性でも同じ設定ができる'

  asyncTest '[data-kerning]', 2, ()->
    el = $ '#data_attr'
    # data属性除去したクローン（カーニング済みかもしれないので中身も初期化）
    el_clone = el.clone().removeAttr('data-kerning').html(el.text()).insertAfter(el)
    # 通常記法でのカーニング適用
    el_clone.kerning()
    timeoutID = window.setInterval ()->
      if el.length && el_clone.length
        ok(true, 'DOM has appended.')
        window.clearTimeout timeoutID
        start()
        strictEqual el.html(), el_clone.html()
    , 100

  asyncTest '[data-kerning="{data:_data}"]', 2, ()->
    el = $ '#data_attr_json'
    json = $.kerning.parseJSON(el.data('kerning'))
    # data属性除去したクローン（カーニング済みかもしれないので中身も初期化）
    el_clone = el.clone().removeAttr('data-kerning').html(el.text()).insertAfter(el)
    # 通常記法でのカーニング適用
    el_clone.kerning({data:json.data})
    timeoutID = window.setInterval ()->
      if el.length && el_clone.length
        ok(true, 'DOM has appended.')
        window.clearTimeout timeoutID
        start()
        strictEqual el.html(), el_clone.html()
    , 1000

  # TODO 動的に追加された要素がちゃんとカーニングされているかのテスト

  # ---------------------------------

  module '他で定義されたスタイルの影響を受けない', 
    setup: ->
      this.el = $ '#text-indent'

  test '生成した要素は必ず text-indent:0 である', ->
    this.el.kerning().find('[data-kerned]').each ->
      strictEqual parseInt($(this).css('text-indent'),10), 0

