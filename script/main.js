(function() {
  var handleDragOver, handleFileSelect, hex_string_to_bytes, hex_to_byte, pointer, pointerHistory, read, readFIXED, readTAG, readUINT16, readUINT16_STR, readULONG, readULONG_STR, readUSHORT, readUSHORT_STR, u8ArrToStr, utf8_bytes_to_string, utf8_hex_string_to_string, _move, _pop, _push;

  utf8_bytes_to_string = function(arr) {
    var c, i, result;
    if (arr != null) {
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
    var i, result, _i, _len;
    result = [];
    for (_i = 0, _len = hex_str.length; _i < _len; _i++) {
      i = hex_str[_i];
      result.push(hex_to_byte(hex_str.substr(i, 2)));
      i += 2;
    }
    return result;
  };

  utf8_hex_string_to_string = function(hex_str1) {
    var bytes2, str2;
    bytes2 = hex_string_to_bytes(hex_str1);
    str2 = utf8_bytes_to_string(bytes2);
    return str2;
  };

  pointer = 0;

  pointerHistory = [];

  data;

  _move = function(_offset) {
    return pointer = _offset;
  };

  _push = function() {
    return pointerHistory.push(pointer);
  };

  _pop = function() {
    return pointer = pointerHistory.pop();
  };

  read = function(_size) {
    var start;
    start = pointer;
    pointer += _size;
    return data.subarray(start, pointer);
  };

  u8ArrToStr = function(u8array) {
    var i, result, _i, _len, _ref;
    result = '';
    _ref = u8array.length;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      result += ('00' + u8array[i].toString(16)).substr(-2);
    }
    return result;
  };

  readUSHORT = function(_log) {
    var n;
    n = u8ArrToStr(read(2));
    if (_log) {
      console.log(parseInt(n, 16), n);
    }
    return parseInt(n, 16);
  };

  readUSHORT_STR = function() {
    return '0x' + u8ArrToStr(read(2));
  };

  readUINT16 = function() {
    return parseInt(u8ArrToStr(read(4)), 16);
  };

  readUINT16_STR = function() {
    return '0x' + u8ArrToStr(read(4));
  };

  readULONG = function(_log) {
    var n;
    n = u8ArrToStr(read(4));
    if (_log) {
      console.log(parseInt(n, 16), n);
    }
    return parseInt(n, 16);
  };

  readULONG_STR = function() {
    return '0x' + u8ArrToStr(read(4));
  };

  readFIXED = function() {
    return parseFloat(u8ArrToStr(read(4)), 16);
  };

  readTAG = function() {
    return utf8_hex_string_to_string(u8ArrToStr(read(4)));
  };

  handleDragOver = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return e.dataTransfer.dropEffect = 'copy';
  };

  handleFileSelect = function(e) {
    var f, files, h, reader, _i, _len, _results;
    e.stopPropagation();
    e.preventDefault();
    files = e.dataTransfer.files;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      h = files[_i];
      f = files[h];
      reader = new FileReader();
      reader.onload = function() {
        var Coverage, FeatureListOffset, FeatureRecord, FontInfo, LangSysRecord, Lookup, LookupListOffset, LookupOffset, RangeRecord, ScriptListOffset, ScriptRecord, ScriptTableOffset, SubTableOffsets, SubtableOffset, data, i, j, k, obj, storageOffset, tag, _j, _k, _l, _m, _n, _o, _offset, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v, _w, _x;
        data = new Uint8Array(reader.result);
        FontInfo = {};
        FontInfo['OffsetTable'] = {};
        FontInfo.OffsetTable['version'] = readULONG_STR();
        FontInfo.OffsetTable['numTables'] = readUSHORT();
        FontInfo.OffsetTable['searchRange'] = readUSHORT();
        FontInfo.OffsetTable['entrySelector'] = readUSHORT();
        FontInfo.OffsetTable['rangeShift'] = readUSHORT();
        FontInfo['TableDirectory'] = {};
        for (i = _j = 0, _ref = FontInfo.OffsetTable.numTables; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
          tag = String.fromCharCode.apply(null, read(4));
          FontInfo.TableDirectory[tag] = {};
          FontInfo.TableDirectory[tag]['checkSum'] = readULONG_STR();
          FontInfo.TableDirectory[tag]['offset'] = readULONG();
          FontInfo.TableDirectory[tag]['length'] = readULONG();
        }
        FontInfo['name'] = {};
        _move(FontInfo.TableDirectory.name.offset);
        FontInfo.name['format'] = readUSHORT();
        FontInfo.name['count'] = readUSHORT();
        FontInfo.name['offset'] = readUSHORT();
        FontInfo.name['records'] = [];
        for (i = _k = 0, _ref1 = FontInfo.name.count; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
          obj = {};
          obj['platformID'] = readUSHORT();
          obj['encordingID'] = readUSHORT();
          obj['languageId'] = readUSHORT();
          obj['nameId'] = readUSHORT();
          obj['length'] = readUSHORT();
          obj['offset'] = readUSHORT();
          FontInfo.name.records.push(obj);
        }
        storageOffset = FontInfo.TableDirectory.name.offset + FontInfo.name.offset;
        for (i = _l = 0, _ref2 = FontInfo.name.count; 0 <= _ref2 ? _l <= _ref2 : _l >= _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
          _offset = storageOffset + FontInfo.name.records[i].offset;
          _move(_offset);
          FontInfo.name.records[i]['nameString'] = utf8_hex_string_to_string(u8ArrToStr(read(FontInfo.name.records[i].length)));
        }
        for (i = _m = 0, _ref3 = FontInfo.name.records.length; 0 <= _ref3 ? _m <= _ref3 : _m >= _ref3; i = 0 <= _ref3 ? ++_m : --_m) {
          if (FontInfo.name.records[i].languageId === 0 && FontInfo.name.records[i].nameId === 4) {
            console.log(FontInfo.name.records[i].nameString);
          }
        }
        FontInfo['cmap'] = {};
        _move(FontInfo.TableDirectory.cmap.offset);
        FontInfo.cmap['version'] = readUSHORT();
        FontInfo.cmap['numTables'] = readUSHORT();
        FontInfo.cmap['encodingRecords'] = [];
        for (i = _n = 0, _ref4 = FontInfo.cmap.numTables; 0 <= _ref4 ? _n <= _ref4 : _n >= _ref4; i = 0 <= _ref4 ? ++_n : --_n) {
          obj = {};
          obj['platformID'] = readUSHORT();
          obj['encordingID'] = readUSHORT();
          obj['offset'] = readULONG();
          FontInfo.cmap.encodingRecords.push(obj);
        }
        FontInfo['GPOS'] = {};
        _move(FontInfo.TableDirectory.GPOS.offset);
        FontInfo.GPOS['Header'] = {};
        FontInfo.GPOS.Header['Version'] = readFIXED();
        FontInfo.GPOS.Header['ScriptList'] = readUSHORT();
        FontInfo.GPOS.Header['FeatureList'] = readUSHORT();
        FontInfo.GPOS.Header['LookupList'] = readUSHORT();
        FontInfo.GPOS['ScriptList'] = {};
        ScriptListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.ScriptList;
        _move(ScriptListOffset);
        FontInfo.GPOS.ScriptList['ScriptCount'] = readUSHORT();
        FontInfo.GPOS.ScriptList['ScriptRecord'] = [];
        for (i = _o = 0, _ref5 = FontInfo.GPOS.ScriptList.ScriptCount; 0 <= _ref5 ? _o <= _ref5 : _o >= _ref5; i = 0 <= _ref5 ? ++_o : --_o) {
          ScriptRecord = {};
          ScriptRecord['ScriptTag'] = readTAG();
          ScriptRecord['ScriptOffset'] = readUSHORT();
          ScriptRecord['Script'] = {};
          ScriptTableOffset = ScriptListOffset + ScriptRecord.ScriptOffset;
          _push();
          _move(ScriptTableOffset);
          ScriptRecord.Script['DefaultLangSys'] = readUSHORT();
          ScriptRecord.Script['LangSysCount'] = readUSHORT();
          ScriptRecord.Script['LangSysRecord'] = [];
          for (j = _p = 0, _ref6 = ScriptRecord.Script.LangSysCount; 0 <= _ref6 ? _p <= _ref6 : _p >= _ref6; j = 0 <= _ref6 ? ++_p : --_p) {
            LangSysRecord = {};
            LangSysRecord['LangSysTag'] = readTAG();
            LangSysRecord['LangSysOffset'] = readUSHORT();
            LangSysRecord['LangSys'] = {};
            _push();
            _move(ScriptTableOffset + LangSysRecord.LangSysOffset);
            LangSysRecord.LangSys['LookupOrder'] = readUSHORT();
            LangSysRecord.LangSys['ReqFeatureIndex'] = readUSHORT();
            LangSysRecord.LangSys['FeatureCount'] = readUSHORT();
            LangSysRecord.LangSys['FeatureIndex'] = [];
            ScriptRecord.Script['LangSysRecord'].push(LangSysRecord);
            _pop();
          }
          FontInfo.GPOS.ScriptList.ScriptRecord.push(ScriptRecord);
          _pop();
        }
        FontInfo.GPOS['FeatureList'] = {};
        FeatureListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.FeatureList;
        _move(FeatureListOffset);
        FontInfo.GPOS.FeatureList['FeatureCount'] = readUSHORT();
        FontInfo.GPOS.FeatureList['FeatureRecord'] = [];
        for (i = _q = 0, _ref7 = FontInfo.GPOS.FeatureList.FeatureCount; 0 <= _ref7 ? _q <= _ref7 : _q >= _ref7; i = 0 <= _ref7 ? ++_q : --_q) {
          FeatureRecord = {};
          FeatureRecord['FeatureTag'] = readTAG();
          FeatureRecord['FeatureOffset'] = readUSHORT();
          FeatureRecord['Feature'] = {};
          _push();
          _move(FeatureListOffset + FeatureRecord.FeatureOffset);
          FeatureRecord.Feature['FeatureParams'] = readUSHORT();
          FeatureRecord.Feature['LookupCount'] = readUSHORT();
          FeatureRecord.Feature['LookupListIndex'] = [];
          for (j = _r = 0, _ref8 = FeatureRecord.Feature.LookupCount; 0 <= _ref8 ? _r <= _ref8 : _r >= _ref8; j = 0 <= _ref8 ? ++_r : --_r) {
            FeatureRecord.Feature.LookupListIndex.push(readUSHORT());
          }
          FontInfo.GPOS.FeatureList.FeatureRecord.push(FeatureRecord);
          _pop();
        }
        FontInfo.GPOS['LookupList'] = {};
        LookupListOffset = FontInfo.TableDirectory.GPOS.offset + FontInfo.GPOS.Header.LookupList;
        _move(LookupListOffset);
        FontInfo.GPOS.LookupList['LookupCount'] = readUSHORT();
        FontInfo.GPOS.LookupList['Lookup'] = [];
        for (i = _s = 0, _ref9 = FontInfo.GPOS.LookupList.LookupCount; 0 <= _ref9 ? _s <= _ref9 : _s >= _ref9; i = 0 <= _ref9 ? ++_s : --_s) {
          FontInfo.GPOS.LookupList.Lookup.push(readUSHORT());
        }
        FontInfo.GPOS['Lookups'] = [];
        for (i = _t = 0, _ref10 = FontInfo.GPOS.LookupList.LookupCount; 0 <= _ref10 ? _t <= _ref10 : _t >= _ref10; i = 0 <= _ref10 ? ++_t : --_t) {
          Lookup = {};
          LookupOffset = LookupListOffset + FontInfo.GPOS.LookupList.Lookup[i];
          _move(LookupOffset);
          Lookup['LookupType'] = readUSHORT();
          Lookup['LookupFlag'] = readUSHORT_STR();
          Lookup['SubTableCount'] = readUSHORT();
          SubTableOffsets = [];
          for (j = _u = 0, _ref11 = Lookup.SubTableCount; 0 <= _ref11 ? _u <= _ref11 : _u >= _ref11; j = 0 <= _ref11 ? ++_u : --_u) {
            SubTableOffsets.push(readUSHORT());
          }
          Lookup['MarkFilteringSet'] = readUSHORT();
          _push();
          Lookup['SubTable'] = [];
          for (k = _v = 0, _ref12 = Lookup.SubTableCount; 0 <= _ref12 ? _v <= _ref12 : _v >= _ref12; k = 0 <= _ref12 ? ++_v : --_v) {
            SubtableOffset = SubTableOffsets[k];
            _move(LookupOffset + SubtableOffset);
            Coverage = {};
            Coverage['CoverageFormat'] = readUSHORT();
            console.log('-');
            if (Coverage.CoverageFormat === 1) {
              Coverage['GlyphCount'] = readUSHORT(true);
              Coverage['GlyphArray'] = [];
              for (j = _w = 0, _ref13 = Coverage.GlyphCount; 0 <= _ref13 ? _w <= _ref13 : _w >= _ref13; j = 0 <= _ref13 ? ++_w : --_w) {
                Coverage.GlyphArray.push(readUSHORT());
              }
            } else if (Coverage.CoverageFormat === 2) {
              Coverage['RangeCount'] = readUSHORT();
              Coverage['RangeRecord'] = [];
              for (j = _x = 0, _ref14 = Coverage.RangeCount; 0 <= _ref14 ? _x <= _ref14 : _x >= _ref14; j = 0 <= _ref14 ? ++_x : --_x) {
                RangeRecord = {};
                RangeRecord['Start'] = readUSHORT();
                RangeRecord['End'] = readUSHORT();
                RangeRecord['StartCoverageIndex'] = readUSHORT();
                Coverage.RangeRecord.push(RangeRecord);
              }
            } else {
              console.error('CoverageFormat:' + Coverage.CoverageFormat + ' is not allowed.');
            }
            Lookup.SubTable.push(Coverage);
          }
          _pop();
          FontInfo.GPOS.Lookups.push(Lookup);
        }
        $('#output').html(JSON.stringify(FontInfo.GPOS, null, '\t'));
        return console.log(FontInfo.GPOS);
      };
      _results.push(reader.readAsArrayBuffer(f));
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
