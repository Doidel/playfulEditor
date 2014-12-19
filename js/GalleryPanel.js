var GalleryPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 
	
	var frame = $( document.createElement('iframe') );
	frame.attr('src','http://playfulmedia.cs.technik.fhnw.ch/play/gallery');
	frame.attr('width','100%');
	//frame.appendTo(container.dom);
      
	container.dom.appendChild( frame[0] );
    return container;

}

