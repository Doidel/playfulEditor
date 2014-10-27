Sidebar.SceneProperties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	container.add( new UI.Text().setValue( 'SCENE PROPERTIES' ) );
	container.add( new UI.Break(), new UI.Break() );

	
	// default color

	var defaultColorRow = new UI.Panel();
	var defaultColorType = new UI.Select().setOptions( {

		'None': 'None',
		'RMS': 'Average RMS'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' );
	defaultColorType.onChange( function () {

		var type = defaultColorType.getValue();
		signals.defaultColorTypeChanged.dispatch( type );
		editor.config.setKey('defaultColor', type)

	} );

	defaultColorRow.add( new UI.Text( 'Default Color' ).setWidth( '90px' ) );
	defaultColorRow.add( defaultColorType );

	//container.add( defaultColorRow );
	
	// fog

	var updateFogParameters = function () {

		var near = fogNear.getValue();
		var far = fogFar.getValue();
		var density = fogDensity.getValue();

		signals.fogParametersChanged.dispatch( near, far, density );

	};

	var fogTypeRow = new UI.Panel();
	var fogType = new UI.Select().setOptions( {

		'None': 'None',
		'Fog': 'Linear',
		'FogExp2': 'Exponential'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' )
	fogType.onChange( function () {

		var type = fogType.getValue();
		signals.fogTypeChanged.dispatch( type );

		refreshFogUI();

	} );

	fogTypeRow.add( new UI.Text( 'Fog' ).setWidth( '90px' ) );
	fogTypeRow.add( fogType );

	container.add( fogTypeRow );

	// fog color

	var fogColorRow = new UI.Panel();
	fogColorRow.setDisplay( 'none' );

	var fogColor = new UI.Color().setValue( '#aaaaaa' )
	fogColor.onChange( function () {

		signals.fogColorChanged.dispatch( fogColor.getHexValue() );

	} );

	fogColorRow.add( new UI.Text( 'Fog color' ).setWidth( '90px' ) );
	fogColorRow.add( fogColor );

	container.add( fogColorRow );

	// fog near

	var fogNearRow = new UI.Panel();
	fogNearRow.setDisplay( 'none' );

	var fogNear = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogNearRow.add( new UI.Text( 'Fog near' ).setWidth( '90px' ) );
	fogNearRow.add( fogNear );

	container.add( fogNearRow );

	var fogFarRow = new UI.Panel();
	fogFarRow.setDisplay( 'none' );

	// fog far

	var fogFar = new UI.Number( 5000 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogFarRow.add( new UI.Text( 'Fog far' ).setWidth( '90px' ) );
	fogFarRow.add( fogFar );

	container.add( fogFarRow );

	// fog density

	var fogDensityRow = new UI.Panel();
	fogDensityRow.setDisplay( 'none' );

	var fogDensity = new UI.Number( 0.00025 ).setWidth( '60px' ).setRange( 0, 0.1 ).setPrecision( 5 ).onChange( updateFogParameters );

	fogDensityRow.add( new UI.Text( 'Fog density' ).setWidth( '90px' ) );
	fogDensityRow.add( fogDensity );

	container.add( fogDensityRow );

	// skybox
	
	var updateSkybox = function () {
	// TODO: WIP
		var type = skyboxImage.getValue();
		var customTextures = [];
		
		if ( type == 'custom' ) {
			
			skyboxCustomTexturesContainer.setDisplay( '' );
			
			// reload every changed texture
			for ( var i = 0; i < 6; i++ ) {
				
				customTextures.push( skyboxCustomTextures[ i ].getValue() );
				
			}
		
		} else {
		
			skyboxCustomTexturesContainer.setDisplay( 'none' );
			
		}
		
		signals.skyboxChanged.dispatch( type, customTextures.length > 0 ? customTextures : undefined );
		
	};
	
	var updateFogParameters = function () {

		var near = fogNear.getValue();
		var far = fogFar.getValue();
		var density = fogDensity.getValue();

		signals.fogParametersChanged.dispatch( near, far, density );

	};

	var skyboxRow = new UI.Panel();
	var skyboxImage = new UI.Select().setOptions( {

		'none': 'None',
		'orangeclouds': 'Orange Sky',
		'gradient': 'Gradient',
		'grid': 'Grid',
		'chess': 'Chess',
		'custom': 'Custom'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( updateSkybox );
	
	var skyboxCustomTexturesContainer = new UI.Panel().setDisplay( 'none' );
	
	var skyboxCustomTextures = [
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox )
	];
	
	for ( var i = 0; i < 6; i++ ) {
		
		var panel = new UI.Panel();
		panel.add( new UI.Text( Skybox.prototype.endings[ i ] ).setWidth( '90px' ) );
		panel.add( skyboxCustomTextures[ i ] );
		skyboxCustomTexturesContainer.add( panel );
	
	}

	skyboxRow.add( new UI.Text( 'Skybox' ).setWidth( '90px' ) );
	skyboxRow.add( skyboxImage );
	skyboxRow.add( skyboxCustomTexturesContainer );

	container.add( skyboxRow );
	
	//

	var refreshFogUI = function () {

		var type = fogType.getValue();

		fogColorRow.setDisplay( type === 'None' ? 'none' : '' );
		fogNearRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogFarRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogDensityRow.setDisplay( type === 'FogExp2' ? '' : 'none' );

	};
	
	// 1 = visible in easy mode, 2 = visible in advanced mode, not part of this list = visible in both modes
	var propertyVisibilities = {
		'fogNear': 2,
		'fogFar': 2,
		'fogDensity': 2
	};
	
	function updateRows() {

		var object = editor.selected;

		var properties = {
			'fogNear': fogNearRow,
			'fogFar': fogFarRow,
			'fogDensity': fogDensityRow
		};

		for ( var property in properties ) {
		
			var visible = ( workMode == 'advanced' && propertyVisibilities[ property ] == 2) || ( workMode == 'easy' && propertyVisibilities[ property ] == 1 ) || propertyVisibilities[ property ] == undefined
			properties[ property ].setDisplay( visible ? '' : 'none' );

		}

	}
	
	function updateSceneOptionsDisplay( object ) {
	
		var display = object instanceof THREE.Scene ? '' : 'none';
		
		container.setDisplay( display );
		
		//defaultColorRow.setDisplay( display );
		//fogTypeRow.setDisplay( display );
		//skyboxRow.setDisplay( display );
		if ( display == '' ) {
			refreshFogUI();
			if ( skyboxImage.getValue() == 'custom' ) skyboxCustomTexturesContainer.setDisplay( '' );
			
			updateRows();
			
		}
	
	}
	
	
	
	signals.sceneGraphChanged.add( function () {
	
		var scene = editor.scene;
		
		if ( scene.fog ) {

			fogColor.setHexValue( scene.fog.color.getHex() );

			if ( scene.fog instanceof THREE.Fog ) {

				fogType.setValue( "Fog" );
				fogNear.setValue( scene.fog.near );
				fogFar.setValue( scene.fog.far );

			} else if ( scene.fog instanceof THREE.FogExp2 ) {

				fogType.setValue( "FogExp2" );
				fogDensity.setValue( scene.fog.density );

			}

		} else {

			fogType.setValue( "None" );

		}

		refreshFogUI();
		
		if ( scene.skybox ) {

				skyboxImage.setValue( scene.skybox.type );
				
				skyboxCustomTexturesContainer.setDisplay( scene.skybox.type == 'custom' ? '' : 'none' );
				
				if ( scene.skybox.type == 'custom' ) {
				
					for ( var i = 0; i < 6; i++ ) {
						
						if ( scene.skybox.materials[ i ].map.image === undefined ) continue;
						
						skyboxCustomTextures[ i ].setValue( scene.skybox.materials[ i ].map );
					
					}
				
				}

		} else {

			skyboxImage.setValue( "none" );

		}
		
		updateSceneOptionsDisplay( editor.selected );
	});
	
	signals.objectSelected.add( function ( object ) {
		
		updateSceneOptionsDisplay( object );

	} );
	

	return container;

}
