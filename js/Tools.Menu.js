Tools.Menu = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "menu" );
	
	buttonpanel.addButton( "icon-add", function() { } );
	buttonpanel.addButton( "icon-sound", function() { } );
	
	return buttonpanel;

}
