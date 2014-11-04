Tools.Modes = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "modes", true );
	var signals = editor.signals;
	
	var lastSelected = undefined;
	
	var playing = false;
	var stopPlaying = function()
	{
		if( playing )
		{
			viewport.windowed();
			editor.signals.stop.dispatch();
			playing = false;
			editor.select( lastSelected );
		}
	}
	var startPlaying = function()
	{
		if( !playing )
		{
			viewport.maximize();
			lastSelected = editor.selected;
			editor.signals.play.dispatch();
			playing = true;
		}
	};
	
	buttonpanel.addButton( "icon-translate active", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'translate' ); } );
	buttonpanel.addButton( "icon-scale", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'scale' ); } );
	buttonpanel.addButton( "icon-rotate", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'rotate' ); } );
	buttonpanel.addButton( "icon-play", function() { 
		
		if( playing ) stopPlaying();
		else startPlaying();
		
	});
	
	return buttonpanel;

}
