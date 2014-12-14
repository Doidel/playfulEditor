_lS = {

	name: 'edges',
	
	/* init will be called either at scene creation or theme selection */
	init: function() {
	
		if ( !editor._isLoadingFile ) {
			console.log(' set theme fog ');
			var fogColor = new THREE.Color( 0x0099bb );
			editor.signals.fogTypeChanged.dispatch( 'Fog' );
			editor.signals.fogColorChanged.dispatch( fogColor.getHex() );
			editor.signals.fogParametersChanged.dispatch( 0.01, 50, 0.00025 );
		}
			
		// Customize the play character
		editor.play.callbacks.characterCreated = function( character ) {
			var egh = new THREE.EdgesHelper( character, 0x00ffff );
			egh.name = 'Helper';
			egh.material.linewidth = 2;
			character.add( egh );
			
			character._egh = egh;
		};
		
	},
	
	/* decorate will be called on object creation, scene creation or theme selection */
	decorate: function( object ) {
		
		console.log(object)
		o = object;
		if ( object instanceof THREE.Mesh ) {
			
			if ( object.name != "Ground" ) {
				object.material.opacity = 0.4;
				object.material.transparent = true;
				object.material.needsUpdate = true;
			}
			
			if (!object._egh) editor.setEdge( object, !object.events ? 1 : object.events.length );
		
		}
		
	},
	
	/* called when the editor's theme is switched. Maybe there are styles/properties you want to be removed which are specific to this style? */
	remove: function() {
	
		editor.scene.traverse( function( object ) {
			
			if ( object._physijs && object._egh ) {
			
				oject.material.opacity = 1.0;
			
				object.remove( object._egh );
				delete object._egh;
			
			}
			
		});
	
	},
	
	
	prefabsList: {
		// name: function to create it
		'Resurrection Sphere': function ( ) {
			var mesh = new Physijs.SphereMesh(
				new THREE.SphereGeometry( 0.5, 32, 16 ),
				Physijs.createMaterial(
					new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 10, shading: THREE.FlatShading }  ),
					0.5,
					0.5
				)
			);
				
			var loader = new THREE.JSONLoader();
			loader.load( "meshes/exampleObject.js", function( geometry, materials ) {
				mesh.geometry = geometry;
				mesh.geometry.needsUpdate = true;
				editor.signals.objectChanged.dispatch( mesh );
			});
				
			// Enable CCD if the object moves more than 1 meter in one simulation frame
			mesh.setCcdMotionThreshold(1);

			// Set the radius of the embedded sphere such that it is smaller than the object
			mesh.setCcdSweptSphereRadius(0.2);			
			
			mesh.isStatic = true;
			
			mesh.events = [
				{
					'action': {
						type: "Toss",
						x: 0,
						y: 1,
						z: 0
					},
					'trigger': {
						type: "Touch Fist"
					}
				}
			];
			
			mesh.behaviors = {
				'resurrection': {
					activator: 'collision',
					delay: 4
				}
			};
			
			return mesh;
			
		}
	}
}