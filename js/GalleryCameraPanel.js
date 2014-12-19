var GalleryCameraPanel = function( editor ){
    var signals = editor.signals;
    var cameraArray;
	
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;
	var renderer = editor._renderer;
	var camera = editor._cam;
	
	var galleryCamera = new THREE.PerspectiveCamera( 60, 1, 0.01, 500 );
	sceneHelpers.add( galleryCamera );
	
	
	

    var container = new UI.Panel().setDisplay('none');  



// --------------------------------------------------

	

    var imagePanel = new  UI.Panel().setId('imagePanel'); 

	
	var textureRTT  = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { format: THREE.RGBFormat });
	

	
	//var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 20 ), new THREE.MeshBasicMaterial( { map: textureRTT } ) );
	//plane.position.set(0,5,-10);
	//scene.add(plane);
	//sceneRTT.add( orthoCam );
	
	var renderToTexture = function(){
		
		if ( editor.scene.skybox ) editor.scene.skybox.alignWithCamera( galleryCamera );
		
		renderer.clear();
				
		galleryCamera.aspect = camera.aspect;
		galleryCamera.updateProjectionMatrix();
		scene.updateMatrixWorld();
		sceneHelpers.updateMatrixWorld()
		renderer.clear();
		
		renderer.render( scene, galleryCamera, textureRTT, true );
		renderer.render( scene, camera );
		renderer.render( sceneHelpers, camera );

		var width  = textureRTT.width;
		var height = textureRTT.height;
		
		var size = 4 * width * height;
		
		var pixelBuffer = new Uint8Array( size );
		
		//extract image from buffer
		var gl = renderer.context;
		var framebuffer = textureRTT.__webglFramebuffer;
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);        
		gl.viewport(0, 0, width, height);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		//draw image on canvas
		var canvas = $( document.createElement('canvas') ).attr('width',width).attr('height',height);		
		var ctx = canvas[0].getContext('2d');			
		var imgData = ctx.getImageData(0, 0, width, height);		
		for (var i = 0; i < size ; i += 4) {
			imgData.data[i+0] = pixelBuffer[size-(i)];
			imgData.data[i+1] = pixelBuffer[size-(i-1)];
			imgData.data[i+2] = pixelBuffer[size-(i-2)];
			imgData.data[i+3] = pixelBuffer[size-(i-3)];
		}		
		ctx.putImageData(imgData, 0, 0);
		
		var iconDelete = $( document.createElement('span') ).addClass('galleryDeleteIcon');	
		iconDelete.attr('title','Remove Photo');
		var scrollContainer = $('#imageList').children().first();			
		var imageItem = $( document.createElement('div') ).addClass('imageContainer');		
		scrollContainer.append( imageItem );

		var img = canvas[0];
		
		imageItem.click( function(e){		
			 window.open (img.toDataURL('image/png'),"","menubar=0,resizable=1");
		});
		
		
		var a = $( document.createElement('a') );	
		a.append( img );
		a.append( iconDelete );
		imageItem.append( a );	
		
		//var currentWidth = parseInt( scrollContainer.css('width') ,10 );
		//scrollContainer.css('width', (currentWidth + 320)+'px');
		var currentHeight = parseInt( scrollContainer.css('height') ,10 );
		scrollContainer.css('height', (currentHeight + 140)+'px');
		
		iconDelete.click( function(){
			imageItem.remove();
			//scrollContainer.removeChild( imageItem );
			var currentHeight = parseInt( scrollContainer.css('height') ,10 );
			scrollContainer.css('height', (currentHeight - 140)+'px');
				
		});		
			
	};
	
	var takeScreenshot = new UI.Button( 'Take Photo' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {
		var cam      = editor.config.getKey('camera');
		var position = cam.position;
		var lookAt   = cam.target;
		
		galleryCamera.position.fromArray(position);		
		galleryCamera.lookAt( new THREE.Vector3().fromArray(lookAt) );
		
		renderToTexture();		
	});    
	
	takeScreenshot.dom.title = 'Renders a Photo of the current View';

    var takeArrayScreenshot = new UI.Button( 'Take Photo from Array' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {
		cameraArray = [];
		
		var panels = document.getElementById('cameraArrayList').firstChild.getElementsByTagName("div");
		var position = [];
		var lookAt   = [];
		for( var i = 0; i < panels.length; i++){
			
			cameraArray[ i ] = [];
			var numbers = panels[i].getElementsByTagName("input");
			//console.log( numbers[0].value );
			position = [ numbers[0].value, numbers[1].value, numbers[2].value ];
			lookAt   = [ numbers[3].value, numbers[4].value, numbers[5].value ];
			galleryCamera.position.fromArray(position);		
			galleryCamera.lookAt( new THREE.Vector3().fromArray(lookAt) );
			renderToTexture();	
		}
    });
	
	takeArrayScreenshot.dom.title = 'Renders a Photo of every Camera in the Array';

    imagePanel.add(takeScreenshot, takeArrayScreenshot, new UI.Break());

    var imageList = new UI.Panel().setId('imageList');
    imagePanel.add( imageList );

    var imageScrollContainer = new UI.Panel().setHeight('0px');
    imageList.add( imageScrollContainer );

    container.add( imagePanel );

 
    

