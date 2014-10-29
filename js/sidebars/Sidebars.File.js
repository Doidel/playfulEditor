Sidebars.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("File").appendTo(container.dom);
	var menu = new UI.Panel();
	
	$("<ul/>")
		.addClass("menu")
		.html("<li>New</li><li>Import</li><li>Export</li>")
		.appendTo(menu.dom);
	
	signals.menuButtonClicked.add( function(name) {
		if(name=="file+help")
		{
			// Show this sidebar panel when file+help menu button is clicked
			$(container.dom).toggle(200);
		}
		else {
			$(container.dom).hide()
		}
	});
	
	container.add(menu);
	return container;
}
