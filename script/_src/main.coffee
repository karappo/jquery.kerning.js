# ++++++++++++++++++++++++++++++++++++++++++++

# http://d.hatena.ne.jp/yasuhallabo/20140211/1392131668

# UTF8のバイト配列を文字列に変換
utf8_bytes_to_string = (arr) ->
  
  return null if arr == null

  result = ""
  while i = arr.shift()
    if i <= 0x7f
      result += String.fromCharCode(i)
    else if i <= 0xdf
      c = ((i&0x1f)<<6)
      c += arr.shift()&0x3f
      result += String.fromCharCode(c)
    else if i <= 0xe0
      c = ((arr.shift()&0x1f)<<6)|0x0800
      c += arr.shift()&0x3f
      result += String.fromCharCode(c)
    else
      c = ((i&0x0f)<<12)
      c += (arr.shift()&0x3f)<<6
      c += arr.shift() & 0x3f
      result += String.fromCharCode(c)
  return result

# 16進文字列をバイト値に変換
hex_to_byte = (hex_str) ->
  parseInt(hex_str, 16)

# バイト配列を16進文字列に変換
hex_string_to_bytes = (hex_str) ->
  result = []
  for i in [0...hex_str.length] by 2
    result.push(hex_to_byte(hex_str.substr(i,2)))
  return result

# UTF8の16進文字列を文字列に変換
utf8_hex_string_to_string = (hex_str1) ->
  bytes2 = hex_string_to_bytes(hex_str1)
  str2 = utf8_bytes_to_string(bytes2)
  return str2

# ++++++++++++++++++++++++++++++++++++++++++++
# Utility

window.pointer = 0
window.pointerHistory = []
window.data = null



_move = (_offset, _log) ->
  console.log('_move', _offset, _hexStr(_offset)) if _log
  window.pointer = _offset

_push = ->
  window.pointerHistory.push(window.pointer)

_pop = ->
  window.pointer = window.pointerHistory.pop()

_logPointer = ->
  console.log('pointer', _hexStr(window.pointer))


_u8ArrToStr = (u8array) ->
  # u8array : big endian
  result = ''
  for i in [0...u8array.length]
    result += ('00'+u8array[i].toString(16)).substr(-2)
  return result

# e.g. 51488 -> "0xC920"
_hexStr = (_num) ->
  '0x'+(_num).toString(16).toUpperCase()



# read bytes by data types

_Card8 = (_log) ->
  __readByte(1, _log)

_Card16 = (_log) ->
  __readByte(2, _log)

_USHORT = _Card16

_ULONG = (_log) ->
  __readByte(4, _log)

_FIXED = (_log) ->
  n = _u8ArrToStr(__read(4))
  console.log(parseInt(n,16), n) if _log
  parseFloat(n,16)

_USHORT_STR = -> 
  '0x'+_u8ArrToStr(__read(2))

_ULONG_STR = ->
  '0x'+_u8ArrToStr(__read(4))

_TAG = ->
  _STRING(4)


_STRING = (_len) ->
  utf8_hex_string_to_string(_u8ArrToStr(__read(_len)))


_INDEX = ->
  count = _Card16()

  if count is 0
    { count:0 }

  else
    offsetSize = _Card8()

    offset = []
    for i in [0..count]
      offset.push(__readByte(offsetSize))
    
    _data_start = window.pointer

    data = []
    for i in [0...count]
      _off = offset[i] - 1 
      _len = offset[i+1] - offset[i]
      _move(_data_start+_off)
      data.push(_STRING(_len))

    {
      count: count
      offsetSize: offsetSize
      offset: offset
      data: data
    }

# +++++++++++++++++++++++++++++++++++++++++++

__read = (_size) ->
  start = window.pointer
  window.pointer += _size
  window.data.subarray(start,window.pointer)

__readByte = (_num, _log) ->
  n = _u8ArrToStr(__read(_num))
  console.log(window.pointer, _hexStr(window.pointer), parseInt(n,16), n) if _log
  parseInt(n,16)

# ++++++++++++++++++++++++++++++++++++++++++++

handleDragOver = (e) ->
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy' # Explicitly show this is a copy.

