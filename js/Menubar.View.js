Menubar.View = function ( editor ) {
	
	var menuConfig,
		optionsPanel,
		createOption,
		createDivider;

	function onLightThemeOptionClick () {

		editor.setTheme( 'css/light.css' );
		editor.config.setKey( 'theme', 'css/light.css' );

	}

	function onDarkThemeOptionClick () {

		editor.setTheme( 'css/dark.css' );
		editor.config.setKey( 'theme', 'css/dark.css' );

	}
	
	function on2DDisplayOptionClick () {
	
		editor.signals.effectChanged.dispatch( undefined );
	
	}
	
	function on3DStereoDisplayOptionClick () {
	
		editor.signals.effectChanged.dispatch( 'StereoEffect' );
	
	}
	

	// configure menu contents

	createOption  = UI.MenubarHelper.createOption;
	createDivider = UI.MenubarHelper.createDivider;

	menuConfig = [
		/*createOption( 'Light theme', onLightThemeOptionClick ),
		createOption( 'Dark theme', onDarkThemeOptionClick ),*/
		createOption( '2D Display', on2DDisplayOptionClick ),
		createOption( '3D Stereo', on3DStereoDisplayOptionClick )
	];

	optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'View', optionsPanel );

}
