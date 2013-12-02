$(window).resize(windowResize);
$(function(){
	windowResize();
	
	loadData('/fonts/Yu Gothic Bold.otf', function(){
		console.log('Load data success !');
	});

});


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

