$(window).resize(windowResize);
$(function(){
  windowResize();
  
  // loadData('/fonts/Yu Gothic Bold.otf', function(){
  //  console.log('Load data success !');
  // });
  
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    
    // Setup the dnd listeners.
    var dropZone = document.getElementById('dropzone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
});

var pointer = 0, data;
var read = function(_size){
  var start = pointer;
  pointer += _size;
  return data.subarray(start,pointer);
}
var readFrom = function(_offset, _size){
  var start = pointer;
  pointer += _size;
  return data.subarray(start,pointer);
}

function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files;

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    var reader = new FileReader();
    reader.onload = function(theFile) {
      data = new Int8Array(reader.result);
      var FontInfo = {};

      FontInfo['OffsetTable'] = {};
      FontInfo.OffsetTable['version']       = u8ArrToStr(read(4));
      FontInfo.OffsetTable['numTables']     = parseInt(u8ArrToStr(read(2)));
      FontInfo.OffsetTable['searchRange']   = parseInt(u8ArrToStr(read(2)));
      FontInfo.OffsetTable['entrySelector'] = parseInt(u8ArrToStr(read(2)));
      FontInfo.OffsetTable['rangeShift']    = parseInt(u8ArrToStr(read(2)));

      FontInfo['TableDirectory'] = {};
      for (var i = 0; i < FontInfo['OffsetTable']['numTables']; i++) {
        var tag = String.fromCharCode.apply(null, read(4));

        FontInfo.TableDirectory[tag] = {};
        FontInfo.TableDirectory[tag]['checkSum'] = u8ArrToStr(read(4));
        FontInfo.TableDirectory[tag]['offset'] = parseInt(u8ArrToStr(read(4)));
        FontInfo.TableDirectory[tag]['length'] = parseInt(u8ArrToStr(read(4)));
      }
      // console.log('FontInfo',FontInfo);

      console.log(data.subarray(FontInfo.TableDirectory.name.offset,FontInfo.TableDirectory.name.length));

      $('#output').html(JSON.stringify(FontInfo, null, '\t'));
    }
    reader.readAsArrayBuffer(f);
  }
}

function handleDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// ++++++++++++++++++++++++++++++++++++++++++++
// Utility

function u8ArrToStr(u8array,_asLittleEndian){
  var result='0x';
  if(_asLittleEndian){
    // u8array : little endian
    for (var i=u8array.length-1; i >= 0; i--) {
      result += ('00'+u8array[i].toString(16)).substr(-2);
    }
  }
  else {
    // u8array : big endian
    for (var i=0; i<u8array.length; i++) {
      result += ('00'+u8array[i].toString(16)).substr(-2);
    }
  }
  return result;
}

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

