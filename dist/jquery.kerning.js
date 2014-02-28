/*! Kerning - v0.1.1 - 2014-02-28
* http://karappoinc.github.io/jquery.kerning.js/
* Copyright (c) 2014 Karappo Inc.; Licensed MIT */
(function($){

  $.fn.kerning=function(config){

    var defaults = {
      removeTags: false,
      removeAnchorTags: false,
      data: {
        "kerning":{
          "、":[0,-0.4],
          "。":[0,-0.4],
          
          "（":[-0.4,0],
          "）":[0,-0.4],
          "〔":[-0.4,0],
          "〕":[0,-0.4],
          "［":[-0.4,0],
          "］":[0,-0.4],
          "｛":[-0.4,0],
          "｝":[0,-0.4],
          "〈":[-0.4,0],
          "〉":[0,-0.4],
          "《":[-0.4,0],
          "》":[0,-0.4],
          "「":[-0.4,0],
          "」":[0,-0.4],
          "『":[-0.4,0],
          "』":[0,-0.4],
          "【":[-0.4,0],
          "】":[0,-0.4],

          "・":[-0.22,-0.22],
          "：":[-0.22,-0.22],
          "；":[-0.22,-0.22],
          "｜":[-0.22,-0.22]
        }
      }
    };
    var options = $.extend(defaults, config);
    var kdata = options.data.kerning;

    return this.each(function(){
      
      var me = $(this),
          container = me,
          strArray = me.html(),
          content = '';
      // console.log(strArray);
      if(options.removeAnchorTags){
        // アンカー以外のタグ除去
        // TODO: タグ外の部分も対象に
        if(me.children('a').length){
          container = me.children('a');
          strArray = container.html().replace(/(<([^>]+)>)/ig,"").split('');
        }
        else{
          container = me;
          strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
        }
      }
      else if(options.removeTags){
        // 全タグ除去
        strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
      }
      else{
        // console.log('remove[data-kerned]',me.find('[data-kerned]').length);
        me.find('[data-kerned]').empty();
      }
      
      // for test
      var delimiter = me.data('delimiter');
      var linebreak = me.data('linebreak');
      if(delimiter !== undefined){
        strArray = (delimiter+strArray.join(delimiter)+delimiter).split('');
      }

      for (var i = 0; i < strArray.length; i++) {
        var str = strArray[i];
        var L = 0;
        var R = 0;
        if(kdata[str]){
          // console.log(str,kdata[str]);
          L = kdata[str][0];
          R = kdata[str][1];

          // for test
          if(linebreak !== undefined){
            content += '<span style="display:inline-block;">'+linebreak+'</span>';
          }

          if(L !== 0 || R !== 0){
            content += '<span data-kerned style="display:inline-block;margin-left:'+L+'em;margin-right:'+R+'em;">'+str+'</span>';
          }else{
            content += str;
          }
          
          // for test
          if(linebreak !== undefined){
            content += '<span style="display:inline-block;">'+linebreak+'</span><br>';
          }
        }
        else{
          content += str;
        }
        // console.log(str,L,R); 
      }

      container.html(content);
    });
  };
})(jQuery);