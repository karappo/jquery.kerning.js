(function($){

	// ::::::::::::::::
	// Kerning Plugin
	// ::::::::::::::::
	// 
	// by Naokazu Terada
	// 
	// Usage
	// $('#pageTopButton').kerning();
	//

	$.fn.kerning=function(config){

		var defaults = {};
		var options=$.extend(defaults, config);
		var kdata = config['data'][0]["kerning"];

		return this.each(function(i){
			
			var me = $(this);

			// 全タグ除去
			// var strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');

			// アンカーは残す
			var strArray,
					container,
					content = '';

			if(me.children('a').length){
				container = me.children('a');
				strArray = container.html().replace(/(<([^>]+)>)/ig,"").split('');
			}else{
				container = me;
				strArray = me.html().replace(/(<([^>]+)>)/ig,"").split('');
			}

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
					if(kdata[str]["L"]) left = kdata[str]["L"];
					if(kdata[str]["R"]) right = kdata[str]["R"];
				}
				// console.log(str,left,right);
				
				// for test
				if(linebreak!=undefined) content += '<span style="display:inline-block;">'+linebreak+'</span>';

				content += '<span style="display:inline-block;margin-left:'+left+'em;margin-right:'+right+'em;">'+strArray[i]+'</span>';

				// for test
				if(linebreak!=undefined) content += '<span style="display:inline-block;">'+linebreak+'</span><br>';
			};
			container.html(content);
		});
	};
})(jQuery);