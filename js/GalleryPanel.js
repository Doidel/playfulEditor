var GalleryPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 
	
	var frame = $( document.createElement('iframe') );
	frame.attr('src','http://playfulmedia.cs.technik.fhnw.ch/play/gallery');
	frame.attr('width','100%');
	
	
	frame.load(function(){
		injectNewButton();
	});
	//console.log();
	
	var injectNewButton = function(){
		$('#gallery > iframe').contents().find('.btn:contains("Open in PlayfulEditor")').each(function(){
			var match = $(this).attr('href').match(/(\d+)$/);
			if( match !== null ){
				$(this).html('Open in this PlayfulEditor');
				$(this).removeClass('btn-primary');
				$(this).addClass('btn-warning');
						
						// //$(this).attr('target','');
				$(this).click(function( event ){
					event.preventDefault();
					//console.log(match[0]);
					//console.log(editor.loader.loadRemotePlayful);
					editor.loader.loadRemotePlayful( '?load_scene='+match[0] );
				});
			}					
		});
	};
			
			// $('#gallery > iframe').load(function() {
				// injectNewButton();
			// });
			// injectNewButton();
	
	
	//frame.appendTo(container.dom);
      
	container.dom.appendChild( frame[0] );
    return container;

}

