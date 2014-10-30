var Editor = function () {

	var SIGNALS = signals;

	this.signals = {

		// actions

		playAnimations: new SIGNALS.Signal(),
		play: new SIGNALS.Signal(), //plays physics + sounds
		stop: new SIGNALS.Signal(),

		// notifications

		themeChanged: new SIGNALS.Signal(),

		transformModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
		spaceChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		cameraChanged: new SIGNALS.Signal(),

		objectSelected: new SIGNALS.Signal(),
		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),
		
		soundAdded: new SIGNALS.Signal(),

		materialChanged: new SIGNALS.Signal(),
		defaultColorTypeChanged: new SIGNALS.Signal(),
		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		skyboxChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal(),
		
		menuButtonClicked: new SIGNALS.Signal()

	};
	
	this.config = new Config();
	this.storage = new Storage();
	this.loader = new Loader( this );

	// The report size was increased in order to allow more than the default 50 touches/collisions.
	// This also increases other report cache's buffers, so in case of performance issues try to
	// lower the reportsize or try to use different buffer sizes for different caches ( see
	// physijs_worker.js:252 )
	this.scene = new Physijs.Scene( {fixedTimeStep: 1/120} );
	this.scene._gravity = new THREE.Vector3(0, -16, 0);
	this.scene.setGravity( this.scene._gravity );
	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};

	this.selected = null;
	this.helpers = {};
	
	this.soundCollection;
	
	this.theme = new Editor.Theme( this );
	this.play = new Play( this );
	
	this.omittedObjects = [ "Skybox", "Helper" ]; // objects which don't appear in the scenegraph

};

