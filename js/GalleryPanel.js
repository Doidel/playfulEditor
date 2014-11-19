var GalleryPanel = function( editor ){
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

    function updateMainCamera(){
		editor.signals.cameraChanged.dispatch( editor._cam );
		editor._activeControls.update();
    }

    var cameraPanel = new  UI.Panel().setId('cameraPanel');    
    var addCamera  = new UI.Button( 'Add Camera' ).setMarginTop('5px').setMarginLeft( '10px' );
    
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

		var showCam = new UI.Button('Show').setMarginLeft( '10px' ).onClick( setAllCameras );
		var remCam  = new UI.Button('Remove').setMarginLeft( '10px' ).onClick( function(){ 
			cameraScrollContainer.remove( cameraListItem ); 
			var scrollContainer = document.getElementById('cameraArrayList').firstChild;
			var currentWidth = parseInt( scrollContainer.style.width ,10 );	  
			
			//rescale scrollContainer
			scrollContainer.style.width = (currentWidth - 285)+'px';
		});	

		cameraListItem.add(showCam, remCam, new UI.Break());

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
		var currentWidth = parseInt( scrollContainer.style.width ,10 );
		
		//rescale scrollContainer
		scrollContainer.style.width = (currentWidth + 285)+'px';
		
    } );

    cameraPanel.add( addCamera  );

    var distCamera = new UI.Button( 'Distribute Cameras' ).setMarginTop('5px').setMarginLeft( '7px' );
    cameraPanel.add( distCamera );

    cameraPanel.add( new UI.Break() );

    var cameraList = new UI.Panel().setId('cameraArrayList');
    cameraPanel.add(cameraList);

    var cameraScrollContainer = new UI.Panel().setWidth('0px');
    cameraList.add( cameraScrollContainer );
  

    container.add( cameraPanel );

