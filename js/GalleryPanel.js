var GalleryPanel = function( editor ){
    var signals = editor.signals;
    var cameraArray;
	
	//create camera to take screenshots of scene
	var galleryCamera = new THREE.PerspectiveCamera( 60, 1, 0.01, 500 );
	//galleryCamera.name = 'galleryCamera';
	galleryCamera.position.fromArray( editor.config.getKey( 'camera' ).position );
	galleryCamera.lookAt( new THREE.Vector3().fromArray( editor.config.getKey( 'camera' ).target ) );
		
	var scene = editor.sceneHelpers;
	var renderer = editor._renderer;
	scene.add( galleryCamera );
	
    var container = new UI.Panel().setDisplay('none');  

// --------------------------------------------------

	function updateMainCamera(){
		editor.signals.cameraChanged.dispatch( editor._cam );	
		editor._activeControls.update();
    }	

	var cameraPanel = new  UI.Panel().setId('cameraPanel'); 
	
	var addCamera  = new UI.Button( 'Add Camera' ).setMarginTop('5px').setMarginLeft( '10px' );

	addCamera.onClick( function () {
			
		var updateCameraPosition = new function( camera ){
			var x = cameraPositionX.getValue();
			var y = cameraPositionY.getValue();
			var z = cameraPositionZ.getValue();
			camera.position.fromArray([ x, y, z]);		
			
			var lookAtX = cameraRotationX.getValue();
			var lookAtY = cameraRotationY.getValue();
			var lookAtZ = cameraRotationZ.getValue();
			camera.lookAt( new THREE.Vector3().fromArray([ lookAtX, lookAtY, lookAtZ]) );
			
		};
	
		var positionCameras = function() {
			updateCameraPosition( editor._cam );
			updateCameraPosition( galleryCamera );			
			updateMainCamera();			
		};	

		//update main camera to get current location / lookat
		updateMainCamera();

		var cam = editor.config.getKey('camera');
		var position = cam.position;
		var lookAt   = cam.target;

		var cameraListItem = new UI.Panel().setMarginLeft('5px');

		cameraListItem.add(new UI.Break());

		var showCam = new UI.Button('Show').setMarginLeft( '10px' ).onClick( setCameras );
		var remCam  = new UI.Button('Remove').setMarginLeft( '10px' ).onClick( function(){ 
			cameraScrollContainer.remove( cameraListItem ); 
			var scrollContainer = document.getElementById('cameraArrayList').firstChild;
			var currentWidth = parseInt( scrollContainer.style.width ,10 );	  
			//scale scrollContainer back
			scrollContainer.style.width = (currentWidth - 285)+'px';
		});
	
	
		cameraListItem.add(showCam, remCam, new UI.Break());

		var cameraPositionX = new UI.Number().setValue( position[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setCameras );
		var cameraPositionY = new UI.Number().setValue( position[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setCameras );
		var cameraPositionZ = new UI.Number().setValue( position[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setCameras );
		var cameraPositionXLabel = new UI.Text( 'X' ).setWidth( '10px' ).setColor( 'red' );
		var cameraPositionYLabel = new UI.Text( 'Y' ).setWidth( '10px' ).setColor( 'green' );
		var cameraPositionZLabel = new UI.Text( 'Z' ).setWidth( '10px' ).setColor( 'blue' );
		
		cameraListItem.add( new UI.Text( 'Position' ).setWidth( '80px' ) );
		cameraListItem.add( cameraPositionXLabel, cameraPositionX,
				   cameraPositionYLabel, cameraPositionY,
				   cameraPositionZLabel, cameraPositionZ, new UI.Break() );	


		var cameraRotationX = new UI.Number().setValue( lookAt[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setCameras );
		var cameraRotationY = new UI.Number().setValue( lookAt[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setCameras );
		var cameraRotationZ = new UI.Number().setValue( lookAt[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setCameras );
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
		
		//scale scrollContainer
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
	var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { format: THREE.RGBFormat } );	
	
	var cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	//cameraRTT.position.z = 100;
	
	var galleryScene = new THREE.Scene(); 
	var plane = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
	var mesh  = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { map: renderTarget } ) );
	//galleryScene.add( mesh );
	scene.add( mesh );
	mesh.position.z = -100;
	
	var galleryRenderer = new THREE.WebGLRenderer();
	galleryRenderer.setSize( window.innerWidth, window.innerHeight );
	galleryRenderer.autoClear = false;
	
	var div = $( document.createElement('div') );
	div.appendTo('body');
	div.append( galleryRenderer.domElement );
	div.css('display', 'none');
	//TODO: Display none + css
	
	//console.log(  );
	//document.body.appendChild( galleryRenderer.domElement );
	
	var renderNewImage = function( ){
		renderer.render( scene, galleryCamera, renderTarget, true );		
		galleryRenderer.render( galleryScene, cameraRTT );		
	};
	
	
	
    var takeScreenshot = new UI.Button( 'Take Photo' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {
		renderNewImage();
		//cameraArray = [];
		//signals.renderingRequested.dispatch( cameraArray );
		//renderToTexture( copyScreenshotFromtTexture );
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