Editor.prototype = {

	// set the editor's theme
	setTheme: function ( value ) {

		//document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},

	setScene: function ( scene ) {

		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );
		this.scene.fog = scene.fog;

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			var child = scene.children[ 0 ];
			
			if ( child.name.length == 0 ) {
			
				scene.remove( child );
				continue;
			
			} else if ( child.name.indexOf( 'default' ) != -1 || child.name === 'Ground' ) { //remove default objects
				
				var obj = this.scene.getObjectByName( child.name );
				if (obj) this.scene.remove( obj );
				
			}
			
			this.addObject( child );

		}
		

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );
			
			if ( object._physijs ) editor.theme.currentTheme.decorate( object );

		} );
		
		if ( object._physijs ) editor.theme.currentTheme.decorate( object );
		
		/*if ( object.geometry != undefined ) {
			object.castShadow = true;
			object.receiveShadow = true;
		} else if ( object instanceof THREE.DirectionalLight || object instanceof THREE.SpotLight || object instanceof THREE.PointLight ) {
			object.castShadow = true;
		}*/

		this.scene.add( object );

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	setObjectName: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === undefined ) return; // avoid deleting the camera or scene

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	setEdge: function ( object, colorsAmount ) {
		
		colorsAmount = colorsAmount >= 1 ? colorsAmount : 1;
	
		var colorsArr;
		//var colors = [57, 181, 74, 229, 114, 69, 83, 101, 211];
		var colors = [57 / 256, 181 / 256, 74 / 256, 229 / 256, 114 / 256, 69 / 256, 83 / 256, 101 / 256, 211 / 256];
		//var colors = [0,0,1,0,1,0,0.99,0.1,0.1];
		
		if ( !object._egh ) {
		
			var egh = new THREE.EdgesHelper( object, 0xffffff );
			egh.name = 'Helper';
			egh.geometry.computeBoundingSphere();
			
			//remove doubles

			/*var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
			var unique = [];

			var key;
			var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
			var precision = Math.pow( 10, precisionPoints );
			var i,il;
			var vertices = egh.geometry.attributes.position.array;

			for ( i = 0, il = vertices.length; i < il; i += 3 ) {

				key = Math.round( vertices[ i ] * precision ) + '_' + Math.round( vertices[ i + 1 ] * precision ) + '_' + Math.round( vertices[ i + 2 ] * precision );

				if ( verticesMap[ key ] === undefined ) {

					verticesMap[ key ] = i;
					unique.push( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] );

				}

			};

			// Use unique set of vertices

			egh.geometry.attributes.position.array = new Float32Array( unique );
			egh.geometry.attributes.position.needsUpdate = true;*/
			
			object.add( egh );
			object._egh = egh;
		}
		
		if ( !object._egh.geometry.attributes.color ) {
			
			object._egh.geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( object._egh.geometry.attributes.position.array.length ), 3 ) );
			
		}
		
		colorsArr = object._egh.geometry.attributes.color.array;
		
		// assign colors
		for (var x = 0, l = colorsArr.length; x < l; x += 3) {
			var col = Math.floor( (x / 6) % colorsAmount ) * 3;
			colorsArr[ x ] = colors[ col ];
			colorsArr[ x + 1 ] = colors[ col + 1 ];
			colorsArr[ x + 2 ] = colors[ col + 2 ];
			//console.log(colors[ col ], colors[ col + 1 ], colors[ col + 2 ]);
		}
		
		object._egh.geometry.attributes.color.needsUpdate = true;
		object._egh.material.vertexColors = THREE.VertexColors;
		object._egh.material.needsUpdate = true;
	
	},
	//

	addHelper: function () {

		var geometry = new THREE.SphereGeometry( 0.2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 0.1 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 0.1 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 0.2 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 0.1 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 0.1 );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			picker.visible = false;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	parent: function ( object, parent ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}
		
		//reposition object
		object.position.applyMatrix4( object.parent.matrixWorld );
		object.position.applyMatrix4( new THREE.Matrix4().getInverse( parent.matrixWorld ) );

		parent.add( object );

		this.signals.objectChanged.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	select: function ( object ) {

		this.selected = object;

		if ( object !== null ) {

			this.config.setKey( 'selected', object.uuid );

		} else {

			this.config.setKey( 'selected', null );

		}

		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.id === id ) {

				scope.select( child );

			}

		} );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},

	// utils

	getObjectType: function ( object ) {

		var types = {

			'Scene': THREE.Scene,
			'PerspectiveCamera': THREE.PerspectiveCamera,
			'AmbientLight': THREE.AmbientLight,
			'DirectionalLight': THREE.DirectionalLight,
			'HemisphereLight': THREE.HemisphereLight,
			'PointLight': THREE.PointLight,
			'SpotLight': THREE.SpotLight,
			'Mesh': THREE.Mesh,
			'Sprite': THREE.Sprite,
			'Object3D': THREE.Object3D

		};

		for ( var type in types ) {

			if ( object instanceof types[ type ] ) return type;

		}

	},

	getGeometryType: function ( geometry ) {

		var types = {

			'BoxGeometry': THREE.BoxGeometry,
			'CircleGeometry': THREE.CircleGeometry,
			'CylinderGeometry': THREE.CylinderGeometry,
			'ExtrudeGeometry': THREE.ExtrudeGeometry,
			'IcosahedronGeometry': THREE.IcosahedronGeometry,
			'LatheGeometry': THREE.LatheGeometry,
			'OctahedronGeometry': THREE.OctahedronGeometry,
			'ParametricGeometry': THREE.ParametricGeometry,
			'PlaneGeometry': THREE.PlaneGeometry,
			'PolyhedronGeometry': THREE.PolyhedronGeometry,
			'ShapeGeometry': THREE.ShapeGeometry,
			'SphereGeometry': THREE.SphereGeometry,
			'TetrahedronGeometry': THREE.TetrahedronGeometry,
			'TextGeometry': THREE.TextGeometry,
			'TorusGeometry': THREE.TorusGeometry,
			'TorusKnotGeometry': THREE.TorusKnotGeometry,
			'TubeGeometry': THREE.TubeGeometry,
			'Geometry': THREE.Geometry,
			'BufferGeometry': THREE.BufferGeometry

		};

		for ( var type in types ) {

			if ( geometry instanceof types[ type ] ) return type;

		}

	},

	getMaterialType: function ( material ) {

		var types = {

			'LineBasicMaterial': THREE.LineBasicMaterial,
			'LineDashedMaterial': THREE.LineDashedMaterial,
			'MeshBasicMaterial': THREE.MeshBasicMaterial,
			'MeshDepthMaterial': THREE.MeshDepthMaterial,
			'MeshFaceMaterial': THREE.MeshFaceMaterial,
			'MeshLambertMaterial': THREE.MeshLambertMaterial,
			'MeshNormalMaterial': THREE.MeshNormalMaterial,
			'MeshPhongMaterial': THREE.MeshPhongMaterial,
			'ParticleSystemMaterial': THREE.ParticleSystemMaterial,
			'ShaderMaterial': THREE.ShaderMaterial,
			'SpriteCanvasMaterial': THREE.SpriteCanvasMaterial,
			'SpriteMaterial': THREE.SpriteMaterial,
			'Material': THREE.Material

		};

		for ( var type in types ) {

			if ( material instanceof types[ type ] ) return type;

		}

	},
	
	// Start the physics simulation. Clone all objects and make them "physical". don't display the others.
	startPlay: function ( ) {
		
		this.sceneChildrenSaves = [];
		this.sceneChildrenClones = new THREE.Object3D();
		
		this.play._timeBasedActionsCollection = {};
		
		console.log('start play');
		// collision callback
		var collisionPlay = function ( other_object, relative_velocity, relative_rotation, contact_normal ) {
		
			if ( other_object.name == 'PlayerCharacter' ) return;
		
			// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`			
			//console.log('speed', relative_velocity.length(), new Date().getTime(), this.uuid, other_object.name, relative_velocity);
			
			if ( this.events != undefined ) {
			
				for ( var i = 0; i < this.events.length; i++ ) {
				
					// we want to execute the collision event
					if ( this.events[ i ].trigger.type == 'Collision') {
						
						editor.play.playAction( this, i, {
							//other_object: other_object,
							relative_velocity: relative_velocity,
							//relative_rotation: relative_rotation,
							//contact_normal: contact_normal
						});
						
					}
					
				}
			
			}
			
		};
		
		// leap touch callback
		var grab = function ( ) {
		
			//if ( this.name != 'Ground' ) editor.play.effects.glow( this );
			
			if ( this.events != undefined ) {
			
				for ( var i = 0; i < this.events.length; i++ ) {
				
					// we want to execute the event
					if ( this.events[ i ].trigger.type == 'Touch Fist') {
						
						editor.play.playAction( this, i );
						
					}
					
				}
			
			}
		
		};
		
		// leap touch callback
		var point = function ( ) {
			console.log('point event on object');
		
			//if ( this.name != 'Ground' ) editor.play.effects.glow( this );
			
			if ( this.events != undefined ) {
			
				for ( var i = 0; i < this.events.length; i++ ) {
				
					// we want to execute the event
					if ( this.events[ i ].trigger.type == 'Touch Point') {
						
						editor.play.playAction( this, i );
						
					}
					
				}
			
			}
		
		};
		
		// leap touch callback
		var stroke = function ( ) {
		
			//if ( this.name != 'Ground' ) editor.play.effects.glow( this );
			
			if ( this.events != undefined ) {
			
				for ( var i = 0; i < this.events.length; i++ ) {
				
					// we want to execute the event
					if ( this.events[ i ].trigger.type == 'Touch Stroke') {
						
						editor.play.playAction( this, i );
						
					}
					
				}
			
			}
		
		};
		
		var release = function ( )  {
			
			//editor.play.effects.removeGlow( this );
			
		}
		
		
		
		function hasTrigger( events, type ) {
			
			for ( var i = 0; i < events.length; i++ ) {
				if ( events[ i ].trigger.type == type ) return true;
			}
			
		}
		
		//clone array
		//var children = this.scene.children.slice(0);
		
		this.scene._cloneEquivalent = this.sceneChildrenClones;
		this.scene.traverse( function( child ) {
			
			//replace all physijs objects with clones
			if ( child._physijs ) {
				
				var clone = child.clone();
				
				if ( child.events != undefined ) {
					clone.events = child.events;
					clone._eventsLastFired = new Array( clone.events.length );
					//preload sounds
					editor.play.preloadSounds( clone.events );
				}
				
				// set the correct mass
				clone.isStatic = child.isStatic;
				clone._originalMass = clone.mass;
				if ( clone.isStatic == true ) clone.mass = 0;
				//clone.mass = clone.mass;
				//if ( clone.material._physijs.massmodifier != undefined ) clone.mass *= clone.material._physijs.massmodifier;
				
				// add collision event callbacks
				clone.addEventListener( 'collision', collisionPlay );
				
				// add constant / time based triggers
				if ( clone.material.runtimeMaterials !== undefined ) {
					for ( var j = 0; j < clone.material.runtimeMaterials.length; j++ ) {
						var type = clone.material.runtimeMaterials[ j ].trigger.type;
						switch ( type ) {
							case 'Time':
							case 'Amplitude':
								if (!this.play._timeBasedActionsCollection[ type ]) this.play._timeBasedActionsCollection[ type ] = [];
								this.play._timeBasedActionsCollection[ type ].push( [ clone.material.runtimeMaterials[ j ], clone ] );
							break;
						}
					}
				}
				
				// add touch callbacks where needed
				if ( clone.events ) {
					if ( hasTrigger( clone.events, 'Touch Fist' ) ) clone.grab = grab.bind( clone );
					if ( hasTrigger( clone.events, 'Touch Point' ) ) clone.point = point.bind( clone );
					if ( hasTrigger( clone.events, 'Touch Stroke' ) ) clone.stroke = stroke.bind( clone );
				}
				clone.release = release.bind( clone );
				
				//TODO: Does this destroy anything?
				clone.material = child.material.clone();
				
				child.parent._cloneEquivalent.add( clone );
				
				child._cloneEquivalent = clone;
				
				
				//this.sceneChildrenClones.push( clone );
				if ( child.parent instanceof THREE.Scene ) {
					//if ( this.sceneChildrenSaves.length == 0 ) console.log( clone.uuid, 'orig', child.uuid );
					this.sceneChildrenSaves.push( child );
				}
			}
		
		}.bind(this) );
		
		//remove scene children
		for ( var x = 0; x < this.sceneChildrenSaves.length; x++ ) {
			
			editor.scene.remove( this.sceneChildrenSaves[ x ] );
			
		}	
		
		//add the clones to the scene
		console.log('- before scene add -');
		var children = this.sceneChildrenClones.children.slice(0); //clone children array, as it is altered when objects get moved from the Object3D into the scene
		for (var x = 0; x < children.length; x++) {
		
			var child = children[ x ];
			
			//this.sceneChildrenClones.remove( child );
			
			this.scene.add( child );
			child.material.needsUpdate = true;
			
			if ( child.sounds ) {
			
				if ( child.sounds.constant ) {
					editor.soundCollection.playAttachedSound( child.sounds.constant, child );
				}
			
			}
		
		}

	//console.log('mass', editor.scene.children[5].mass);
	//console.log('massC', this.sceneChildrenClones.children[5].mass);
		
		editor.play.start();
	//console.log('mass', editor.scene.children[5].mass);
	},
	
	// Delete all physics objects and restore visibility of the others.
	resetPlay: function ( ) {
	
		console.log('reset play');
		
		editor.play.stop();
		
		if ( this.sceneChildrenClones ) {
			
			editor.soundCollection.stopAll();
			
			var children = editor.scene.children.slice(0);
			for (var x = 0; x < children.length; x++) {
				if ( children[ x ]._physijs ) {
					editor.scene.remove( children[ x ] );
				}
			}
			
			this.sceneChildrenClones = undefined;
			
		}
	
		if ( this.sceneChildrenSaves ) {
			
			for ( var x = 0; x < this.sceneChildrenSaves.length; x++) {
			
				this.scene.add( this.sceneChildrenSaves[ x ] );
				
			}
			
			this.sceneChildrenSaves = undefined;
		}
	},

}
