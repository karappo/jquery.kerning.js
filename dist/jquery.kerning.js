/*! kerning - v0.1.1 - 2014-06-28
* http://karappoinc.github.io/jquery.kerning.js/
* Copyright (c) 2014 Karappo Inc.; Licensed MIT */
(function($) {
  var defaults;
  defaults = {
    removeTags: false,
    removeAnchorTags: false,
    data: {
      kerning: {
        "、": [0, -0.4],
        "。": [0, -0.4],
        "（": [-0.4, 0],
        "）": [0, -0.4],
        "〔": [-0.4, 0],
        "〕": [0, -0.4],
        "［": [-0.4, 0],
        "］": [0, -0.4],
        "｛": [-0.4, 0],
        "｝": [0, -0.4],
        "〈": [-0.4, 0],
        "〉": [0, -0.4],
        "《": [-0.4, 0],
        "》": [0, -0.4],
        "「": [-0.4, 0],
        "」": [0, -0.4],
        "『": [-0.4, 0],
        "』": [0, -0.4],
        "【": [-0.4, 0],
        "】": [0, -0.4],
        "・": [-0.22, -0.22],
        "：": [-0.22, -0.22],
        "；": [-0.22, -0.22],
        "｜": [-0.22, -0.22]
      }
    }
  };
  return $.fn.kerning = function(config) {
    return this.each(function() {
      var L, R, container, content, delimiter, i, kdata, linebreak, me, options, str, strArray, _i, _ref;
      me = $(this);
      container = me;
      strArray = me.html();
      content = '';
      if (config === 'destroy') {
        me.find('[data-kerned]').replaceWith(function() {
          return this.innerHTML;
        });
        return me;
      }
      options = $.extend(defaults, config);
      kdata = options.data.kerning;
      if (options.removeAnchorTags) {
        if ((me.children('a').length)) {
          container = me.children('a');
          strArray = container.html().replace(/(<([^>]+)>)/ig, "").split('');
        } else {
          container = me;
          strArray = me.html().replace(/(<([^>]+)>)/ig, "").split('');
        }
      } else if (options.removeTags) {
        strArray = me.html().replace(/(<([^>]+)>)/ig, "").split('');
      } else {
        me.find('[data-kerned]').empty();
      }
      delimiter = me.data('delimiter');
      linebreak = me.data('linebreak');
      if (delimiter !== void 0) {
        strArray = (delimiter + strArray.join(delimiter) + delimiter).split('');
      }
      for (i = _i = 0, _ref = strArray.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        str = strArray[i];
        L = 0;
        R = 0;
        if (kdata[str]) {
          L = kdata[str][0];
          R = kdata[str][1];
          if (linebreak !== void 0) {
            content += '<span style="display:inline-block;">' + linebreak + '</span>';
          }
          if (L !== 0 || R !== 0) {
            content += '<span data-kerned style="display:inline-block;margin-left:' + L + 'em;margin-right:' + R + 'em;">' + str + '</span>';
          } else {
            content += str;
          }
          if (linebreak !== void 0) {
            content += '<span style="display:inline-block;">' + linebreak + '</span><br>';
          }
        } else {
          content += str;
        }
      }
      return container.html(content);
    });
  };
})(jQuery);
