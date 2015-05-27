(function() {
  var _Card16, _Card8, _FIXED, _INDEX, _STRING, _TAG, _ULONG, _ULONG_STR, _USHORT, _USHORT_STR, __read, __readByte, _hexStr, _logPointer, _move, _pop, _push, _u8ArrToStr, handleDragOver, handleFileSelect, hex_string_to_bytes, hex_to_byte, utf8_bytes_to_string, utf8_hex_string_to_string;

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
    var i, l, ref, result;
    result = [];
    for (i = l = 0, ref = hex_str.length; l < ref; i = l += 2) {
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
    var i, l, ref, result;
    result = '';
    for (i = l = 0, ref = u8array.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
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

  _INDEX = function(_log) {
    var _data_start, _len, _off, count, data, i, l, m, offset, offsetSize, ref, ref1;
    count = _Card16(_log);
    if (count === 0) {
      return {
        count: 0
      };
    } else {
      offsetSize = _Card8(_log);
      offset = [];
      for (i = l = 0, ref = count; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
        offset.push(__readByte(offsetSize));
      }
      _data_start = window.pointer;
      data = [];
      for (i = m = 0, ref1 = count; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
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
    var file, files, l, len, reader, results;
    e.stopPropagation();
    e.preventDefault();
    files = e.dataTransfer.files;
    results = [];
    for (l = 0, len = files.length; l < len; l++) {
      file = files[l];
      reader = new FileReader();
      reader.onload = function() {
        var FeatureListOffset, FeatureRecord, FontInfo, LangSysRecord, Lookup, LookupListOffset, LookupOffset, ScriptListOffset, ScriptRecord, ScriptTableOffset, SubTableOffsets, SubtableOffset, _offset, i, j, k, len1, m, o, p, q, r, record, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, storageOffset, t, tag, u, v, w, x, y, z;
        window.data = new Uint8Array(reader.result);
        FontInfo = {
          OffsetTable: {
            version: _ULONG_STR(),
            numTables: _USHORT(),
            searchRange: _USHORT(),
            entrySelector: _USHORT(),
            rangeShift: _USHORT()
          },
          TableDirectory: {}
        };
        for (i = m = 0, ref = FontInfo.OffsetTable.numTables; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
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
        for (i = o = 0, ref1 = FontInfo.name.count; 0 <= ref1 ? o < ref1 : o > ref1; i = 0 <= ref1 ? ++o : --o) {
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
        for (i = p = 0, ref2 = FontInfo.name.count; 0 <= ref2 ? p < ref2 : p > ref2; i = 0 <= ref2 ? ++p : --p) {
          _offset = storageOffset + FontInfo.name.records[i].offset;
          _move(_offset);
          FontInfo.name.records[i]['nameString'] = _STRING(FontInfo.name.records[i].length);
        }
        ref3 = FontInfo.name.records.length;
        for (q = 0, len1 = ref3.length; q < len1; q++) {
          record = ref3[q];
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
        for (i = r = 0, ref4 = FontInfo.cmap.numTables; 0 <= ref4 ? r < ref4 : r > ref4; i = 0 <= ref4 ? ++r : --r) {
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
          Name: null,
          Top: null
        };
        FontInfo.CFF.Name = _INDEX(true);
        FontInfo.CFF.Top = _INDEX();
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
        for (i = s = 0, ref5 = FontInfo.GPOS.ScriptList.ScriptCount; 0 <= ref5 ? s < ref5 : s > ref5; i = 0 <= ref5 ? ++s : --s) {
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
          for (j = t = 0, ref6 = ScriptRecord.Script.LangSysCount; 0 <= ref6 ? t < ref6 : t > ref6; j = 0 <= ref6 ? ++t : --t) {
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
        for (i = u = 0, ref7 = FontInfo.GPOS.FeatureList.FeatureCount; 0 <= ref7 ? u < ref7 : u > ref7; i = 0 <= ref7 ? ++u : --u) {
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
          for (j = v = 0, ref8 = FeatureRecord.Feature.LookupCount; 0 <= ref8 ? v < ref8 : v > ref8; j = 0 <= ref8 ? ++v : --v) {
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
        for (i = w = 0, ref9 = FontInfo.GPOS.LookupList.LookupCount; 0 <= ref9 ? w < ref9 : w > ref9; i = 0 <= ref9 ? ++w : --w) {
          FontInfo.GPOS.LookupList.Lookup.push(_USHORT());
        }
        for (i = x = 0, ref10 = FontInfo.GPOS.LookupList.LookupCount; 0 <= ref10 ? x < ref10 : x > ref10; i = 0 <= ref10 ? ++x : --x) {
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
          for (j = y = 0, ref11 = Lookup.SubTableCount; 0 <= ref11 ? y < ref11 : y > ref11; j = 0 <= ref11 ? ++y : --y) {
            SubTableOffsets.push(_USHORT());
          }
          Lookup.MarkFilteringSet = _USHORT();
          _push();
          for (k = z = 0, ref12 = Lookup.SubTableCount; 0 <= ref12 ? z < ref12 : z > ref12; k = 0 <= ref12 ? ++z : --z) {
            SubtableOffset = SubTableOffsets[k];
            _move(LookupOffset + SubtableOffset);
          }
          _pop();
          FontInfo.GPOS.Lookups.push(Lookup);
        }
        return $('#output').html(JSON.stringify(FontInfo['CFF'], null, '\t'));
      };
      results.push(reader.readAsArrayBuffer(file));
    }
    return results;
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