// --------------------------------------------------

// --------------------------------------------------

    function updateMainCamera(){
		editor.signals.cameraChanged.dispatch( editor._cam );
		editor._activeControls.update();
    }

    var cameraPanel = new  UI.Panel().setId('cameraPanel');    
    var addCamera  = new UI.Button( 'Add Camera' ).setMarginTop('5px').setMarginLeft( '10px' );
	addCamera.dom.title = 'Adds a new Camera to the Array';
    
    addCamera.onClick( function () {
	
		var setCamera = function ( camera ) {
			var x = cameraPositionX.getValue();
			var y = cameraPositionY.getValue();
			var z = cameraPositionZ.getValue();
			camera.position.fromArray([ x, y, z]);
			
			var lookAtX = cameraRotationX.getValue();
			var lookAtY = cameraRotationY.getValue();
			var lookAtZ = cameraRotationZ.getValue();
			camera.lookAt( new THREE.Vector3().fromArray([ lookAtX, lookAtY, lookAtZ]) );
			
		};
		
		var setAllCameras = function(){
			setCamera( editor._cam );
			updateMainCamera();
			setCamera( galleryCamera );
		};	

		//update main camra to be sure that the configs are up to date
		updateMainCamera();
		var cam      = editor.config.getKey('camera');
		var position = cam.position;
		var lookAt   = cam.target;

		var cameraListItem = new UI.Panel().setMarginLeft('5px');

		cameraListItem.add(new UI.Break());

		var showCam = new UI.Button().setMarginLeft( '10px' ).setClass('buttonShow').onClick( setAllCameras );
		showCam.dom.title = 'Switch to Camera';
		var remCam  = new UI.Button().setMarginLeft( '10px' ).setClass('buttonRemove').onClick( function(){ 
			cameraScrollContainer.remove( cameraListItem ); 
			var scrollContainer = document.getElementById('cameraArrayList').firstChild;
			var currentWidth = parseInt( scrollContainer.style.width ,10 );				
			//rescale scrollContainer
			scrollContainer.style.width = (currentWidth - 285)+'px';
		});	

		remCam.dom.title = 'Remove Camera from Array';
		
		cameraListItem.add(showCam, remCam, new UI.Break());
		
		//$('.buttonShow').attr('title', 'Switch to Camera');

		var cameraPositionX = new UI.Number().setValue( position[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setAllCameras );
		var cameraPositionY = new UI.Number().setValue( position[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setAllCameras );
		var cameraPositionZ = new UI.Number().setValue( position[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setAllCameras );
		var cameraPositionXLabel = new UI.Text( 'X' ).setWidth( '10px' ).setColor( 'red' );
		var cameraPositionYLabel = new UI.Text( 'Y' ).setWidth( '10px' ).setColor( 'green' );
		var cameraPositionZLabel = new UI.Text( 'Z' ).setWidth( '10px' ).setColor( 'blue' );
		
		cameraListItem.add( new UI.Text( 'Position' ).setWidth( '80px' ) );
		cameraListItem.add( cameraPositionXLabel, cameraPositionX,
				   cameraPositionYLabel, cameraPositionY,
				   cameraPositionZLabel, cameraPositionZ, new UI.Break() );	


		var cameraRotationX = new UI.Number().setValue( lookAt[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setAllCameras );
		var cameraRotationY = new UI.Number().setValue( lookAt[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setAllCameras );
		var cameraRotationZ = new UI.Number().setValue( lookAt[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setAllCameras );
		var cameraRotationXLabel = new UI.Text( 'X' ).setWidth( '10px' ).setColor( 'red' );
		var cameraRotationYLabel = new UI.Text( 'Y' ).setWidth( '10px' ).setColor( 'green' );
		var cameraRotationZLabel = new UI.Text( 'Z' ).setWidth( '10px' ).setColor( 'blue' );
		
		cameraListItem.add( new UI.Text( 'Look At' ).setWidth( '80px' ) );
		cameraListItem.add( cameraRotationXLabel, cameraRotationX,
					   cameraRotationYLabel, cameraRotationY,
					   cameraRotationZLabel, cameraRotationZ );
		
		cameraScrollContainer.add( cameraListItem );
		
		var scrollContainer = document.getElementById('cameraArrayList').firstChild;
		var currentHeight = parseInt( scrollContainer.style.height ,10 );
		
		//rescale scrollContainer
		scrollContainer.style.height = (currentHeight + 300)+'px';
		
    } );

    cameraPanel.add( addCamera  );

    var distCamera = new UI.Button( 'Rearrange Cameras' ).setMarginTop('5px').setMarginLeft( '7px' );
	distCamera.dom.title = 'All Cameras in the Array get rearranged';
	distCamera.onClick( function(){
		var lookAt = [0,0,0];
		var sceneObjects = editor.scene.children;
		
		var validObjects = 0;
		
		for( var i = 0; i < sceneObjects.length; i++ ){
			var sceneObject = sceneObjects[i];
			if( editor.getObjectType(sceneObject) == 'Mesh' && sceneObject.name != "Ground" && sceneObject.name != "Skybox"  ){
					validObjects++;
					//console.log(sceneObject);
					
					lookAt[0]+=sceneObject.position.x;
					lookAt[1]+=sceneObject.position.y;
					lookAt[2]+=sceneObject.position.z;
			}
		}
		
		if(validObjects > 1){
			lookAt[0] /= validObjects;
			lookAt[1] /= validObjects;
			lookAt[2] /= validObjects;
		}
		
		
		//console.log(lookAt);
		
		$('#cameraArrayList > .Panel > .Panel ').each( function(){
			
		
			$(this).find('input:eq(0)').val( ( ( 4 + Math.random() * 6  ) * ((Math.floor(Math.random()*2) == 1)?-1:1) ) );
			$(this).find('input:eq(1)').val( (   2 + Math.random() * 10 ) );
			$(this).find('input:eq(2)').val( ( ( 4 + Math.random() * 6  ) * ((Math.floor(Math.random()*2) == 1)?-1:1) ) );
			
			$(this).find('input:eq(3)').val( lookAt[0] );
			$(this).find('input:eq(4)').val( lookAt[1] );
			$(this).find('input:eq(5)').val( lookAt[2] );
		});
		
		
	} );
    cameraPanel.add( distCamera );

    cameraPanel.add( new UI.Break() );

    var cameraList = new UI.Panel().setId('cameraArrayList');
    cameraPanel.add(cameraList);

    var cameraScrollContainer = new UI.Panel().setWidth('0px');
    cameraList.add( cameraScrollContainer );
  

    container.add( cameraPanel );


    return container;

}


