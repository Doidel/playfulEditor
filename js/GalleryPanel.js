var GalleryPanel = function( editor ){
    var signals = editor.signals;
    var cameraArray;

    var container = new UI.Panel().setDisplay('none');  

// --------------------------------------------------

    function updateCamera(){
	editor.signals.cameraChanged.dispatch( editor._cam );
	//editor._transformControls.update();
	editor._activeControls.update();
    }

    var cameraPanel = new  UI.Panel().setId('cameraPanel'); 
   
    var addCamera  = new UI.Button( 'Add Camera' ).setMarginTop('5px').setMarginLeft( '10px' );
    
    addCamera.onClick( function () {
	

	var setCamera = function () {
	    var x = cameraPositionX.getValue();
	    var y = cameraPositionY.getValue();
	    var z = cameraPositionZ.getValue();
	    editor._cam.position.fromArray([ x, y, z]);
	    
	    var lookAtX = cameraRotationX.getValue();
	    var lookAtY = cameraRotationY.getValue();
	    var lookAtZ = cameraRotationZ.getValue();
	    editor._cam.lookAt( new THREE.Vector3().fromArray([ lookAtX, lookAtY, lookAtZ]) );
	    
	    updateCamera();
	    
	};
	

	updateCamera();

	var cam = editor.config.getKey('camera');
	var position = cam.position;
	var lookAt   = cam.target;

	var cameraListItem = new UI.Panel().setMarginLeft('5px');

	cameraListItem.add(new UI.Break());

	var showCam = new UI.Button('Show').setMarginLeft( '10px' ).onClick( setCamera );
	var remCam  = new UI.Button('Remove').setMarginLeft( '10px' ).onClick( function(){ 
	    cameraScrollContainer.remove( cameraListItem ); 
	    var scrollContainer = document.getElementById('cameraArrayList').firstChild;
	    var currentWidth = parseInt( scrollContainer.style.width ,10 );	  
	    scrollContainer.style.width = (currentWidth - 285)+'px';
	});
	

	cameraListItem.add(showCam, remCam, new UI.Break());

	var cameraPositionX = new UI.Number().setValue( position[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setCamera );
	var cameraPositionY = new UI.Number().setValue( position[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setCamera );
	var cameraPositionZ = new UI.Number().setValue( position[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setCamera );
	var cameraPositionXLabel = new UI.Text( 'X' ).setWidth( '10px' ).setColor( 'red' );
	var cameraPositionYLabel = new UI.Text( 'Y' ).setWidth( '10px' ).setColor( 'green' );
	var cameraPositionZLabel = new UI.Text( 'Z' ).setWidth( '10px' ).setColor( 'blue' );
	
	cameraListItem.add( new UI.Text( 'Position' ).setWidth( '80px' ) );
	cameraListItem.add( cameraPositionXLabel, cameraPositionX,
		       cameraPositionYLabel, cameraPositionY,
		       cameraPositionZLabel, cameraPositionZ, new UI.Break() );	


	var cameraRotationX = new UI.Number().setValue( lookAt[0] ).setWidth( '50px' ).setColor( 'red' ).onChange( setCamera );
	var cameraRotationY = new UI.Number().setValue( lookAt[1] ).setWidth( '50px' ).setColor( 'green' ).onChange( setCamera );
	var cameraRotationZ = new UI.Number().setValue( lookAt[2] ).setWidth( '50px' ).setColor( 'blue' ).onChange( setCamera );
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
	// console.log( currentWidth );
	scrollContainer.style.width = (currentWidth + 285)+'px';
	// console.log( scrollContainer.style.width );
	


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

    var takeScreenshot = new UI.Button( 'Take Photo' ).setMarginTop('5px').setMarginLeft( '7px' ).onClick( function () {

	 cameraArray = [];


	signals.renderingRequested.dispatch( cameraArray );
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
	    signals.renderingRequested.dispatch( cameraArray );
	}
	//
    });

    imagePanel.add(takeScreenshot, takeArrayScreenshot, new UI.Break());

    var imageList = new UI.Panel().setId('imageList');
    imagePanel.add( imageList );

    var imageScrollContainer = new UI.Panel().setWidth('0px');
    imageList.add( imageScrollContainer );

    container.add( imagePanel );

    signals.newImageAvailable.add( function ( imgData ) {

	var scrollContainer = document.getElementById("imageList").firstChild;

	var img = document.createElement("img");
	img.setAttribute( "src", imgData );
	img.onclick = function(){
	    window.open (imgData,"","menubar=0,resizable=1");
	};

	var iconDelete = document.createElement("span");
	iconDelete.className = "galleryDeleteIcon";
	

	var imageItem = document.createElement("div");
	imageItem.className = "imageContainer";
	scrollContainer.appendChild( imageItem );

	var a = document.createElement("a");	

	a.appendChild( img );
	a.appendChild( iconDelete );

	imageItem.appendChild( a );	

	iconDelete.onclick = function(){
	    scrollContainer.removeChild( imageItem );
	    var currentWidth = parseInt( scrollContainer.style.width ,10 );
	    scrollContainer.style.width = (currentWidth - 320)+'px';
	    
	};

	var currentWidth = parseInt( scrollContainer.style.width ,10 );
	scrollContainer.style.width = (currentWidth + 320)+'px';

    });
    
    

// --------------------------------------------------

    return container;

}

