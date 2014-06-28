do ($ = jQuery) ->

  defaults = 
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

  $.fn.kerning = (config, deep_extending = false) ->
    
    return @each ->
      me = $(this)
      container = me
      strArray = me.html()
      content = ''
      options = kdata = null

      # remove kerned tags
      destroy = ->
        while me.find('[data-kerned]').length
          me.find('[data-kerned]').replaceWith( -> this.innerHTML )
          strArray = me.html()

      if config == 'destroy'
        destroy()
        return me

      if me.find('[data-kerned]').length
        destroy()

      if deep_extending
        options = $.extend(true, {}, defaults, config)
      else
        options = $.extend({}, defaults, config)
      
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
