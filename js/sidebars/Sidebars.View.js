Sidebars.View = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("View").appendTo(container.dom);
	var menu = new UI.Panel();
	menu.setClass("Panel menu");
	
	// Create a button for each menu item
	var d2Button = $("<a/>").html("2D Display").on("click",function(e)
	{
		editor.signals.effectChanged.dispatch( undefined );
	});
	
	var d3Button = $("<a/>").html("3D Stereo").on("click",function(e)
	{
		editor.signals.effectChanged.dispatch( 'StereoEffect' );
	});
	
	var cameraPanelButton = $("<a/>").html("Show / Hide Camera Panel").on("click",function(e)
	{
		showHide('gallery');
	});
	
	var uploadPanelButton = $("<a/>").html("Show / Hide Upload Panel").on("click",function(e)
	{
		showHide('galleryUpload');
	});
	
		function showHide ( id ) {
		    var panel = document.getElementById( id );
		    if(panel.style.display == 'none'){	
				panel.style.display = '';
		    }else{	
				panel.style.display = 'none';
		    }
		}
	
	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu")
		.append( $("<li/>").html(d2Button) )
		.append( $("<li/>").html(d3Button) )
		.append( $("<li/>").html(cameraPanelButton) )
		.append( $("<li/>").html(uploadPanelButton) )
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
