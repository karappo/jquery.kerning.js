do ($ = jQuery) ->

  $(document).on 'ready', ->
    $(document).find('[data-kerning]').each ->
      
      txt = $(this).data('kerning')
      opts = null
      if txt
        if 0<=txt.indexOf('{')
          opts = $.kerning.parseJSON(txt)
        else
          opts = txt
        $(this).kerning(opts, $(this).data('kerning-extend'))
      else
        $(this).kerning()

  $.kerning = {}

  $.kerning.defaults = 
    removeTags: false
    removeAnchorTags: false
    data:
      kerning:
        "、":[0,-0.4]
        "。":[0,-0.4]
        "（":[-0.4,0]
        "）":[0,-0.4]
        "〔":[-0.4,0]
        "〕":[0,-0.4]
        "［":[-0.4,0]
        "］":[0,-0.4]
        "｛":[-0.4,0]
        "｝":[0,-0.4]
        "〈":[-0.4,0]
        "〉":[0,-0.4]
        "《":[-0.4,0]
        "》":[0,-0.4]
        "「":[-0.4,0]
        "」":[0,-0.4]
        "『":[-0.4,0]
        "』":[0,-0.4]
        "【":[-0.4,0]
        "】":[0,-0.4]
        "・":[-0.22,-0.22]
        "：":[-0.22,-0.22]
        "；":[-0.22,-0.22]
        "｜":[-0.22,-0.22]

  # 静的関数 ------------------------

  # JSON.parseだけだと厳密すぎるのでevalでも評価を試す
  $.kerning.parseJSON = (text)->
    obj = null
    
    try
      obj = JSON.parse( text )
      return obj
    catch O_o
      console.log("jquery.kerning : [WARN] As a result of JSON.parse, a trivial problem has occurred")

    try
      obj = eval("(" + text + ")")
    catch o_O
      console.error("jquery.kerning : [ERROR] JSON.parse failed")
      return null
    
    return obj
  
  # 本体 ------------------------

  $.fn.kerning = (config, _extend = false) ->
    
    return @each ->
      me = $(this)
      container = me
      strArray = me.html()
      content = ''
      options = kdata = null

      # ---------------------
      # methods
          
      # remove kerned tags
      destroy = ->
        while me.find('[data-kerned]').length
          me.find('[data-kerned]').replaceWith( -> this.innerHTML )
          strArray = me.html()

      # kern
      kern = (_config)->
        if me.find('[data-kerned]').length
          destroy()

        if _extend
          options = $.extend(true, {}, $.kerning.defaults, _config)
        else
          options = $.extend({}, $.kerning.defaults, _config)
        
        kdata = options.data.kerning
        
        if(options.removeAnchorTags)
          # アンカー以外のタグ除去
          # TODO: タグ外の部分も対象に
          if(me.children('a').length)
            container = me.children('a')
            strArray = container.html().replace(/(<([^>]+)>)/ig,"").split('')
          else
            container = me
            strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('')
        else if(options.removeTags)
          # 全タグ除去
          strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('')
        else
          # console.log('remove[data-kerned]',me.find('[data-kerned]').length)
          me.find('[data-kerned]').empty()
        
        # for test
        delimiter = me.data('delimiter')
        linebreak = me.data('linebreak')
        if(delimiter != undefined)
          strArray = (delimiter+strArray.join(delimiter)+delimiter).split('')

        for i in [0...strArray.length]
          str = strArray[i]
          L = 0
          R = 0
          if(kdata[str])
            # console.log(str,kdata[str])
            L = kdata[str][0]
            R = kdata[str][1]

            # for test
            if(linebreak != undefined)
              content += '<span style="display:inline-block;">'+linebreak+'</span>'

            if(L != 0 || R != 0)
              content += '<span data-kerned style="display:inline-block;margin-left:'+L+'em;margin-right:'+R+'em;">'+str+'</span>'
            else
              content += str
            
            # for test
            if(linebreak != undefined)
              content += '<span style="display:inline-block;">'+linebreak+'</span><br>'
          else
            content += str
          
          # console.log(str,L,R)

        container.html(content)

        # style check

        # text-indentが0であるか確かめ、そうでない場合はstyleを追加してキャンセル
        container.find('[data-kerned]').each ->
          _el = $(this)
          if parseInt(_el.css('text-indent'),10) != 0
            _el.css 'text-indent', 0
        
        return me


      # ---------------------
      # main

      if typeof config is 'string'
        if config == 'destroy'
          destroy()
          return me

        else if 0 <= config.indexOf('.json')
          # given a json file path
          $.getJSON config, (_data) ->
            kern({data:_data})
        else
          console.error('jquery.kerning : [ERROR] Invalid configure')
          return me
      else
        kern(config)
