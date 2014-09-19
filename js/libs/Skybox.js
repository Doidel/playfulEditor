var Skybox = function( ) {

	this.type = '';

	this.materials = [
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } ), // right
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } ), // left
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } ), // up
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } ), // down
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } ), // back
		new THREE.MeshBasicMaterial( { map: new THREE.Texture(), overdraw: true } )  // front
	];

	this.mesh = new THREE.Mesh( new THREE.BoxGeometry( 500, 500, 500, 7, 7, 7 ), new THREE.MeshFaceMaterial( this.materials ) );
	this.mesh.scale.x = - 1;
	this.mesh.name = 'Skybox';
};

Skybox.prototype.endings = ['RT', 'LF', 'UP', 'DN', 'BK', 'FR'];

Skybox.prototype.setPath = function ( path ) {

	this.type = path;

	path = 'skyboxes/' + (path || 'cloud') + '/';

	for ( var i = 0; i < 6; i++ ) {
	
		// delete existing texture
		if ( this.materials[ i ].map != undefined ) {
			this.materials[ i ].map.dispose();
		}
		
		this.materials[ i ].map = THREE.ImageUtils.loadTexture( path + this.endings[ i ] + '.jpg', THREE.UVMapping, function() {

			editor.signals.sceneGraphChanged.dispatch();
		
		} );
	}
	
	this.mesh.material.needsUpdate = true;
	
};

Skybox.prototype.setTextures = function ( textures ) {

	this.type = 'custom';

	if ( textures !== undefined ) {
	
		for ( var i = 0; i < 6; i++ ) {
			
			if ( !textures[ i ] || !textures[ i ].sourceFile ) continue;
		
			// delete existing texture
			if ( this.materials[ i ].map != undefined && this.materials[ i ].map.sourceFile != textures[ i ].sourceFile ) {
				this.materials[ i ].map.dispose();
			}
			
			this.materials[ i ].map = textures[ i ];
			
			editor.signals.sceneGraphChanged.dispatch();
		}
		
		this.mesh.material.needsUpdate = true;
	
	}

};

Skybox.prototype.alignWithCamera = function ( camera ) {

	this.mesh.position.copy( camera.position );

};

Skybox.prototype.dispose = function () {
	
	// delete existing textures
	for ( var i = 0; i < 6; i++ ) {
	
		if ( this.materials[ i ].map != undefined ) {
			this.materials[ i ].map.dispose();
		}
		
		this.materials[ i ].dispose();
		
	}
	
	this.mesh.geometry.dispose();
	this.mesh.material = undefined;
	
	this.mesh.parent.remove( this.mesh );
	this.mesh.dispose();
	
};