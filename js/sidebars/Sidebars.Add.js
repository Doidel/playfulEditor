Sidebars.Add = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("Add Object").appendTo(container.dom);
	var addmenu = new UI.Panel();
	
	var list = $("<ul/>")
		.addClass("menu object")
		.appendTo(addmenu.dom);
	
	editor.signals.themeLoaded.add( function( ) {
		
		list.empty();
	
		// populate with prefabs
		if ( editor.theme.currentTheme.prefabsList ) {
		
			var prefabs = Object.keys( editor.theme.currentTheme.prefabsList );
			for ( var x = 0; x < prefabs.length; x++ ) {
				
				var name = prefabs[ x ];
				
				var prefabLink = $('<a><img src="' + editor.theme.currentTheme.getImage( name ) + '"/> ' + name + '</a></li>');
				prefabLink.click( function (e) {
					
					var p = editor.theme.currentTheme.getPrefab( this );
					if (p.geometry.boundingBox == undefined) p.geometry.computeBoundingBox();
					p.position.y = p.geometry.boundingBox.size().y / 2;
					editor.addObject( p );
					editor.select( p );
				
				}.bind( name ) );
				$('<li/>').html(prefabLink).appendTo( list );
				
			}
			
		}
		
	} );
	
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
