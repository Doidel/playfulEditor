Sidebars.Add.Helper = function ( )
{
	var meshCount = 0;
	var lightCount = 0;
	
	var defaultMaterial = function()
	{
		return new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }  );
	}
	var defaultOptions = function( mesh )
	{
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.isStatic = true; 
	}
	
	this.Cube = function ( editor ) {
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
		
		defaultOptions( mesh );
	
		editor.addObject( mesh );
		editor.select( mesh );
	}
	
	this.Sphere = function ( editor ) {
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
		
		defaultOptions( mesh );
	
		editor.addObject( mesh );
		editor.select( mesh );
	}
	
	this.Cylinder = function ( editor ) {
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
		
		defaultOptions( mesh );
	
		editor.addObject( mesh );
		editor.select( mesh );
	}
	
	this.Plane = function ( editor ) {
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
		
		defaultOptions( mesh );
	
		editor.addObject( mesh );
		editor.select( mesh );
	}
};

