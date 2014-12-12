/*! kerning - v0.3.1 - 2014-12-13
* http://karappoinc.github.io/jquery.kerning.js/
* Copyright (c) 2014 Karappo Inc.; Licensed MIT */
(function($) {
  $(document).on('ready', function() {
    return $(document).find('[data-kerning]').each(function() {
      var opts, txt;
      txt = $(this).data('kerning');
      opts = null;
      if (txt) {
        if (0 <= txt.indexOf('{')) {
          opts = $.kerning.parseJSON(txt);
        } else {
          opts = txt;
        }
        return $(this).kerning(opts, $(this).data('kerning-extend'));
      } else {
        return $(this).kerning();
      }
    });
  });
  $.kerning = {};
  $.kerning.defaults = {
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
  $.kerning.parseJSON = function(text) {
    var O_o, o_O, obj;
    obj = null;
    try {
      obj = JSON.parse(text);
      return obj;
    } catch (_error) {
      O_o = _error;
      console.log("jquery.kerning : [WARN] As a result of JSON.parse, a trivial problem has occurred");
    }
    try {
      obj = eval("(" + text + ")");
    } catch (_error) {
      o_O = _error;
      console.error("jquery.kerning : [ERROR] JSON.parse failed");
      return null;
    }
    return obj;
  };
  return $.fn.kerning = function(config, _extend) {
    if (_extend == null) {
      _extend = false;
    }
    return this.each(function() {
      var container, content, destroy, kdata, kern, me, options, strArray;
      me = $(this);
      container = me;
      strArray = me.html();
      content = '';
      options = kdata = null;
      destroy = function() {
        var _results;
        _results = [];
        while (me.find('[data-kerned]').length) {
          me.find('[data-kerned]').replaceWith(function() {
            return this.innerHTML;
          });
          _results.push(strArray = me.html());
        }
        return _results;
      };
      kern = function(_config) {
        var L, R, delimiter, i, linebreak, str, _i, _ref;
        if (me.find('[data-kerned]').length) {
          destroy();
        }
        if (_extend) {
          options = $.extend(true, {}, $.kerning.defaults, _config);
        } else {
          options = $.extend({}, $.kerning.defaults, _config);
        }
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
        container.html(content);
        container.find('[data-kerned]').each(function() {
          var _el;
          _el = $(this);
          if (parseInt(_el.css('text-indent'), 10) !== 0) {
            return _el.css('text-indent', 0);
          }
        });
        return me;
      };
      if (typeof config === 'string') {
        if (config === 'destroy') {
          destroy();
          return me;
        } else if (0 <= config.indexOf('.json')) {
          return $.getJSON(config, function(_data) {
            return kern({
              data: _data
            });
          });
        } else {
          console.error('jquery.kerning : [ERROR] Invalid configure');
          return me;
        }
      } else {
        return kern(config);
      }
    });
  };
})(jQuery);

//# sourceMappingURL=jquery.kerning.js.map