// --------------------------------------------------

	

    var imagePanel = new  UI.Panel().setId('imagePanel'); 

	
	var textureRTT  = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { format: THREE.RGBFormat });
	

	
	//var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 20 ), new THREE.MeshBasicMaterial( { map: textureRTT } ) );
	//plane.position.set(0,5,-10);
	//scene.add(plane);
	//sceneRTT.add( orthoCam );
	
	var renderToTexture = function(){
		//camera.updateProjectionMatrix();
		
		//galleryCamera.updateProjectionMatrix();
		//sceneHelpers.updateMatrixWorld();
		//scene.updateMatrixWorld();
		
		
		if ( editor.scene.skybox ) editor.scene.skybox.alignWithCamera( galleryCamera );
		
		//renderer.clear();
		
		//sceneHelpers.updateMatrixWorld();
		
		galleryCamera.aspect = camera.aspect;
		galleryCamera.updateProjectionMatrix();
		scene.updateMatrixWorld();
		sceneHelpers.updateMatrixWorld()
		renderer.clear();
		
		renderer.render( scene, galleryCamera, textureRTT, true );

		var width  = textureRTT.width;
		var height = textureRTT.height;
		
		var size = 4 * width * height;
		
		var pixelBuffer = new Uint8Array( size );
		
		var gl = renderer.context;
		var framebuffer = textureRTT.__webglFramebuffer;
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);        
		gl.viewport(0, 0, width, height);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
	
		var canvas = $( document.createElement('canvas') );
		//document.body.appendChild(canvas);
		
		var iconDelete = $( document.createElement('span') ).addClass('galleryDeleteIcon');
				
		var scrollContainer = $('#imageList').first();	
		
		
		var imageItem = $( document.createElement('div') ).addClass('imageContainer');		
		scrollContainer.append( imageItem );

		var a = $( document.createElement('a') );	
		a.append( canvas );
		a.append( iconDelete );
		imageItem.append( a );	
		
		a.onclick = function(){
			console.log("click");
			console.log( canvas[0].toDataURL('image/png') );
			window.open ( canvas[0].toDataURL('image/png'),"","menubar=0,resizable=1");
		};
		

		
		var ctx = canvas[0].getContext('2d');
			
		var imgData = ctx.getImageData(0, 0, width, height);
		
		for (var i = 0; i < size ; i += 4) {
			imgData.data[i+0] = pixelBuffer[size-(i)];
			imgData.data[i+1] = pixelBuffer[size-(i-1)];
			imgData.data[i+2] = pixelBuffer[size-(i-2)];
			imgData.data[i+3] = pixelBuffer[size-(i-3)];
		}
		
		ctx.putImageData(imgData, 0, 0);		
	
		console.log(canvas);
		
		// var blob = new Blob( [ pixels ], { type: "image/png" } );
		// var urlCreator = window.URL || window.webkitURL;
		// var imageUrl = urlCreator.createObjectURL( blob );
		
		
		// console.log(imageUrl);
		
		// var imageType = "image/png";
		// var imgData = imageUrl;//rendererRTT.domElement.toDataURL( imageType );
		
		// var scrollContainer = document.getElementById("imageList").firstChild;
		// var img = document.createElement("img");
		// img.setAttribute( "src", imgData );
		// img.onclick = function(){
			// window.open (imgData,"","menubar=0,resizable=1");
		// };

		// var iconDelete = document.createElement("span");
		// iconDelete.className = "galleryDeleteIcon";
	
		// var imageItem = document.createElement("div");
		// imageItem.className = "imageContainer";
		// scrollContainer.appendChild( imageItem );

		// var a = document.createElement("a");	
		// a.appendChild( img );
		// a.appendChild( iconDelete );

		// imageItem.appendChild( a );	

		// iconDelete.onclick = function(){
			// scrollContainer.removeChild( imageItem );
			// var currentWidth = parseInt( scrollContainer.style.width ,10 );
			// scrollContainer.style.width = (currentWidth - 320)+'px';
				
		// };

		// var currentWidth = parseInt( scrollContainer.style.width ,10 );
		// scrollContainer.style.width = (currentWidth + 320)+'px';
			
	};
	
	var takeScreenshot = new UI.Button( 'Take Photo' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {
		var cam      = editor.config.getKey('camera');
		var position = cam.position;
		var lookAt   = cam.target;
		
		galleryCamera.position.fromArray(position);		
		galleryCamera.lookAt( new THREE.Vector3().fromArray(lookAt) );
		
		renderToTexture();
		// sceneHelpers.updateMatrixWorld();
		// scene.updateMatrixWorld();
		
		// if ( editor.scene.skybox ) editor.scene.skybox.alignWithCamera( galleryCamera );
		// renderer.clear();
		
		// galleryCamera.position.fromArray( editor.config.getKey( 'camera' ).position );
		// galleryCamera.lookAt( new THREE.Vector3().fromArray( editor.config.getKey( 'camera' ).target ) );
		// renderer.render( scene, galleryCamera, textureRTT, true );
		// rendererRTT.render( sceneRTT, orthoCam  );
		//cameraArray = [];
		
	});    

    var takeArrayScreenshot = new UI.Button( 'Take Photo from Array' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {
		cameraArray = [];
		
		var panels = document.getElementById('cameraArrayList').firstChild.getElementsByTagName("div");
		for( var i = 0; i < panels.length; i++){
			cameraArray[ i ] = [];
			var numbers = panels[i].getElementsByTagName("input");
			//console.log( numbers[0].value );
			cameraArray[i][0] = numbers[0].value;
			cameraArray[i][1] = numbers[1].value;
			cameraArray[i][2] = numbers[2].value;
			cameraArray[i][3] = numbers[3].value;
			cameraArray[i][4] = numbers[4].value;
			cameraArray[i][5] = numbers[5].value;
		}
		//console.log(cameraArray);
		if( cameraArray.length > 0 ){
			//signals.renderingRequested.dispatch( cameraArray );
		}
		//
    });

    imagePanel.add(takeScreenshot, takeArrayScreenshot, new UI.Break());

    var imageList = new UI.Panel().setId('imageList');
    imagePanel.add( imageList );

    var imageScrollContainer = new UI.Panel().setWidth('0px');
    imageList.add( imageScrollContainer );

    container.add( imagePanel );

    // signals.newImageAvailable.add( function ( imgData ) {

		// var scrollContainer = document.getElementById("imageList").firstChild;

		// var img = document.createElement("img");
		// img.setAttribute( "src", imgData );
		// img.onclick = function(){
			// window.open (imgData,"","menubar=0,resizable=1");
		// };

		// var iconDelete = document.createElement("span");
		// iconDelete.className = "galleryDeleteIcon";
		

		// var imageItem = document.createElement("div");
		// imageItem.className = "imageContainer";
		// scrollContainer.appendChild( imageItem );

		// var a = document.createElement("a");	

		// a.appendChild( img );
		// a.appendChild( iconDelete );

		// imageItem.appendChild( a );	

		// iconDelete.onclick = function(){
			// scrollContainer.removeChild( imageItem );
			// var currentWidth = parseInt( scrollContainer.style.width ,10 );
			// scrollContainer.style.width = (currentWidth - 320)+'px';
			
		// };

		// var currentWidth = parseInt( scrollContainer.style.width ,10 );
		// scrollContainer.style.width = (currentWidth + 320)+'px';

    // });
    
    

// --------------------------------------------------

    return container;

}



        // //scene gallery
        // var takeScreenShot = false;

        // signals.renderingRequested.add( function ( cameraArray ) {


	    // if( cameraArray.length == 0 ){
		// takeScreenShot = true;
		// render();
		// takeScreenShot = false;
	    // }else{
		// for(var i = 0; i < cameraArray.length; i++){
		    
		    // //console.log( cameraArray[i] );
		    // var position = cameraArray[i].slice(0,3);
		    // var lookAt   = cameraArray[i].slice(3);
		    
		    // //console.log( lookAt );
		    
		    // editor._cam.position.fromArray( position );
		    
		    // editor._cam.lookAt( new THREE.Vector3().fromArray( lookAt ) );
		    
		    // editor.signals.cameraChanged.dispatch( editor._cam );
		    // // editor._transformControls.update();
		    // editor._activeControls.update();
		    
		    // takeScreenShot = true;
		    // render();
		    // takeScreenShot = false;
		// }
	    // }
	    
	// });

	 // if( takeScreenShot === true ){
				// // var imageType = editor.config.getKey( 'imageType' ) || 'png';
				// // imageType = "image/"+imageType.toLowerCase();
				// //console.log("imagetype:"+imageType);
				// var imageType = "image/png"
				// //editor.takeScreenShot = false;
				// signals.newImageAvailable.dispatch( renderer.domElement.toDataURL( imageType ) );
		    // }
	
	