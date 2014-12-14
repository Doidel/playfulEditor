Tools.Menu = function ( editor ) {

	var signals = editor.signals;
	
	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "menu" );
	
	buttonpanel.addButton( "icon-file", function() { signals.menuButtonClicked.dispatch("file+help"); } );
	buttonpanel.addButton( "icon-add", function() { signals.menuButtonClicked.dispatch("add"); } );
	//buttonpanel.addButton( "icon-sound", function() { signals.menuButtonClicked.dispatch("sound"); } );
	
	return buttonpanel;

}
