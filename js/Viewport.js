var Viewport = function ( editor ) {

	var signals = editor.signals;


       

	var container = new UI.Panel();
	container.setPosition( 'absolute' );

	var info = new UI.Text();
	info.setPosition( 'absolute' );
	info.setRight( '5px' );
	info.setBottom( '5px' );
	info.setFontSize( '12px' );
	info.setColor( '#ffffff' );
	info.setValue( 'objects: 0, vertices: 0, faces: 0' );
	container.add( info );
	
	var blocker = new UI.Panel();
	blocker.setId( 'blocker' );
	
	var instructions = new UI.Panel();
	instructions.setId( 'instructions' );
	instructions.dom.innerHTML = '<span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, MOUSE = Look around)';
	
	blocker.add( instructions );
	blocker.setDisplay( 'none' );
	container.add( blocker );

	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var objects = [];

	// helpers

	var grid = new THREE.GridHelper( 5, 0.25 );
	sceneHelpers.add( grid );

	//
	
	var camera = new THREE.PerspectiveCamera( 60, 1, 0.01, 500 );
	camera.position.fromArray( editor.config.getKey( 'camera' ).position );
	camera.lookAt( new THREE.Vector3().fromArray( editor.config.getKey( 'camera' ).target ) );
	editor._cam = camera;

	editor._activeCamera = camera;

	//

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var transformControls = new THREE.TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {
	
		controls.enabled = true;

		if ( transformControls.axis !== null ) {

			controls.enabled = false;

		}

		if ( editor.selected !== null ) {

			if ( editor.omittedObjects.indexOf( editor.selected.name ) !== -1 ) {
			
				controls.enabled = false;
			
			} else {
		
				signals.objectChanged.dispatch( editor.selected );
			
			}

		}

	} );
	sceneHelpers.add( transformControls );
	editor._activeControls = transformControls;
	
	
	
	var playCamera = new THREE.PerspectiveCamera( 50, 1, 0.01, 500 );
	playCamera.name = 'playCamera';
	
	editor.play.setLeapCamera( playCamera );
	//console.log(container);
	var orbitControls = new THREE.OrbitControls( playCamera, container.dom );
	
	
	// "play" pointerlock controls
	
	/*var playCamera = new THREE.PerspectiveCamera( 50, 1, 0.01, 500 );
	playCamera.name = 'playCamera';
	
	editor.play.setLeapCamera( playCamera );
	
	var pointerLockControls = new THREE.PointerLockControls( playCamera );
	var yawObject = pointerLockControls.getObject();
	
	editor._pointerLockControls = pointerLockControls;
	editor._pointerLockControls.blocker = blocker;
	
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	
	if ( havePointerLock ) {

		var element = container.dom; //document.body

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				if ( !editor.play._leapStreaming ) pointerLockControls.enabled = true;

				blocker.dom.style.display = 'none';

			} else {

				pointerLockControls.enabled = false;

				blocker.dom.style.display = '-webkit-box';
				blocker.dom.style.display = '-moz-box';
				blocker.dom.style.display = 'box';

				instructions.setDisplay( '' );

			}

		}

		var pointerlockerror = function ( event ) {

			instructions.dom.style.display = '';

		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.dom.addEventListener( 'click', function ( event ) {

			instructions.dom.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		alert('Your browser doesn\'t seem to support Pointer Lock API. The "Play" mode requires a modern browser.');

	}*/
	
	var leapBoxWalls;
	//leapbox with
	function addLeapBox() {
		
		if ( !leapBoxWalls ) {
		
			var planeMat = Physijs.createMaterial(
				new THREE.MeshPhongMaterial( {
					ambient: 0x555555,
					color: 0x555555,
					specular: 0xffffff,
					shininess: 50,
					shading: THREE.SmoothShading,
					opacity: 0.2,
					transparent: true,
					side: THREE.BackSide
				}  ),
				0.5,
				0.5
			);
			//var planeGeom = new THREE.BoxGeometry( 1, 10, 10, 1, 1, 1 );
			var planeGeom = new THREE.BoxGeometry( 10, 10, 0.1, 1, 1 );
			leapBoxWalls = [
				new Physijs.BoxMesh( planeGeom, planeMat, 0 ),
				new Physijs.BoxMesh( planeGeom, planeMat, 0 ),
				new Physijs.BoxMesh( planeGeom, planeMat, 0 ),
				new Physijs.BoxMesh( planeGeom, planeMat, 0 ),
				new Physijs.BoxMesh( planeGeom, planeMat, 0 )
			];
			for (var x = 0; x < leapBoxWalls.length; x++) leapBoxWalls[x].name = 'LeapBoxWall' + x;
			leapBoxWalls[0].position.x = 5;
			leapBoxWalls[0].position.y = 5;
			leapBoxWalls[0].rotation.y = Math.PI / 2;
			leapBoxWalls[1].position.z = 5;
			leapBoxWalls[1].position.y = 5;
			leapBoxWalls[1].rotation.y = 0;
			leapBoxWalls[2].position.x = -5;
			leapBoxWalls[2].position.y = 5;
			leapBoxWalls[2].rotation.y = -Math.PI / 2;
			leapBoxWalls[3].position.z = -5;
			leapBoxWalls[3].position.y = 5;
			leapBoxWalls[3].rotation.y = Math.PI;
			leapBoxWalls[4].position.y = 10;
			leapBoxWalls[4].rotation.x = Math.PI / 2;
			leapBoxWalls[4].rotation.y = Math.PI;
			editor.scene.add(leapBoxWalls[0]);
			editor.scene.add(leapBoxWalls[1]);
			editor.scene.add(leapBoxWalls[2]);
			editor.scene.add(leapBoxWalls[3]);
			editor.scene.add(leapBoxWalls[4]);
			
		}
		
	}
	
	function updateLeapBoxVisibility() {
		
		if ( leapBoxWalls ) {
			leapBoxWalls[0].visible = editor._activeCamera.position.x < 4.8;
			leapBoxWalls[2].visible = editor._activeCamera.position.x > -4.8;
			leapBoxWalls[1].visible = editor._activeCamera.position.z < 4.8;
			leapBoxWalls[3].visible = editor._activeCamera.position.z > -4.8;
			leapBoxWalls[4].visible = editor._activeCamera.position.y < 9.8;
		}
		
	}
	
	function removeLeapBox() {
	
		if ( leapBoxWalls !== undefined ) {
			for (var x = 0; x < leapBoxWalls.length; x++) editor.scene.remove( leapBoxWalls[ x ] );
			leapBoxWalls = undefined;
		}
	
	}	
	
	signals.leapBoxChanged.add( function( val ) {
		
		editor.scene.hasLeapBox = val;
		if ( val === false ) removeLeapBox();
		else if ( container.play === true ) addLeapBox();
		
	} );
	
	signals.play.add( function() {
		
		blocker.setDisplay( 'none' );
		editor.deselect();
		transformControls.detach();
		editor._activeCamera = playCamera;
		/*yawObject.position.set( camera.position.x, camera.position.y, camera.position.z );
		var rot = camera.rotation.clone();
		rot.reorder( "YXZ" );
		yawObject.rotation.y = rot.y;
		yawObject.children[0].rotation.x = rot.x;*/
		
		//fixed camera pos
		/*yawObject.position.set( 0, 4.3, 8.5 );
		var rot = new THREE.Euler( -0.25, 0, 0 );
		rot.reorder( "YXZ" );
		yawObject.rotation.y = rot.y;
		yawObject.children[0].rotation.x = rot.x;
		
		scene.add( yawObject );*/
		
		editor._activeControls = orbitControls;
		
		editor._activeControls.setTranslate( new THREE.Vector3( 0, 4.3, 8.5 ) );
	
		//if ( editor.scene.skybox ) editor.scene.skybox.alignWithCamera( editor._activeCamera );
		render();
	
		//reset simulation deltas in order to have a fresh start!
		viewport._lastSoundUpdate = Date.now();
		//scene.resetSimulation();
		editor.startPlay();
		scene.add( playCamera );
		if ( editor.scene.hasLeapBox !== false ) addLeapBox();
		container.play = true;
		
	} );
	
	signals.stop.add( function() {
		
		blocker.setDisplay( 'none' );
		//pointerLockControls.enabled = false;
		editor._activeCamera = camera;
		//scene.remove( yawObject );
		scene.remove( playCamera );
		
		removeLeapBox();
		
		container.play = false;
		
		//give the simulation time to run out
		setTimeout( function() {
			editor.resetPlay();
			editor._activeControls = transformControls;
			
			// Call resize method to make sure that viewport is rendered correctly after play mode in 3D
			signals.windowResize.dispatch();
		}, 100);
		
	} );
			

			
	// fog

	var oldFogType = "";
	var oldFogColor = 0xaaaaaa;
	var oldFogNear = 0.01;
	var oldFogFar = 50;
	var oldFogDensity = 0.00025;

	// object picking

	var ray = new THREE.Raycaster();
	var projector = new THREE.Projector();

	// events

	var getIntersects = function ( event, object ) {

		var rect = container.dom.getBoundingClientRect();
		x = ( event.clientX - rect.left ) / rect.width;
		y = ( event.clientY - rect.top ) / rect.height;
		var vector = new THREE.Vector3( ( x ) * 2 - 1, - ( y ) * 2 + 1, 0.5 );

		projector.unprojectVector( vector, camera );

		ray.set( camera.position, vector.sub( camera.position ).normalize() );

		if ( object instanceof Array ) {

			return ray.intersectObjects( object );

		}

		return ray.intersectObject( object );

	};

	var onMouseDownPosition = new THREE.Vector2();
	var onMouseUpPosition = new THREE.Vector2();

	var onMouseDown = function ( event ) {

		event.preventDefault();
		
		if ( viewport.play ) return false;

		var rect = container.dom.getBoundingClientRect();
		x = (event.clientX - rect.left) / rect.width;
		y = (event.clientY - rect.top) / rect.height;
		onMouseDownPosition.set( x, y );

		document.addEventListener( 'mouseup', onMouseUp, false );

	};

	var onMouseUp = function ( event ) {

		var rect = container.dom.getBoundingClientRect();
		x = (event.clientX - rect.left) / rect.width;
		y = (event.clientY - rect.top) / rect.height;
		onMouseUpPosition.set( x, y );

		if ( onMouseDownPosition.distanceTo( onMouseUpPosition ) == 0 ) {

			var intersects = getIntersects( event, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

		document.removeEventListener( 'mouseup', onMouseUp );

	};

	var onDoubleClick = function ( event ) {

		var intersects = getIntersects( event, objects );

		if ( intersects.length > 0 && intersects[ 0 ].object === editor.selected ) {

			controls.focus( editor.selected );

		}

	};

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );

	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new THREE.EditorControls( camera, container.dom );
	controls.center.fromArray( editor.config.getKey( 'camera' ).target )
	controls.addEventListener( 'change', function () {

		transformControls.update();
		signals.cameraChanged.dispatch( camera );

	} );
	
	// sound listener
	
	editor.soundCollection = new SoundCollection({
		cam: playCamera
	});

	// signals

	/*signals.themeChanged.add( function ( value ) {

		switch ( value ) {

			case 'css/light.css':
				grid.setColors( 0x444444, 0x888888 );
				clearColor = 0xaaaaaa;
				break;
			case 'css/dark.css':
				grid.setColors( 0xbbbbbb, 0x888888 );
				clearColor = 0x333333;
				break;

		}
		
		var cC = editor.config.getKey( 'clearColor' );
		if ( cC !== undefined ) clearColor = parseInt( cC );
		
		renderer.setClearColor( clearColor );

		render();

	} );*/
	
	signals.skyboxChanged.add( function ( type, customTextures ) {
	
		if ( type == 'none' ) {
			
			// remove current skybox
			if ( editor.scene.skybox !== undefined ) {
				editor.scene.skybox;
				editor.scene.skybox.dispose();
				editor.scene.skybox = undefined;
			}
			
		} else {
		
			// add the right skybox
			if ( editor.scene.skybox === undefined ) {
				
				//create the skybox
				editor.scene.skybox = new Skybox();
				editor.scene.add( editor.scene.skybox.mesh );
				editor.scene.skybox.alignWithCamera( editor._activeCamera );
				
			}
			
			if ( type != 'custom' ) {
			
				editor.scene.skybox.setPath( type.toLowerCase() );
			
			} else {
			
				editor.scene.skybox.setTextures( customTextures );
			
			}
		
		}
	
	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererChanged.add( function ( type ) {

		container.dom.removeChild( renderer.domElement );

		renderer = new THREE[ type ]( { antialias: false } );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.setClearColor( clearColor );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		if ( effect ) effect.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		//assignCameraPositionToLights();
		render();
		updateInfo();

	} );

	var saveTimeout;

	signals.cameraChanged.add( function () {

		if ( saveTimeout !== undefined ) {

			clearTimeout( saveTimeout );

		}

		saveTimeout = setTimeout( function () {
		
			if ( !viewport.play ) {
				editor.config.setKey( 'camera', {
					position: camera.position.toArray(),
					target: controls.center.toArray()
				} );
			}

		}, 1000 );

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null ) {

			if ( object.geometry !== undefined &&
				 object instanceof THREE.Sprite === false ) {

				selectionBox.update( object );
				selectionBox.visible = true;

			}

			if ( object instanceof THREE.PerspectiveCamera === false ) {

				transformControls.attach( object );

			}

		}

		render();

	} );
	
	signals.objectChanged.add( function ( object ) {

		if ( object != undefined && object == editor.selected ) {

			selectionBox.update( object );
			selectionBox.visible = true;

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		var materialsNeedUpdate = false;

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Light ) materialsNeedUpdate = true;

			objects.push( child );

		} );

		if ( materialsNeedUpdate === true ) updateMaterials();

	} );

	signals.objectChanged.add( function ( object ) {

		transformControls.update();

		if ( ! object instanceof THREE.PerspectiveCamera ) {

			if ( object.geometry !== undefined ) {

				selectionBox.update( object );

			}

			if ( editor.helpers[ object.id ] !== undefined ) {

				editor.helpers[ object.id ].update();

			}

			updateInfo();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		var materialsNeedUpdate = false;

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Light ) materialsNeedUpdate = true;

			objects.splice( objects.indexOf( child ), 1 );

		} );

		if ( materialsNeedUpdate === true ) updateMaterials();

	} );

	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	signals.fogTypeChanged.add( function ( fogType ) {

		if ( fogType !== oldFogType ) {

			if ( fogType === "None" ) {

				scene.fog = null;

			} else if ( fogType === "Fog" ) {

				scene.fog = new THREE.Fog( oldFogColor, oldFogNear, oldFogFar );

			} else if ( fogType === "FogExp2" ) {

				scene.fog = new THREE.FogExp2( oldFogColor, oldFogDensity );

			}

			updateMaterials();

			oldFogType = fogType;

		}

		render();

	} );

	signals.fogColorChanged.add( function ( fogColor ) {

		oldFogColor = fogColor;

		updateFog( scene );
		
		clearColor = fogColor;
		renderer.setClearColor( clearColor );

		render();

	} );

	signals.fogParametersChanged.add( function ( near, far, density ) {

		oldFogNear = near;
		oldFogFar = far;
		oldFogDensity = density;

		updateFog( scene );

		render();

	} );
	
	function setRMSColor( buffer, material ) {
	
		//calculate RMS
		var rms = 0;
		var data = buffer.getChannelData(0);
		for (var x = 0; x < data.length; x++) {
		
			rms += data[x] * data[x];
			
		}
		rms = Math.sqrt(rms / data.length);
		
		if (rms <= 0.5) {
		
			var x = Math.round((215 / 0.5 * rms) + 40);
			material.color.setRGB( 0, x / 255, 1);
			
		} else if (rms > 0.5) {
		
			var y = Math.round((215 * rms) + 43 + 40);
			material.color.setRGB( 0, 1, y / 255 );
			
		};
		
		render();
		
	}
	
	signals.defaultColorTypeChanged.add( function ( defaultColorType ) {
	
		if ( defaultColorType == 'RMS' ) {
			
			// update color for all objects which have a sound
			editor.scene.traverse( function ( node ) {

				if ( node.material && node.sounds) {
					var sound = node.sounds.constant;
					if ( sound == undefined ) node.sounds.collision;
					if ( sound == undefined ) {

						var buffer = editor.soundCollection._soundCollection.buffer[ editor.soundCollection._getSoundIndex( sound ) ];
						
						setRMSColor( buffer, node.material );

					}
				}

			} );
			
		}
		
	} );
	
	signals.soundAdded.add( setRMSColor );

	signals.windowResize.add( function () {

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();
		
		playCamera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		playCamera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		if ( effect ) effect.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );
	
	container.maximize = function() {
	
		$(sidebars.dom).fadeOut(500);
		$(tools.menu.dom).fadeOut(500);
		editor.signals.windowResize.dispatch();
		
	};
	
	container.windowed = function() {
	
		$(sidebars.dom).fadeIn(500);
		$(tools.menu.dom).fadeIn(500);
		editor.signals.windowResize.dispatch();
		
	};

	signals.playAnimations.add( function (animations) {
		
		function animate() {

			requestAnimationFrame( animate );
			
			for ( var i = 0; i < animations.length ; i ++ ) {

				animations[i].update(0.016);

			} 

			render();
		}

		animate();

	} );
	
	//

	var clearColor, renderer, effect;

	if ( editor.config.getKey( 'renderer' ) !== undefined ) {

		renderer = new THREE[ editor.config.getKey( 'renderer' ) ]( { antialias: true } );

	} else {

		if ( System.support.webgl === true ) {

			renderer = new THREE.WebGLRenderer( { antialias: true } );

		} else {

			renderer = new THREE.CanvasRenderer();

		}

	}
	
	if ( editor.config.getKey( 'effect' ) !== undefined ) {

		effect = new THREE[ editor.config.getKey( 'effect' ) ]( renderer );

	}
	
	//renderer = new THREE.WebGLDeferredRenderer( { antialias: true } );
	
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 50;

	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;

	renderer.autoClear = false;
	renderer.autoUpdateScene = false;
	container.dom.appendChild( renderer.domElement );
	
	animate();
	
	
	editor._renderer = renderer;
	
	//TODO: signals.effectChanged.dispatch( 'StereoEffect' );
	signals.effectChanged.add( function( type ) {
	
		switch ( type ) {
			case 'StereoEffect':
				effect = new THREE.StereoEffect( renderer );
				effect.separation = -.63; //wrong way round?
				break;
			case undefined:
				effect = undefined;
				break;
		}
		
		editor.config.setKey( 'effect', type )
		
		signals.windowResize.dispatch();
		render();
		//e = effect;
		
	} );
	

	//

	function updateInfo() {

		var objects = 0;
		var vertices = 0;
		var faces = 0;

		scene.traverse( function ( object ) {

			if ( object instanceof THREE.Mesh ) {

				objects ++;

				var geometry = object.geometry;

				if ( geometry instanceof THREE.Geometry ) {

					vertices += geometry.vertices.length;
					faces += geometry.faces.length;

				} else if ( geometry instanceof THREE.BufferGeometry ) {

					vertices += geometry.attributes.position.array.length / 3;

					if ( geometry.attributes.index !== undefined ) {

						faces += geometry.attributes.index.array.length / 3;

					} else {

						faces += geometry.attributes.position.array.length / 9;

					}

				}

			}

		} );

		info.setValue( 'objects: ' + objects + ', vertices: ' + vertices + ', faces: ' + faces );

	}

	function updateMaterials() {

		editor.scene.traverse( function ( node ) {

			if ( node.material ) {

				node.material.needsUpdate = true;

				if ( node.material instanceof THREE.MeshFaceMaterial ) {

					for ( var i = 0; i < node.material.materials.length; i ++ ) {

						node.material.materials[ i ].needsUpdate = true;

					}

				}

			}

		} );

	}

	function updateFog( root ) {

		if ( root.fog ) {

			root.fog.color.setHex( oldFogColor );

			if ( root.fog.near !== undefined ) root.fog.near = oldFogNear;
			if ( root.fog.far !== undefined ) root.fog.far = oldFogFar;
			if ( root.fog.density !== undefined ) root.fog.density = oldFogDensity;

		}

	}

	container.play = false;
	function animate() {

		requestAnimationFrame( animate );
		
		if ( container.play ) {
		
			var now = Date.now();
			var delta = now - viewport._lastSoundUpdate;
			
			if ( document.getElementById('blocker').style.display == 'none') scene.simulate( delta / 1000 ); // run physics
			
			//editor._activeControls.update( delta );
			
			updateLeapBoxVisibility();
			
			editor.play._playLoop( delta );
			
			render();
			
			editor.soundCollection._update( delta, now );

			viewport._lastSoundUpdate = Date.now();
			
			//console.log(editor.scene.children[0].rotation);
		}

	};


       
	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();
		
		if ( editor.scene.skybox ) editor.scene.skybox.alignWithCamera( editor._activeCamera );
		
		// update
		
		renderer.clear();
		(effect && container.play ? effect : renderer).render( scene, editor._activeCamera );

	    

		if ( !container.play && renderer instanceof THREE.RaytracingRenderer === false ) {

			renderer.render( sceneHelpers, editor._activeCamera );

		}

	}

	return container;

}
