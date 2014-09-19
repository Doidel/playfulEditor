Menubar.Play = function ( editor ) {

	var playing = false;

	// event handlers

	function onPlaySceneOptionClick () {
		
		if ( !playing ) {
		
			btn.dom.className = 'menuPlayButton stopButton';
			viewport.maximize();
			editor.signals.play.dispatch();
			playing = true;
			
		}
		else
		{
		
			btn.dom.className = 'menuPlayButton';
			viewport.windowed();
			editor.signals.stop.dispatch();
			playing = false;
			
		}
	}

	// configure menu contents

	/*var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		createOption( 'Play', onPlaySceneOptionClick )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'Play', optionsPanel );*/
	
	var btn = new UI.Button( '' );
	btn.dom.className = 'menuPlayButton';
	btn.dom.setAttribute( 'border', '0' );
	btn.dom.addEventListener( 'click', onPlaySceneOptionClick.bind( this ) );
	
	return btn;
}