handleFileSelect = (e) ->
  e.stopPropagation()
  e.preventDefault()

  files = e.dataTransfer.files

  for file in files
    reader = new FileReader()
    reader.onload = ->
      
      window.data = new Uint8Array(reader.result)

      FontInfo = {
        OffsetTable:
          version:       _ULONG_STR()
          numTables:     _USHORT()
          searchRange:   _USHORT()
          entrySelector: _USHORT()
          rangeShift:    _USHORT()
        TableDirectory: {}
      }
      
      for i in [0...FontInfo.OffsetTable.numTables]
        tag = String.fromCharCode.apply(null, __read(4)).replace(' ','')
        FontInfo.TableDirectory[tag] = {
          checkSum: _ULONG_STR()
          offset:   _ULONG()
          length:   _ULONG()
        }
      
      # "name" Table =========================
      
      _move FontInfo.TableDirectory.name.offset

      FontInfo['name'] = {
        format:  _USHORT()
        count:   _USHORT()
        offset:  _USHORT()
        records: []
      }

      for i in [0...FontInfo.name.count]
        FontInfo.name.records.push({
          platformID:  _USHORT()
          encordingID: _USHORT()
          languageId:  _USHORT()
          nameId:      _USHORT()
          length:      _USHORT()
          offset:      _USHORT()
        })

      storageOffset = FontInfo.TableDirectory.name.offset + FontInfo.name.offset # 文字ストレージの先頭
      for i in [0...FontInfo.name.count]
        _offset = storageOffset + FontInfo.name.records[i].offset
        _move(_offset)
        FontInfo.name.records[i]['nameString'] = _STRING(FontInfo.name.records[i].length)
      
      for record in FontInfo.name.records.length
        if record.languageId == 0  and record.nameId == 4
          console.log(record.nameString) # Font Name

      # "cmap" Table =========================
      
      _move(FontInfo.TableDirectory.cmap.offset)

      FontInfo['cmap'] = {
        version:        _USHORT()
        numTables:      _USHORT()
        encodingRecords:[]
      }


      for i in [0...FontInfo.cmap.numTables]
        FontInfo.cmap.encodingRecords.push({
          platformID: _USHORT()
          encordingID:_USHORT()
          offset:     _ULONG()
        })

      # TODO: read encoding sub tables

      # "CFF" Table =========================

      _move FontInfo.TableDirectory.CFF.offset

      # TODO: 値をちゃんと取得
      FontInfo['CFF'] = {
        Header:
          major: _Card8()
          minor: _Card8()
          headerSize: _Card8()
          offsetSize: _Card8()
        Name: null
      }
      
      FontInfo.CFF.Name = _INDEX()

      # FontInfo['CFF'] = {
      #   TopDictionary:{
      #     version: _USHORT()
      #     Notice: _USHORT()
      #     Copyright: _USHORT()
      #     CIDFontName: _USHORT()
      #     FullName: _USHORT()
      #     FamilyName: _USHORT()
      #     Weight: _USHORT()
      #     isFixedPitch: _USHORT()
      #     ItalicAngle: _USHORT()
      #     UnderlinePosition: _USHORT()
      #     UnderlineThickness: _USHORT()
      #     UniqueID: _USHORT()
      #     FontBBox:
      #       left:   _USHORT()
      #       bottom: _USHORT()
      #       right:  _USHORT()
      #       top:    _USHORT()
      #     StrokeWidth: _USHORT()
      #     XUID: _USHORT()
      #     charset: _USHORT()
      #     Encoding: _USHORT()
      #     CharStrings: _USHORT()
      #     Private: _USHORT()
      #     SyntheticBase: _USHORT()
      #     PostScript: _USHORT()
      #     BaseFontName: _USHORT()
      #     BaseFontBlend: _USHORT()
      #   }
      # }

      # "GPOS" Table =========================

      
      _move(FontInfo.TableDirectory.GPOS.offset)

      FontInfo['GPOS'] = {
        Header:
          Version:     _FIXED()
          ScriptList:  _USHORT() # offset
          FeatureList: _USHORT() # offset
          LookupList:  _USHORT() # offset
        ScriptList: null
        FeatureList: null
        LookupList: null
        Lookups: []
      }

      # Script List
      ScriptListOffset = FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.Header.ScriptList
      _move(ScriptListOffset)

      FontInfo.GPOS.ScriptList = {
        ScriptCount:  _USHORT()
        ScriptRecord: []
      }
      
      for i in [0...FontInfo.GPOS.ScriptList.ScriptCount]
        ScriptRecord = {
          ScriptTag:    _TAG();
          ScriptOffset: _USHORT();
          Script:       {}
        }
        
        ScriptTableOffset = ScriptListOffset + ScriptRecord.ScriptOffset
        _push()
        _move(ScriptTableOffset)
        
        ScriptRecord.Script = {
          DefaultLangSys: _USHORT()
          LangSysCount:   _USHORT()
          LangSysRecord:  []
        }

        for j in [0...ScriptRecord.Script.LangSysCount]
          LangSysRecord = {
            LangSysTag:    _TAG()
            LangSysOffset: _USHORT()
            LangSys:       {}
          }
          _push()
          _move(ScriptTableOffset+LangSysRecord.LangSysOffset)

          LangSysRecord.LangSys = {
            LookupOrder:     _USHORT()
            ReqFeatureIndex: _USHORT()
            FeatureCount:    _USHORT()
            FeatureIndex:    []
          }

          ScriptRecord.Script['LangSysRecord'].push(LangSysRecord)
          _pop()

        FontInfo.GPOS.ScriptList.ScriptRecord.push(ScriptRecord)
        _pop()

      # Feature List
      FeatureListOffset = FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.Header.FeatureList
      _move(FeatureListOffset)

      FontInfo.GPOS.FeatureList = {
        FeatureCount:  _USHORT()
        FeatureRecord: []
      }

      for i in [0...FontInfo.GPOS.FeatureList.FeatureCount]
        FeatureRecord = {
          FeatureTag:    _TAG()
          FeatureOffset: _USHORT()
          Feature:       {}
        }

        _push()
        _move(FeatureListOffset+FeatureRecord.FeatureOffset)

        FeatureRecord.Feature = {
          FeatureParams:   _USHORT()
          LookupCount:     _USHORT()
          LookupListIndex: []
        }

        for j in [0...FeatureRecord.Feature.LookupCount]
          FeatureRecord.Feature.LookupListIndex.push(_USHORT())
        
        FontInfo.GPOS.FeatureList.FeatureRecord.push(FeatureRecord)
        _pop()

      # Lookup List
      LookupListOffset = FontInfo.TableDirectory.GPOS.offset+FontInfo.GPOS.Header.LookupList
      _move(LookupListOffset)

      FontInfo.GPOS.LookupList = {
        LookupCount: _USHORT()
        Lookup:      []
      }

      for i in [0...FontInfo.GPOS.LookupList.LookupCount]
        FontInfo.GPOS.LookupList.Lookup.push(_USHORT())
      

      # Lookups
      for i in [0...FontInfo.GPOS.LookupList.LookupCount]

        # Lookup
        LookupOffset = LookupListOffset + FontInfo.GPOS.LookupList.Lookup[i]
        _move(LookupOffset)

        Lookup = {
          LookupType:    _USHORT()
          LookupFlag:    _USHORT_STR()
          SubTableCount: _USHORT()
          MarkFilteringSet: null
          SubTable: []
        }

        SubTableOffsets = []
        for j in [0...Lookup.SubTableCount]
          SubTableOffsets.push(_USHORT()) # offsets
        
        Lookup.MarkFilteringSet = _USHORT()

        _push()

        for k in [0...Lookup.SubTableCount]
          SubtableOffset = SubTableOffsets[k]
          _move(LookupOffset+SubtableOffset)

          # Coverage Subtable
          # Coverage = {}
          # Coverage['CoverageFormat'] = _USHORT() # TODO: ここが1,2でフォーマットが変わるっぽい
          # # console.log('-')
          # if(Coverage.CoverageFormat == 1)
          #   Coverage['GlyphCount'] = _USHORT()
          #   Coverage['GlyphArray'] = []
          #   for j in [0...Coverage.GlyphCount]
          #     Coverage.GlyphArray.push(_USHORT())
          #     # _USHORT()
          # else if(Coverage.CoverageFormat == 2)
          #   Coverage['RangeCount']  = _USHORT()
          #   Coverage['RangeRecord'] = []
          #   for j in [0...Coverage.RangeCount]
          #     RangeRecord = {}
          #     RangeRecord['Start'] = _USHORT()
          #     RangeRecord['End']   = _USHORT()
          #     RangeRecord['StartCoverageIndex'] = _USHORT()
          #     Coverage.RangeRecord.push(RangeRecord)
          # else
          #   console.error('CoverageFormat:'+Coverage.CoverageFormat+' is not allowed.')
          # Lookup.SubTable.push(Coverage)

        _pop()

        FontInfo.GPOS.Lookups.push(Lookup)

      # =======================================

      # output
      $('#output').html(JSON.stringify(FontInfo['CFF'], null, '\t'))
      # $('#output').html(JSON.stringify(FontInfo, null, '\t'))
      # console.log(FontInfo)
    
    reader.readAsArrayBuffer(file)


$ ->
  if window.File and window.FileReader and window.FileList and window.Blob
    # Setup the dnd listeners.
    dropZone = document.getElementById('dropzone')
    dropZone.addEventListener('dragover', handleDragOver, false)
    dropZone.addEventListener('drop', handleFileSelect, false)
  else
    console.error('The File APIs are not fully supported in this browser.')

###
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
###

