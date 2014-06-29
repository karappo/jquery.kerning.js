/*! kerning - v0.2.2 - 2014-06-29
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
  return $.fn.kerning = function(config, deep_extending) {
    if (deep_extending == null) {
      deep_extending = false;
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
        if (deep_extending) {
          options = $.extend(true, {}, defaults, _config);
        } else {
          options = $.extend({}, defaults, _config);
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
          console.error('jquery.kerning :: Invalid configure');
          return me;
        }
      } else {
        return kern(config);
      }
    });
  };
})(jQuery);
