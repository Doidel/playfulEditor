Menubar.Add = function ( editor ) {

	var meshCount = 0;
	var lightCount = 0;
	
	function defaultMaterial () {
		return new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  );
	}

	// event handlers

	function onObject3DOptionClick () {

		var mesh = new THREE.Object3D();
		mesh.name = 'Object3D ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onPlaneOptionClick () {

		/*var width = 200;
		var height = 200;

		var widthSegments = 1;
		var heightSegments = 1;

		var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
		geometry.computeFaceNormals();
		var material = Physijs.createMaterial(
			defaultMaterial(),
			0.5,
			0.5
		);
		var mesh = new Physijs.PlaneMesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );*/
		
		var width = 10;
		var height = 0.1;
		var depth = 10;

		var widthSegments = 1;
		var heightSegments = 1;
		var depthSegments = 1;

		var geometry = new THREE.BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
		var material = Physijs.createMaterial(
			defaultMaterial(),
			0.5,
			0.5
		);
		var mesh = new Physijs.BoxMesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );
		
		mesh.isStatic = true;

		editor.addObject( mesh );
		editor.select( mesh );

	};

	function onBoxOptionClick () {

		var width = 1;
		var height = 1;
		var depth = 1;

		var widthSegments = 1;
		var heightSegments = 1;
		var depthSegments = 1;

		var geometry = new THREE.BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
		var material = Physijs.createMaterial(
			defaultMaterial(),
			0.5,
			0.5
		);
		var mesh = new Physijs.BoxMesh( geometry, material );
		mesh.name = 'Box ' + ( ++ meshCount );
		
		mesh.isStatic = true;

		editor.addObject( mesh );
		editor.select( mesh );

	}
	
	function onCircleOptionClick () {

		var radius = 0.5;
		var segments = 8;

		var geometry = new THREE.CircleGeometry( radius, segments );
		var mesh = new THREE.Mesh( geometry, defaultMaterial() );
		mesh.name = 'Circle ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onCylinderOptionClick () {

		var radiusTop = 0.5;
		var radiusBottom = 0.5;
		var height = 1;
		var radiusSegments = 8;
		var heightSegments = 1;
		var openEnded = false;

		var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var material = Physijs.createMaterial(
			defaultMaterial(),
			0.5,
			0.5
		);
		var mesh = new Physijs.CylinderMesh( geometry, material );
		mesh.name = 'Cylinder ' + ( ++ meshCount );
		
		mesh.isStatic = true;

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onSphereOptionClick () {

		var radius = 0.5;
		var widthSegments = 32;
		var heightSegments = 16;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
		//geometry.dynamic = true;
		var material = Physijs.createMaterial(
			defaultMaterial(),
			0.5,
			0.5
		);
		var mesh = new Physijs.SphereMesh( geometry, material );
		
		// Enable CCD if the object moves more than 1 meter in one simulation frame
		mesh.setCcdMotionThreshold(1);

		// Set the radius of the embedded sphere such that it is smaller than the object
		mesh.setCcdSweptSphereRadius(0.2);
		
		mesh.name = 'Sphere ' + ( ++ meshCount );
		//mesh.dynamic = true;
		
		mesh.isStatic = true;

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onIcosahedronOptionClick () {

		var radius = 0.5;
		var detail = 2;

		var geometry = new THREE.IcosahedronGeometry ( radius, detail );
		var mesh = new THREE.Mesh( geometry, defaultMaterial() );
		mesh.name = 'Icosahedron ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onTorusOptionClick () {

		var radius = 100;
		var tube = 40;
		var radialSegments = 8;
		var tubularSegments = 6;
		var arc = Math.PI * 2;

		var geometry = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
		var mesh = new THREE.Mesh( geometry, defaultMaterial() );
		mesh.name = 'Torus ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	}

 	function onTorusKnotOptionClick () {

		var radius = 100;
		var tube = 40;
		var radialSegments = 64;
		var tubularSegments = 8;
		var p = 2;
		var q = 3;
		var heightScale = 1;

		var geometry = new THREE.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q, heightScale );
		var mesh = new THREE.Mesh( geometry, defaultMaterial() );
		mesh.name = 'TorusKnot ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	}

	function onSpriteOptionClick () {

		var sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
		sprite.name = 'Sprite ' + ( ++ meshCount );

		editor.addObject( sprite );
		editor.select( sprite );

	}

	function onPointLightOptionClick () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );

	}

	function onSpotLightOptionClick () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var exponent = 10;

		var light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
		light.name = 'SpotLight ' + ( ++ lightCount );
		light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		light.position.set( 0, 1, 0 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );

	}

	function onDirectionalLightOptionClick () {

		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 1, 1, 1 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );

	}

	function onHemisphereLightOptionClick () {

		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 1, 1, 1 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );

	}

	function onAmbientLightOptionClick() {

		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );

	}

	// configure menu contents

	var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		//createOption( 'Object3D', onObject3DOptionClick ),
		//createDivider(),

		createOption( 'Plane', onPlaneOptionClick ),
		createOption( 'Box', onBoxOptionClick ),
		//createOption( 'Circle', onCircleOptionClick ),
		createOption( 'Cylinder', onCylinderOptionClick ),
		createOption( 'Sphere', onSphereOptionClick  ),
		//createOption( 'Icosahedron', onIcosahedronOptionClick ),
		//createOption( 'Torus', onTorusOptionClick ),
		//createOption( 'Torus Knot', onTorusKnotOptionClick ),
		createDivider(),

		//createOption( 'Sprite', onSpriteOptionClick  ),
		//createDivider(),

		createOption( 'Point light', onPointLightOptionClick ),
		createOption( 'Spot light', onSpotLightOptionClick ),
		createOption( 'Directional light', onDirectionalLightOptionClick ),
		//createOption( 'Hemisphere light', onHemisphereLightOptionClick ),
		createOption( 'Ambient light', onAmbientLightOptionClick )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'Add', optionsPanel );

}
