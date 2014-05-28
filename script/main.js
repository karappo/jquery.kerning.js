(function() {
  var handleDragOver, handleFileSelect, hex_string_to_bytes, hex_to_byte, utf8_bytes_to_string, utf8_hex_string_to_string, _Card16, _Card8, _FIXED, _INDEX, _STRING, _TAG, _ULONG, _ULONG_STR, _USHORT, _USHORT_STR, __read, __readByte, _hexStr, _logPointer, _move, _pop, _push, _u8ArrToStr;

  utf8_bytes_to_string = function(arr) {
    var c, i, result;
    if (arr === null) {
      return null;
    }
    result = "";
    while (i = arr.shift()) {
      if (i <= 0x7f) {
        result += String.fromCharCode(i);
      } else if (i <= 0xdf) {
        c = (i & 0x1f) << 6;
        c += arr.shift() & 0x3f;
        result += String.fromCharCode(c);
      } else if (i <= 0xe0) {
        c = ((arr.shift() & 0x1f) << 6) | 0x0800;
        c += arr.shift() & 0x3f;
        result += String.fromCharCode(c);
      } else {
        c = (i & 0x0f) << 12;
        c += (arr.shift() & 0x3f) << 6;
        c += arr.shift() & 0x3f;
        result += String.fromCharCode(c);
      }
    }
    return result;
  };

  hex_to_byte = function(hex_str) {
    return parseInt(hex_str, 16);
  };

  hex_string_to_bytes = function(hex_str) {
    var i, result, _i, _ref;
    result = [];
    for (i = _i = 0, _ref = hex_str.length; _i < _ref; i = _i += 2) {
      result.push(hex_to_byte(hex_str.substr(i, 2)));
    }
    return result;
  };

  utf8_hex_string_to_string = function(hex_str1) {
    var bytes2, str2;
    bytes2 = hex_string_to_bytes(hex_str1);
    str2 = utf8_bytes_to_string(bytes2);
    return str2;
  };

  window.pointer = 0;

  window.pointerHistory = [];

  window.data = null;

  _move = function(_offset, _log) {
    if (_log) {
      console.log('_move', _offset, _hexStr(_offset));
    }
    return window.pointer = _offset;
  };

  _push = function() {
    return window.pointerHistory.push(window.pointer);
  };

  _pop = function() {
    return window.pointer = window.pointerHistory.pop();
  };

  _logPointer = function() {
    return console.log('pointer', _hexStr(window.pointer));
  };

  _u8ArrToStr = function(u8array) {
    var i, result, _i, _ref;
    result = '';
    for (i = _i = 0, _ref = u8array.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      result += ('00' + u8array[i].toString(16)).substr(-2);
    }
    return result;
  };

  _hexStr = function(_num) {
    return '0x' + _num.toString(16).toUpperCase();
  };

  _Card8 = function(_log) {
    return __readByte(1, _log);
  };

  _Card16 = function(_log) {
    return __readByte(2, _log);
  };

  _USHORT = _Card16;

  _ULONG = function(_log) {
    return __readByte(4, _log);
  };

  _FIXED = function(_log) {
    var n;
    n = _u8ArrToStr(__read(4));
    if (_log) {
      console.log(parseInt(n, 16), n);
    }
    return parseFloat(n, 16);
  };

  _USHORT_STR = function() {
    return '0x' + _u8ArrToStr(__read(2));
  };

  _ULONG_STR = function() {
    return '0x' + _u8ArrToStr(__read(4));
  };

  _TAG = function() {
    return _STRING(4);
  };

  _STRING = function(_len) {
    return utf8_hex_string_to_string(_u8ArrToStr(__read(_len)));
  };

  _INDEX = function() {
    var count, data, i, offset, offsetSize, _data_start, _i, _j, _len, _off;
    count = _Card16();
    if (count === 0) {
      return {
        count: 0
      };
    } else {
      offsetSize = _Card8();
      offset = [];
      for (i = _i = 0; 0 <= count ? _i <= count : _i >= count; i = 0 <= count ? ++_i : --_i) {
        offset.push(__readByte(offsetSize));
      }
      _data_start = window.pointer;
      data = [];
      for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
        _off = offset[i] - 1;
        _len = offset[i + 1] - offset[i];
        _move(_data_start + _off);
        data.push(_STRING(_len));
      }
      return {
        count: count,
        offsetSize: offsetSize,
        offset: offset,
        data: data
      };
    }
  };

  __read = function(_size) {
    var start;
    start = window.pointer;
    window.pointer += _size;
    return window.data.subarray(start, window.pointer);
  };

  __readByte = function(_num, _log) {
    var n;
    n = _u8ArrToStr(__read(_num));
    if (_log) {
      console.log(window.pointer, _hexStr(window.pointer), parseInt(n, 16), n);
    }
    return parseInt(n, 16);
  };

  handleDragOver = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return e.dataTransfer.dropEffect = 'copy';
  };

  handleFileSelect = function(e) {
    var file, files, reader, _i, _len, _results;
    e.stopPropagation();
    e.preventDefault();
    files = e.dataTransfer.files;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      reader = new FileReader();
      reader.onload = function() {
        var FeatureListOffset, FeatureRecord, FontInfo, LangSysRecord, Lookup, LookupListOffset, LookupOffset, ScriptListOffset, ScriptRecord, ScriptTableOffset, SubTableOffsets, SubtableOffset, i, j, k, record, storageOffset, tag, _j, _k, _l, _len1, _m, _n, _o, _offset, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v;
        window.data = new Uint8Array(reader.result);
        FontInfo = {};
        FontInfo['OffsetTable'] = {
          version: _ULONG_STR(),
          numTables: _USHORT(),
          searchRange: _USHORT(),
          entrySelector: _USHORT(),
          rangeShift: _USHORT()
        };
        FontInfo['TableDirectory'] = {};
        for (i = _j = 0, _ref = FontInfo.OffsetTable.numTables; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
          tag = String.fromCharCode.apply(null, __read(4)).replace(' ', '');
          FontInfo.TableDirectory[tag] = {
            checkSum: _ULONG_STR(),
            offset: _ULONG(),
            length: _ULONG()
          };
        }
        _move(FontInfo.TableDirectory.name.offset);
        FontInfo['name'] = {
          format: _USHORT(),
          count: _USHORT(),
          offset: _USHORT(),
          records: []
        };
        for (i = _k = 0, _ref1 = FontInfo.name.count; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
          FontInfo.name.records.push({
            platformID: _USHORT(),
            encordingID: _USHORT(),
            languageId: _USHORT(),
            nameId: _USHORT(),
            length: _USHORT(),
            offset: _USHORT()
          });
        }
        storageOffset = FontInfo.TableDirectory.name.offset + FontInfo.name.offset;
        for (i = _l = 0, _ref2 = FontInfo.name.count; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
          _offset = storageOffset + FontInfo.name.records[i].offset;
          _move(_offset);
          FontInfo.name.records[i]['nameString'] = _STRING(FontInfo.name.records[i].length);
        }
        _ref3 = FontInfo.name.records.length;
        for (_m = 0, _len1 = _ref3.length; _m < _len1; _m++) {
          record = _ref3[_m];
          if (record.languageId === 0 && record.nameId === 4) {
            console.log(record.nameString);
          }
        }
        _move(FontInfo.TableDirectory.cmap.offset);
        FontInfo['cmap'] = {
          version: _USHORT(),
          numTables: _USHORT(),
          encodingRecords: []
        };
        for (i = _n = 0, _ref4 = FontInfo.cmap.numTables; 0 <= _ref4 ? _n < _ref4 : _n > _ref4; i = 0 <= _ref4 ? ++_n : --_n) {
          FontInfo.cmap.encodingRecords.push({
            platformID: _USHORT(),
            encordingID: _USHORT(),
            offset: _ULONG()
          });
        }
        _move(FontInfo.TableDirectory.CFF.offset);
        FontInfo['CFF'] = {
          Header: {
            major: _Card8(),
            minor: _Card8(),
            headerSize: _Card8(),
            offsetSize: _Card8()
          },
          Name: null
        };
        FontInfo.CFF.Name = _INDEX(FontInfo.CFF.Header.offsetSize);
        _move(FontInfo.TableDirectory.GPOS.offset);
        FontInfo['GPOS'] = {
          Header: {
            Version: _FIXED(),
            ScriptList: _USHORT(),
            FeatureList: _USHORT(),
            LookupList: _USHORT()
          },
          ScriptList: null,
          FeatureList: null,
          LookupList: null,
          Lookups: []
        };
        ScriptListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.ScriptList;
        _move(ScriptListOffset);
        FontInfo.GPOS.ScriptList = {
          ScriptCount: _USHORT(),
          ScriptRecord: []
        };
        for (i = _o = 0, _ref5 = FontInfo.GPOS.ScriptList.ScriptCount; 0 <= _ref5 ? _o < _ref5 : _o > _ref5; i = 0 <= _ref5 ? ++_o : --_o) {
          ScriptRecord = {
            ScriptTag: _TAG(),
            ScriptOffset: _USHORT(),
            Script: {}
          };
          ScriptTableOffset = ScriptListOffset + ScriptRecord.ScriptOffset;
          _push();
          _move(ScriptTableOffset);
          ScriptRecord.Script = {
            DefaultLangSys: _USHORT(),
            LangSysCount: _USHORT(),
            LangSysRecord: []
          };
          for (j = _p = 0, _ref6 = ScriptRecord.Script.LangSysCount; 0 <= _ref6 ? _p < _ref6 : _p > _ref6; j = 0 <= _ref6 ? ++_p : --_p) {
            LangSysRecord = {
              LangSysTag: _TAG(),
              LangSysOffset: _USHORT(),
              LangSys: {}
            };
            _push();
            _move(ScriptTableOffset + LangSysRecord.LangSysOffset);
            LangSysRecord.LangSys = {
              LookupOrder: _USHORT(),
              ReqFeatureIndex: _USHORT(),
              FeatureCount: _USHORT(),
              FeatureIndex: []
            };
            ScriptRecord.Script['LangSysRecord'].push(LangSysRecord);
            _pop();
          }
          FontInfo.GPOS.ScriptList.ScriptRecord.push(ScriptRecord);
          _pop();
        }
        FeatureListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.FeatureList;
        _move(FeatureListOffset);
        FontInfo.GPOS.FeatureList = {
          FeatureCount: _USHORT(),
          FeatureRecord: []
        };
        for (i = _q = 0, _ref7 = FontInfo.GPOS.FeatureList.FeatureCount; 0 <= _ref7 ? _q < _ref7 : _q > _ref7; i = 0 <= _ref7 ? ++_q : --_q) {
          FeatureRecord = {
            FeatureTag: _TAG(),
            FeatureOffset: _USHORT(),
            Feature: {}
          };
          _push();
          _move(FeatureListOffset + FeatureRecord.FeatureOffset);
          FeatureRecord.Feature = {
            FeatureParams: _USHORT(),
            LookupCount: _USHORT(),
            LookupListIndex: []
          };
          for (j = _r = 0, _ref8 = FeatureRecord.Feature.LookupCount; 0 <= _ref8 ? _r < _ref8 : _r > _ref8; j = 0 <= _ref8 ? ++_r : --_r) {
            FeatureRecord.Feature.LookupListIndex.push(_USHORT());
          }
          FontInfo.GPOS.FeatureList.FeatureRecord.push(FeatureRecord);
          _pop();
        }
        LookupListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.LookupList;
        _move(LookupListOffset);
        FontInfo.GPOS.LookupList = {
          LookupCount: _USHORT(),
          Lookup: []
        };
        for (i = _s = 0, _ref9 = FontInfo.GPOS.LookupList.LookupCount; 0 <= _ref9 ? _s < _ref9 : _s > _ref9; i = 0 <= _ref9 ? ++_s : --_s) {
          FontInfo.GPOS.LookupList.Lookup.push(_USHORT());
        }
        for (i = _t = 0, _ref10 = FontInfo.GPOS.LookupList.LookupCount; 0 <= _ref10 ? _t < _ref10 : _t > _ref10; i = 0 <= _ref10 ? ++_t : --_t) {
          LookupOffset = LookupListOffset + FontInfo.GPOS.LookupList.Lookup[i];
          _move(LookupOffset);
          Lookup = {
            LookupType: _USHORT(),
            LookupFlag: _USHORT_STR(),
            SubTableCount: _USHORT(),
            MarkFilteringSet: null,
            SubTable: []
          };
          SubTableOffsets = [];
          for (j = _u = 0, _ref11 = Lookup.SubTableCount; 0 <= _ref11 ? _u < _ref11 : _u > _ref11; j = 0 <= _ref11 ? ++_u : --_u) {
            SubTableOffsets.push(_USHORT());
          }
          Lookup.MarkFilteringSet = _USHORT();
          _push();
          for (k = _v = 0, _ref12 = Lookup.SubTableCount; 0 <= _ref12 ? _v < _ref12 : _v > _ref12; k = 0 <= _ref12 ? ++_v : --_v) {
            SubtableOffset = SubTableOffsets[k];
            _move(LookupOffset + SubtableOffset);
          }
          _pop();
          FontInfo.GPOS.Lookups.push(Lookup);
        }
        return $('#output').html(JSON.stringify(FontInfo, null, '\t'));
      };
      _results.push(reader.readAsArrayBuffer(file));
    }
    return _results;
  };

  $(function() {
    var dropZone;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      dropZone = document.getElementById('dropzone');
      dropZone.addEventListener('dragover', handleDragOver, false);
      return dropZone.addEventListener('drop', handleFileSelect, false);
    } else {
      return console.error('The File APIs are not fully supported in this browser.');
    }
  });


  /*
  cid = {
  "842":"ぁ",
  "843":"あ",
  "844":"ぃ",
  "845":"い",
  "846":"ぅ",
  "847":"う",
  "848":"ぇ",
  "849":"え",
  "850":"ぉ",
  "851":"お",
  "852":"か",
  "853":"が",
  "854":"き",
  "855":"ぎ",
  "856":"く",
  "857":"ぐ",
  "858":"け",
  "859":"げ",
  "860":"こ",
  "861":"ご",
  "862":"さ",
  "863":"ざ",
  "864":"し",
  "865":"じ",
  "866":"す",
  "867":"ず",
  "868":"せ",
  "869":"ぜ",
  "870":"そ",
  "871":"ぞ",
  "872":"た",
  "873":"だ",
  "874":"ち",
  "875":"ぢ",
  "876":"っ",
  "877":"つ",
  "878":"づ",
  "879":"て",
  "880":"で",
  "881":"と",
  "882":"ど",
  "883":"な",
  "884":"に",
  "885":"ぬ",
  "886":"ね",
  "887":"の",
  "888":"は",
  "889":"ば",
  "890":"ぱ",
  "891":"ひ",
  "892":"び",
  "893":"ぴ",
  "894":"ふ",
  "895":"ぶ",
  "896":"ぷ",
  "897":"へ",
  "898":"べ",
  "899":"ぺ",
  "900":"ほ",
  "901":"ぼ",
  "902":"ぽ",
  "903":"ま",
  "904":"み",
  "905":"む",
  "906":"め",
  "907":"も",
  "908":"ゃ",
  "909":"や",
  "910":"ゅ",
  "911":"ゆ",
  "912":"ょ",
  "913":"よ",
  "914":"ら",
  "915":"り",
  "916":"る",
  "917":"れ",
  "918":"ろ",
  "919":"ゎ",
  "920":"わ",
  "921":"ゐ",
  "922":"ゑ",
  "923":"を",
  "924":"ん",
  "925":"ァ",
  "926":"ア",
  "927":"ィ",
  "928":"イ",
  "929":"ゥ",
  "930":"ウ",
  "931":"ェ",
  "932":"エ",
  "933":"ォ",
  "934":"オ",
  "935":"カ",
  "936":"ガ",
  "937":"キ",
  "938":"ギ",
  "939":"ク",
  "940":"グ",
  "941":"ケ",
  "942":"ゲ",
  "943":"コ",
  "944":"ゴ",
  "945":"サ",
  "946":"ザ",
  "947":"シ",
  "948":"ジ",
  "949":"ス",
  "950":"ズ",
  "951":"セ",
  "952":"ゼ",
  "953":"ソ",
  "954":"ゾ",
  "955":"タ",
  "956":"ダ",
  "957":"チ",
  "958":"ヂ",
  "959":"ッ"
  };
   */

}).call(this);

//# sourceMappingURL=main.js.map
