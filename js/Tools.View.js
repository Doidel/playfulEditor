Tools.View = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "view" );
	
	buttonpanel.addButton( "icon-pan", function() { } );
	buttonpanel.addButton( "icon-zoom", function() { } );
	
	return buttonpanel;

}
