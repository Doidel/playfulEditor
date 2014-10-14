Tools.Modes = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "modes" );
	
	buttonpanel.addButton( "icon-move active", function() { } );
	buttonpanel.addButton( "icon-scale", function() { } );
	buttonpanel.addButton( "icon-rotate", function() { } );
	buttonpanel.addButton( "icon-play", function() { } );
	
	return buttonpanel;

}
