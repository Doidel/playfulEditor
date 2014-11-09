Sidebars.Help = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("Help").appendTo(container.dom);
	var menu = new UI.Panel();
	
	// Create a button for each menu item
	var sourceButton = $("<a/>").html("Source Code").on("click",function(e)
	{
		window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )
	});
	
	var aboutButton = $("<a/>").html("About").on("click",function(e)
	{
		window.open( 'http://threejs.org', '_blank' );
	});
		
	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu")
		.append( $("<li/>").html(sourceButton) )
		.append( $("<li/>").html(aboutButton) )
		.appendTo(menu.dom);
	
	// Add signal listener to show/hide this sidebar panel
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
