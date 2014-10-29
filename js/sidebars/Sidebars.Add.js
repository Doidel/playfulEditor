Sidebars.Add = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("Add Object").appendTo(container.dom);
	var addmenu = new UI.Panel();
	
	$("<ul/>")
		.addClass("menu object")
		.html("<li>[BILD] Rocket</li><li>[BILD] Grumpy Box</li><li>[BILD] Object 3</li><li>[BILD] Object 4</li><li>...</li>")
		.appendTo(addmenu.dom);
	
	container.add(addmenu);
	
	signals.menuButtonClicked.add( function(name) {
		if(name=="add")
		{
			// Show this sidebar panel when add menu button is clicked
			$(container.dom).toggle(200);
		}
		else {
			$(container.dom).hide()
		}
	});
	
	return container;
}
