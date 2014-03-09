// ++++++++++++++++++++++++++++++++++++++++++++

// http://d.hatena.ne.jp/yasuhallabo/20140211/1392131668

// UTF8のバイト配列を文字列に変換
function  utf8_bytes_to_string(arr){
  if(arr == null){ 
    return null;
  }

  var result = "";
  var i;
  while(i = arr.shift()) {
    var c;
    if(i <= 0x7f) {
      result += String.fromCharCode(i);
    }
    else if(i <= 0xdf) {
      c = ((i&0x1f)<<6);
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    }
    else if(i <= 0xe0) {
      c = ((arr.shift()&0x1f)<<6)|0x0800;
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    }
    else {
      c = ((i&0x0f)<<12);
      c += (arr.shift()&0x3f)<<6;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    }
  }
  return result;
}
// 16進文字列をバイト値に変換
function hex_to_byte(hex_str){
  return parseInt(hex_str, 16);
}
// バイト配列を16進文字列に変換
function hex_string_to_bytes(hex_str){
  var result = [];
  for (var i = 0; i < hex_str.length; i+=2) {
    result.push(hex_to_byte(hex_str.substr(i,2)));
  }
  return result;
}
// UTF8の16進文字列を文字列に変換
function utf8_hex_string_to_string(hex_str1){
  var bytes2 = hex_string_to_bytes(hex_str1);
  var str2 = utf8_bytes_to_string(bytes2);
  return str2;
}

// ++++++++++++++++++++++++++++++++++++++++++++
// Utility

var pointer = 0, data;

function move(_offset){ 
  console.log('move', _offset, (_offset).toString(16));
  pointer = _offset;
}
function read(_size){
  var start = pointer;
  pointer += _size;
  return data.subarray(start,pointer);
}
function u8ArrToStr(u8array){
  // u8array : big endian
  var result = '';
  for (var i=0; i<u8array.length; i++) {
    result += ('00'+u8array[i].toString(16)).substr(-2);
  }
  return result;
}
function readUSHORT(){ return parseInt(u8ArrToStr(read(2)),16); }
function readULONG() { var n = u8ArrToStr(read(4)); console.log(parseInt(n,16), n); return parseInt(n,16); }
function readULONG_STR() { return '0x'+u8ArrToStr(read(4)); }
function readFIXED() { return parseFloat(u8ArrToStr(read(4)),16); }
function readTAG() { return utf8_hex_string_to_string(u8ArrToStr(read(4))); }


// ++++++++++++++++++++++++++++++++++++++++++++

function handleDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files;

  // Loop through the FileList and render image files as thumbnails.
  for (var h = 0, f; f = files[h]; h++) {

    var reader = new FileReader();
    reader.onload = function() {
      data = new Uint8Array(reader.result);
      var i,
          j,
          obj,
          obj2,
          FontInfo = {};

      FontInfo['OffsetTable']               = {};
      FontInfo.OffsetTable['version']       = readULONG_STR();
      FontInfo.OffsetTable['numTables']     = readUSHORT();
      FontInfo.OffsetTable['searchRange']   = readUSHORT();
      FontInfo.OffsetTable['entrySelector'] = readUSHORT();
      FontInfo.OffsetTable['rangeShift']    = readUSHORT();

      FontInfo['TableDirectory'] = {};
      for (i = 0; i < FontInfo.OffsetTable.numTables; i++) {
        var tag = String.fromCharCode.apply(null, read(4));
        FontInfo.TableDirectory[tag] = {};
        FontInfo.TableDirectory[tag]['checkSum'] = readULONG_STR();
        FontInfo.TableDirectory[tag]['offset']   = readULONG();
        FontInfo.TableDirectory[tag]['length']   = readULONG();
      }
      
      // "name" Table =========================
      
      FontInfo['name'] = {};

      move(FontInfo.TableDirectory.name.offset);

      FontInfo.name['format'] = readUSHORT();
      FontInfo.name['count']  = readUSHORT();
      FontInfo.name['offset'] = readUSHORT();
      FontInfo.name['records']= [];
      for (i = 0; i < FontInfo.name.count; i++) {
        obj = {};
        obj['platformId'] = readUSHORT();
        obj['encordingId']= readUSHORT();
        obj['languageId'] = readUSHORT();
        obj['nameId']     = readUSHORT();
        obj['length']     = readUSHORT();
        obj['offset']     = readUSHORT();
        FontInfo.name.records.push(obj);
      }
      var storageOffset = FontInfo.TableDirectory.name.offset + FontInfo.name.offset; // 文字ストレージの先頭
      for (i = 0; i < FontInfo.name.count; i++) {
        var _offset = storageOffset + FontInfo.name.records[i].offset;
        move(_offset);
        FontInfo.name.records[i]['nameString'] = utf8_hex_string_to_string(u8ArrToStr(read(FontInfo.name.records[i].length)));
      }


      for(i =0; i < FontInfo.name.records.length; i++){
        if(FontInfo.name.records[i].languageId === 0 && FontInfo.name.records[i].nameId === 4){
          // Font Name
          console.log(FontInfo.name.records[i].nameString);
        }
      }

      // "cmap" Table =========================

      FontInfo['cmap'] = {};
            
      move(FontInfo.TableDirectory.cmap.offset);

      FontInfo.cmap['version']         = readUSHORT();
      FontInfo.cmap['numTables']       = readUSHORT();

      FontInfo.cmap['encodingRecords'] = [];
      for (i = 0; i < FontInfo.cmap.numTables; i++) {
        obj = {};
        obj['platformId']  = readUSHORT();
        obj['encordingId'] = readUSHORT();
        obj['offset']      = readULONG();
        FontInfo.cmap.encodingRecords.push(obj);
      }
      // TODO: read encoding sub tables

      // "GPOS" Table =========================

      FontInfo['GPOS'] = {};
      
      move(FontInfo.TableDirectory.GPOS.offset);

      FontInfo.GPOS['version']           = readFIXED();
      FontInfo.GPOS['ScriptListOffset']  = readUSHORT();
      FontInfo.GPOS['FeatureListOffset'] = readUSHORT();
      FontInfo.GPOS['LookupListOffset']  = readUSHORT();

      // Script List Table
      var ScriptListOffset = FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.ScriptListOffset;
      move(ScriptListOffset);
      FontInfo.GPOS['ScriptList'] = {};
      FontInfo.GPOS.ScriptList['count']  = readUSHORT();
      FontInfo.GPOS.ScriptList['records'] = [];
      var _p = pointer;
      for (i = 0; i < FontInfo.GPOS.ScriptList.count; i++) {
        obj = {};
        pointer = _p;
        obj['tag']    = readTAG();
        obj['offset'] = readUSHORT(); // offset
        _p = pointer;

        // Script Table
        obj['ScriptTable'] = {};
        move(ScriptListOffset + obj.offset);
        obj.ScriptTable['DefaultLangSys'] = readUSHORT();
        obj.ScriptTable['LangSysCount'] = readUSHORT();
        obj.ScriptTable['LangSysRecord'] = readUSHORT();
        for (j = 0; j < obj.ScriptTable.LangSysCount; j++) {
          obj2 = {};
          obj2['LangSysTag'] = readTAG();
          obj2['LangSys'] = readUSHORT(); // offset
          obj.push(obj2);
        }
        FontInfo.GPOS.ScriptList.records.push(obj);
      }

      // Feature List Table
      move(FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.FeatureListOffset);
      FontInfo.GPOS['FeatureList'] = {};
      FontInfo.GPOS.FeatureList['count']  = readUSHORT();
      FontInfo.GPOS.FeatureList['records'] = [];
      for (i = 0; i < FontInfo.GPOS.FeatureList.count; i++) {
        obj = {};
        obj['tag'] = readTAG();
        obj['offset'] = u8ArrToStr(read(2));
        FontInfo.GPOS.FeatureList.records.push(obj);
      }

      // Lookup List Table
      move(FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.LookupListOffset);
      FontInfo.GPOS['LookupList'] = {};
      FontInfo.GPOS.LookupList['count']  = readUSHORT();
      FontInfo.GPOS.LookupList['records'] = [];
      for (i = 0; i < FontInfo.GPOS.LookupList.count; i++) {
        obj = {};
        obj['tag'] = readTAG();
        obj['offset'] = u8ArrToStr(read(2));
        FontInfo.GPOS.LookupList.records.push(obj);
      }

      // =======================================

      // output
      $('#output').html(JSON.stringify(FontInfo, null, '\t'));
    };

    reader.readAsArrayBuffer(f);
  }
}


$(function(){
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Setup the dnd listeners.
    var dropZone = document.getElementById('dropzone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  }
  else {
    console.error('The File APIs are not fully supported in this browser.');
  }
});

/*
var cid = {
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

