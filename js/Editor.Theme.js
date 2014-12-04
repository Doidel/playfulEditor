Editor.Theme = function ( editor ) {

	this.currentTheme = undefined;

	editor.signals.themeChanged.add( function ( value ) {
		
		
		
			$.ajax({
				url: 'js/themes/' + value + '.js',
				dataType: 'script',
				success: function() {
					
					console.log('theme loaded');
				
					//remove old theme
					if ( editor.theme.currentTheme ) editor.theme.currentTheme.remove();
					//assign the loaded script as current theme
					editor.theme.currentTheme = _lS;
					
					//merge with defaults
					editor.theme.mergeDefaults();
					
					//execute the init function
					editor.theme.currentTheme.init();
					
					//decorate objects if theme was changed
					if ( editor.config.getKey( 'theme' ) != value ) {
						console.log( 'decorate', editor.config.getKey( 'theme' ),  value );
						editor.scene.traverse( function( el ) {
							
							editor.theme.currentTheme.decorate( el );
							
						});
						editor.config.setKey( 'theme', value );
					}
					
					editor.signals.sceneGraphChanged.dispatch();
					editor.signals.themeLoaded.dispatch( value );
					
				}
			}).done(function() {
			
			}).fail(function(v1, v2, v3) {
				console.log(v1, v2, v3);
			});
		
	});

	
	// empty default theme to avoid conflicts
	this.currentTheme = {
		init: function() {},
		decorate: function( ) {},
		remove: function() {}
	};
	
	// add default functions if none exist already by the theme
	this.mergeDefaults = function ( ) {
		
		if ( editor.theme.currentTheme ) {
		
			// default functions
			
			editor.theme.currentTheme.getPrefab = function( name ) {
			
				var mesh = this.prefabsList[ name ]();
				
				mesh.name = name;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				editor.theme.currentTheme.decorate( mesh );
				
				return mesh;
			
			};
			
			editor.theme.currentTheme.getImage = function( name ) {
				
				return 'js/themes/edges/' + name + '.png';
				
			};
		
			// prefabs
			
			if ( !editor.theme.currentTheme.prefabsList.Box ) {
				editor.theme.currentTheme.prefabsList.Box = function ( ) {
					var width = 1;
					var height = 1;
					var depth = 1;
			
					var widthSegments = 1;
					var heightSegments = 1;
					var depthSegments = 1;
			
					var geometry = new THREE.BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
					var material = Physijs.createMaterial(
						new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  ),
						0.5,
						0.5
					);
					var mesh = new Physijs.BoxMesh( geometry, material );
					
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					mesh.isStatic = true;
					
					return mesh;
				};
			}
			
			if ( !editor.theme.currentTheme.prefabsList.Sphere ) {
				editor.theme.currentTheme.prefabsList.Sphere = function ( ) {
					var radius = 0.5;
					var widthSegments = 32;
					var heightSegments = 16;
			
					var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
					var material = Physijs.createMaterial(
						new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  ),
						0.5,
						0.5
					);
					var mesh = new Physijs.SphereMesh( geometry, material );
					
					// Enable CCD if the object moves more than 1 meter in one simulation frame
					mesh.setCcdMotionThreshold(1);
					// Set the radius of the embedded sphere such that it is smaller than the object
					mesh.setCcdSweptSphereRadius(0.2);
					
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					mesh.isStatic = true;
			
					return mesh;
				};
			}
			
			if ( !editor.theme.currentTheme.prefabsList.Cylinder ) {
				editor.theme.currentTheme.prefabsList.Cylinder = function ( ) {
					var radiusTop = 0.5;
					var radiusBottom = 0.5;
					var height = 1;
					var radiusSegments = 8;
					var heightSegments = 1;
					var openEnded = false;
			
					var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
					var material = Physijs.createMaterial(
						new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  ),
						0.5,
						0.5
					);
					var mesh = new Physijs.CylinderMesh( geometry, material );
					
					mesh.castShadow = true;
					mesh.receiveShadow = true;
					mesh.isStatic = true;
			
					return mesh;
				};
			}
			
		}
		
	};
};