(function($){

	// ::::::::::::::::
	// Kerning Plugin
	// ::::::::::::::::
	// 
	// by Naokazu Terada
	// 
	// Usage
	// $.getJSON("/script/kerning.json" , function(data) {
	// 		kerningData = data;
	// 		$('h2,h3,h4,h5').kerning({"data":kerningData});
	// });
	//

	$.fn.kerning=function(config){

		var defaults = {};
		var options=$.extend(defaults, config);
		var kdata = config['data'][0]["kerning"];

		return this.each(function(i){
			
			var me = $(this),
					container = me,
					strArray = me.html(),
					content = '';

			// 全タグ除去
			// var strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
			
			// アンカー以外のタグ除去
			// if(me.children('a').length){
			// 	container = me.children('a');
			// 	strArray = container.html().replace(/(<([^>]+)>)/ig,"").split('');
			// }else{
			// 	container = me;
			// 	strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
			// }

			// for test
			var delimiter = me.data('delimiter');
			var linebreak = me.data('linebreak');
			if(delimiter!=undefined){
				strArray = (delimiter+strArray.join(delimiter)+delimiter).split('');
			}

			for (var i = 0; i < strArray.length; i++) {
				var str = strArray[i];
				var left = 0;
				var right = 0;
				if(kdata[str]){
					// console.log(str,kdata[str]);
					if(kdata[str]["L"]) left = kdata[str]["L"];
					if(kdata[str]["R"]) right = kdata[str]["R"];

					// for test
					if(linebreak!=undefined) content += '<span style="display:inline-block;">'+linebreak+'</span>';

					content += '<span style="display:inline-block;margin-left:'+left+'em;margin-right:'+right+'em;">'+str+'</span>';

					// for test
					if(linebreak!=undefined) content += '<span style="display:inline-block;">'+linebreak+'</span><br>';
				}
				else{
					content += str;
				}
				// console.log(str,left,right);
				
				
			};
			container.html(content);
		});
	};
})(jQuery);