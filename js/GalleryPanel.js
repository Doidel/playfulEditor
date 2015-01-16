var GalleryPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 
	
	var frame = $( document.createElement('iframe') );
	frame.attr('src','http://playfulmedia.cs.technik.fhnw.ch/play/gallery');
	frame.attr('width','100%');
	
	//update iframe content after every reload
	frame.load(function(){
		injectNewButton();
		$('#gallery > iframe').contents().find('body').css('background-color','transparent');;
		iFrameLoadImages();
	});
	
	//inject new code, so the user can open the scene directly in the already opened editor 
	var injectNewButton = function(){
		// $('#gallery > iframe').hover(function(){
			// $(this).parent().animate({'height':'+=20%', 'width':'+=20%', 'margin-left':'-=10%'},'slow');
		// },function(){
			// $(this).parent().animate({'height':'-=20%', 'width':'-=20%', 'margin-left':'+=10%'},'slow');
		// });
		
		$('#gallery > iframe').contents().find('.btn:contains("Open in PlayfulEditor")').each(function(){
			var match = $(this).attr('href').match(/(\d+)$/);
			if( match !== null ){
				$(this).html('Open in this PlayfulEditor');
				$(this).css
				//$(this).removeClass('btn-primary');
				//$(this).addClass('btn-warning');				
				$(this).click(function( event ){
					event.preventDefault();				
					editor.loader.loadRemotePlayful( '?load_scene='+match[0] );
				});
			}					
		});
	};
      
	container.dom.appendChild( frame[0] );
    return container;

}

