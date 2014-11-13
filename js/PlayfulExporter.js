/**
 * @author rbolzern
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PlayfulExporter = function () {};

THREE.PlayfulExporter.prototype = {

	constructor: THREE.PlayfulExporter,

	parse: function ( object ) {

		var output = {
			metadata: {
				version: 4.3,
				type: 'Object',
				generator: 'PlayfulExporter'
			}
		};
		
		var sounds = [], textures = [];
		this.sounds = sounds;
		this.textures = textures;
		
		
		// clones the object and substitutes the sounds with the sound name
		var traverseForSoundAndClone = function ( object, clone ) {
			
			for (var k in object) {
				if (object.hasOwnProperty( k )) {
					
					if ( k == 'sound' && object[ k ] != undefined ) {
					
						sounds.push(object[ k ]);
						clone[ k ] = object[ k ].name;
					
					} else if ( typeof object[ k ] == 'object' ) {
						clone[ k ] = {};
						traverseForSoundAndClone( object[ k ], clone[ k ] );
					} else {
						clone[ k ] = object[ k ]
					}
					
				}
			}
			
		};

		//

		var geometries = {};
		var geometryExporter = new THREE.GeometryExporter();
		var bufferGeometryExporter = new THREE.BufferGeometryExporter();

		var parseGeometry = function ( geometry ) {

			if ( output.geometries === undefined ) {

				output.geometries = [];

			}

			if ( geometries[ geometry.uuid ] === undefined ) {

				var data = {};

				data.uuid = geometry.uuid;

				if ( geometry.name !== "" ) data.name = geometry.name;

				var handleParameters = function ( parameters ) {

					for ( var i = 0; i < parameters.length; i ++ ) {

						var parameter = parameters[ i ];

						if ( geometry.parameters[ parameter ] !== undefined ) {

							data[ parameter ] = geometry.parameters[ parameter ];

						}

					}

				};

				if ( geometry instanceof THREE.PlaneGeometry ) {

					data.type = 'PlaneGeometry';
					handleParameters( [ 'width', 'height', 'widthSegments', 'heightSegments' ] );

				} else if ( geometry instanceof THREE.BoxGeometry ) {

					data.type = 'BoxGeometry';
					handleParameters( [ 'width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments' ] );

				} else if ( geometry instanceof THREE.CircleGeometry ) {

					data.type = 'CircleGeometry';
					handleParameters( [ 'radius', 'segments' ] );

				} else if ( geometry instanceof THREE.CylinderGeometry ) {

					data.type = 'CylinderGeometry';
					handleParameters( [ 'radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded' ] );

				} else if ( geometry instanceof THREE.SphereGeometry ) {

					data.type = 'SphereGeometry';
					handleParameters( [ 'radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength' ] );

				} else if ( geometry instanceof THREE.IcosahedronGeometry ) {

					data.type = 'IcosahedronGeometry';
					handleParameters( [ 'radius', 'detail' ] );

				} else if ( geometry instanceof THREE.TorusGeometry ) {

					data.type = 'TorusGeometry';
					handleParameters( [ 'radius', 'tube', 'radialSegments', 'tubularSegments', 'arc' ] );

				} else if ( geometry instanceof THREE.TorusKnotGeometry ) {

					data.type = 'TorusKnotGeometry';
					handleParameters( [ 'radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q', 'heightScale' ] );

				} else if ( geometry instanceof THREE.BufferGeometry ) {

					data.type = 'BufferGeometry';
					data.data = bufferGeometryExporter.parse( geometry );

					delete data.data.metadata;

				} else if ( geometry instanceof THREE.Geometry ) {

					data.type = 'Geometry';
					data.data = geometryExporter.parse( geometry );

					delete data.data.metadata;

				}

				geometries[ geometry.uuid ] = data;

				output.geometries.push( data );

			}

			return geometry.uuid;

		};

		//

		var materials = {};
		var materialExporter = new THREE.MaterialExporter();

		var parseMaterial = function ( material ) {

			if ( output.materials === undefined ) {

				output.materials = [];

			}

			if ( materials[ material.uuid ] === undefined ) {

				var data = materialExporter.parse( material );

				delete data.metadata;
				
				// CUSTOM
				
				data.edges = material.edges;
				
				data.runtimeMaterials = material.runtimeMaterials;
				
				// add textures to data
				if ( material.map !== undefined && material.map !== null ) {
					
					textures.push( material.map );
					data.map = material.map.sourceFile;
				
				}
				
				if (material._physijs) {
					var physics = material._physijs;
					data.friction = physics.friction;
					data.restitution = physics.restitution;
				}
				// END CUSTOM

				materials[ material.uuid ] = data;

				output.materials.push( data );

			}

			return material.uuid;

		};

		//

		var parseObject = function ( object ) {

			var data = {};

			data.uuid = object.uuid;

			if ( object.name !== '' ) data.name = object.name;
			if ( JSON.stringify( object.userData ) !== '{}' ) data.userData = object.userData;
			if ( object.visible !== true ) data.visible = object.visible;

			if ( object instanceof THREE.Scene ) {

				data.type = 'Scene';
				
				if ( object.hasLeapBox === false ) {
					
					data.hasLeapBox = object.hasLeapBox;
					
				}
				
				if ( object.fog != undefined ) {
					data.fog = {
						type: object.fog instanceof THREE.Fog ? 'Fog' : 'FogExp2',
						near: object.fog.near,
						far: object.fog.far,
						color: object.fog.color.getHex(),
						density: object.fog.density
					}
				}
				
				if ( object.skybox ) {
					
					data.skybox = {
						type: object.skybox.type
					}
					
					if ( object.skybox.type == 'Custom' ) {
					
						// add the images
						data.skybox.textures = [];
						for ( var i = 0; i < 6; i++ ) {
						
							if ( object.skybox.materials[ i ].map.sourceFile != undefined && object.skybox.materials[ i ].map.sourceFile.indexOf('skybox_RT') == -1 )
								object.skybox.materials[ i ].map.sourceFile = 'skybox_' + Skybox.prototype.endings[ i ] + '_' + object.skybox.materials[ i ].map.sourceFile;
							
							if ( object.skybox.materials[ i ].map.sourceBlob) textures.push( object.skybox.materials[ i ].map );
							data.skybox.textures.push( object.skybox.materials[ i ].map.sourceFile );
							
						}
						
					}
					
				}

			} else if ( object instanceof THREE.PerspectiveCamera ) {

				data.type = 'PerspectiveCamera';
				data.fov = object.fov;
				data.aspect = object.aspect;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.OrthographicCamera ) {

				data.type = 'OrthographicCamera';
				data.left = object.left;
				data.right = object.right;
				data.top = object.top;
				data.bottom = object.bottom;
				data.near = object.near;
				data.far = object.far;

			} else if ( object instanceof THREE.AmbientLight ) {

				data.type = 'AmbientLight';
				data.color = object.color.getHex();

			} else if ( object instanceof THREE.DirectionalLight ) {

				data.type = 'DirectionalLight';
				data.color = object.color.getHex();
				data.intensity = object.intensity;

			} else if ( object instanceof THREE.PointLight ) {

				data.type = 'PointLight';
				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;

			} else if ( object instanceof THREE.SpotLight ) {

				data.type = 'SpotLight';
				data.color = object.color.getHex();
				data.intensity = object.intensity;
				data.distance = object.distance;
				data.angle = object.angle;
				data.exponent = object.exponent;

			} else if ( object instanceof THREE.HemisphereLight ) {

				data.type = 'HemisphereLight';
				data.color = object.color.getHex();
				data.groundColor = object.groundColor.getHex();

			} else if ( object instanceof THREE.Mesh ) {

				data.type = 'Mesh';
				data.geometry = parseGeometry( object.geometry );
				data.material = parseMaterial( object.material );
				
				data.isStatic = object.isStatic;
				
				// CUSTOM
				if ( object._physijs ) {
					if (object instanceof Physijs.PlaneMesh) {
						data.physiMeshType = 'PlaneMesh';
					}
					else if (object instanceof Physijs.BoxMesh) {
						data.physiMeshType = 'BoxMesh';
					}
					else if (object instanceof Physijs.CylinderMesh) {
						data.physiMeshType = 'CylinderMesh';
					}
					else if (object instanceof Physijs.SphereMesh) {
						data.physiMeshType = 'SphereMesh';
					}
				}
				
				if ( object.events != undefined ) {
				
					data.events = [];
					
					traverseForSoundAndClone( object.events, data.events );
				
				}
				
				if ( object.behaviors != undefined ) {
				
					data.behaviors = object.behaviors;
				
				}
				// END CUSTOM

			} else if ( object instanceof THREE.Sprite ) {

				data.type = 'Sprite';
				data.material = parseMaterial( object.material );

			} else {

				data.type = 'Object3D';

			}

			data.matrix = object.matrix.toArray();

			if ( object.children.length > 0 ) {

				data.children = [];

				for ( var i = 0; i < object.children.length; i ++ ) {

					if ( editor.omittedObjects.indexOf( object.children[ i ].name ) != -1 ) continue;
				
					data.children.push( parseObject( object.children[ i ] ) );

				}

			}

			return data;

		}

		output.object = parseObject( object );
		
		return output;

	},
	
	getSounds: function() {
		return this.sounds;
	},
	
	getTextures: function() {
		return this.textures;
	}

}
