Tools.Modes = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "modes", true );
	var signals = editor.signals;
	
	buttonpanel.addButton( "icon-translate active", function() { signals.transformModeChanged.dispatch( 'translate' ); } );
	buttonpanel.addButton( "icon-scale", function() { signals.transformModeChanged.dispatch( 'scale' ); } );
	buttonpanel.addButton( "icon-rotate", function() { signals.transformModeChanged.dispatch( 'rotate' ); } );
	buttonpanel.addButton( "icon-play", function() {  } );
	
	return buttonpanel;

}
