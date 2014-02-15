/*! Kerning - v0.1.0 - 2014-02-16
* http://karappoinc.github.io/jquery.kerning.js/
* Copyright (c) 2014 Karappo Inc.; Licensed MIT */
(function($){

  $.fn.kerning=function(config){

    var defaults = {
      removeTags: false,
      removeAnchorTags: false,
      data: [
        {
          "kerning":{
            "、":{"L":0,"R":-0.4},
            "。":{"L":0,"R":-0.4},
            
            "（":{"L":-0.4,"R":0},
            "）":{"L":0,"R":-0.4},
            "〔":{"L":-0.4,"R":0},
            "〕":{"L":0,"R":-0.4},
            "［":{"L":-0.4,"R":0},
            "］":{"L":0,"R":-0.4},
            "｛":{"L":-0.4,"R":0},
            "｝":{"L":0,"R":-0.4},
            "〈":{"L":-0.4,"R":0},
            "〉":{"L":0,"R":-0.4},
            "《":{"L":-0.4,"R":0},
            "》":{"L":0,"R":-0.4},
            "「":{"L":-0.4,"R":0},
            "」":{"L":0,"R":-0.4},
            "『":{"L":-0.4,"R":0},
            "』":{"L":0,"R":-0.4},
            "【":{"L":-0.4,"R":0},
            "】":{"L":0,"R":-0.4},

            "・":{"L":-0.22,"R":-0.22},
            "：":{"L":-0.22,"R":-0.22},
            "；":{"L":-0.22,"R":-0.22},
            "｜":{"L":-0.22,"R":-0.22}
          }
        }
      ]
    };
    var options = $.extend(defaults, config);
    var kdata = options.data[0].kerning;

    return this.each(function(){
      
      var me = $(this),
          container = me,
          strArray = me.html(),
          content = '';
      
      if(options.removeAnchorTags){
        // アンカー以外のタグ除去
        // TODO: タグ外の部分も対象に
        if(me.children('a').length){
          container = me.children('a');
          strArray = container.html().replace(/(<([^>]+)>)/ig,"").split('');
        }else{
          container = me;
          strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
        }
      }else if(options.removeTags){
        // 全タグ除去
        strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
      }
      
      // for test
      var delimiter = me.data('delimiter');
      var linebreak = me.data('linebreak');
      if(delimiter !== undefined){
        strArray = (delimiter+strArray.join(delimiter)+delimiter).split('');
      }

      for (var i = 0; i < strArray.length; i++) {
        var str = strArray[i];
        var left = 0;
        var right = 0;
        if(kdata[str]){
          // console.log(str,kdata[str]);
          if(kdata[str].L){ left = kdata[str].L; }
          if(kdata[str].R){ right = kdata[str].R; }

          // for test
          if(linebreak !== undefined){
            content += '<span style="display:inline-block;">'+linebreak+'</span>';
          }

          if(left !== 0 || right !== 0){
            content += '<span style="display:inline-block;margin-left:'+left+'em;margin-right:'+right+'em;">'+str+'</span>';
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
        // console.log(str,left,right); 
      }

      container.html(content);
    });
  };
})(jQuery);