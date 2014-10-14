_lS = {
	/* init will be called either at scene creation or theme selection */
	init: function() {
	
		var fogColor = new THREE.Color( 0xaaaaaa );
		editor.signals.fogTypeChanged.dispatch( 'Fog' );
		editor.signals.fogColorChanged.dispatch( fogColor.getHex() );
		editor.signals.fogParametersChanged.dispatch( 0.01, 50, 0.00025 );
		
	},
	
	/* decorate will be called on object creation, scene creation or theme selection */
	decorate: function( object ) {
	
		
		
	},
	
	/* called when the editor's theme is switched. Maybe there are styles/properties you want to be removed which are specific to this style? */
	remove: function() {
	
		
	
	}
}