$(window).resize(windowResize);
$(function(){
	windowResize();
	
	// loadData('/fonts/Yu Gothic Bold.otf', function(){
	// 	console.log('Load data success !');
	// });
	
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Setup the dnd listeners.
		var dropZone = document.getElementById('drop_zone');
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileSelect, false);
		
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
});

function handleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.dataTransfer.files;
	// var files = e.target.files;

	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {

		// Only process image files.
		// if (!f.type.match('image.*')) {
		// 	continue;
		// }

		var reader = new FileReader();
		reader.onload = function(theFile) {
			var data = reader.result;
					cmap = data.indexOf('cmap'),
					head = data.indexOf('head'),
					hhea = data.indexOf('hhea'),
					hmtx = data.indexOf('hmtx'),
					maxp = data.indexOf('maxp'),
					name = data.indexOf('name'),
					os2  = data.indexOf('OS/2'),
					post = data.indexOf('post'),
					kern = data.indexOf('kern'),
					palt = data.indexOf('palt'),
					CFF = data.indexOf('CFF');
			// console.log(u8ArrToStr(data.charAt(32)));
			console.log('CFF',CFF);
			console.log('cmap',cmap);
			console.log('head',head);
			console.log('hhea',hhea);
			console.log('hmtx',hmtx);
			console.log('maxp',maxp);
			console.log('name',name);
			console.log('os2',os2);
			console.log('post',post);
			console.log('kern',kern);
			console.log('palt',palt);
		};
		reader.readAsBinaryString(f);
	}
}

function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function loadData(dataUrl, callback){

	var req = new XMLHttpRequest();

	req.open('GET', dataUrl, true);
	req.responseType = 'arraybuffer';
	req.onload = function (oEvent) {
		var arrayBuffer = req.response;
		if (arrayBuffer) {
			var data	= new Uint8Array(arrayBuffer);
			
			var thumbnailMagic = String.fromCharCode.apply(null, data.subarray(0,4)); // convert to string
			// if(thumbnailMagic==='jatm'){
				var samplesPerThumbSampleDSD 	= u8ArrToStr(data.subarray(4,6)),
				samplesPerThumbSamplePCM 	= u8ArrToStr(data.subarray(6,8)),
				totalSamples							= u8ArrToStr(data.subarray(8,16)),
				numFinishedSamples				= u8ArrToStr(data.subarray(16,24)),
				numThumbnailSamples 			= u8ArrToStr(data.subarray(24,28)),
				numChannels								= u8ArrToStr(data.subarray(28,32)),
				sampleRate								= u8ArrToStr(data.subarray(32,36)),
						// future										= data.subarray(36,52), // reserved area
						thumbnailSamples					= new Int8Array(data.subarray(52));

				// success
				console.log(sampleRate);
				
				callback();
			// }else{
			// 	// Not allowed file type
			// 	console.error('Wrog waveform file format.');
			// }
		}
	};
	req.send(null);
}

function windowResize(){

}

// ++++++++++++++++++++++++++++++++++++++++++++
// Utility

function u8ArrToStr(u8array){
	// u8array : little endian
	for (var i=u8array.length-1, result='0x'; i >= 0; i--) {
		result += ('00'+u8array[i].toString(16)).substr(-2);
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

