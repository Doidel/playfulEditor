Menubar.PlayCameras = function ( editor ) {

	var cameraModes = [
		{
			name: 'Default camera',
			url: '../images/movementCamera.png'
		},
		{
			name: 'Freeflight camera',
			url: '../images/flyCamera.png'
		}
	];

	// event handlers
	
	var activeCameraMode = 0;
	
	function onChangeCameraOptionClick () {
		
		activeCameraMode++;
		activeCameraMode %= cameraModes.length;
		
		
	}
	
	editor.signals.play.add( function() {
	
		btn.setDisplay('block');
	
	} );
	
	editor.signals.stop.add( function() {
	
		btn.setDisplay('none');
	
	} );

	// configure menu contents

	/*var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		createOption( 'Play', onPlaySceneOptionClick )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'Play', optionsPanel );*/
	
	var btn = new UI.Button( '' );
	btn.dom.className = 'menuCameraButton';
	btn.dom.setAttribute( 'border', '0' );
	btn.dom.addEventListener( 'click', onChangeCameraOptionClick.bind( this ) );
	
	return btn;
}