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
		
		d3Button.removeClass("active");
		$(this).addClass("active");
	});
	
	var d3Button = $("<a/>").html("3D Stereo").on("click",function(e)
	{
		editor.signals.effectChanged.dispatch( 'StereoEffect' );
		
		d2Button.removeClass("active");
		$(this).addClass("active");
	});
	
	var cameraPanelButton = $("<a/>").html("Gallery Camera").on("click",function(e)
	{
		showHide('galleryCamera', $(this) );
	});
	
	var uploadPanelButton = $("<a/>").html("Gallery Upload").on("click",function(e)
	{
		showHide('galleryUpload', $(this));
	});

	var galleryPanelButton = $("<a/>").html("Gallery").on("click",function(e)
	{
		showHide('gallery', $(this));
	});
	
	function showHide ( id, menu ) {
	    var panel = $('#'+id);
	    if(panel.css('display') == 'none'){	
			menu.addClass("active");
			panel.css('display','block');
	    }else{				
			menu.removeClass("active");
			panel.css('display','none');
	    }
	}
	
	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu")
		.append( $("<li/>").addClass("twoup").html(d2Button) )
		.append( $("<li/>").addClass("twoup").html(d3Button) )
		.append( $("<li/>").html(cameraPanelButton) )
		.append( $("<li/>").html(uploadPanelButton) )
		.append( $("<li/>").html(galleryPanelButton) )
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
