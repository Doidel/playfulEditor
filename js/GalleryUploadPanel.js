var GalleryUploadPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 

    var inputPanel = new UI.Panel().setClass('galleryUploadPanel'); 
       
    var labelMail = $( document.createElement('label') ).text('E-Mail:');
    inputPanel.dom.appendChild( labelMail[0] );
    
    inputPanel.dom.appendChild( document.createElement("br") );

    var inputMail = $( document.createElement('input') ).attr('type','text').attr('name','email').attr('size','30');
    inputPanel.dom.appendChild( inputMail[0] );

    inputPanel.dom.appendChild( document.createElement("br") );

    var labelName = $( document.createElement('label') ).text('Name:');
    inputPanel.dom.appendChild( labelName[0] );    
    

    inputPanel.dom.appendChild( document.createElement("br") );

    var inputName = $( document.createElement('input') ).attr('type','text').attr('name','nickname').attr('size','30');
    inputPanel.dom.appendChild( inputName[0] );

    inputPanel.dom.appendChild( document.createElement("br") );
    
    var labelDescription = $( document.createElement('label') ).text('Description:');
    inputPanel.dom.appendChild( labelDescription[0] );

    inputPanel.dom.appendChild( document.createElement("br") );

    var inputDescription = $( document.createElement('textarea') ).attr('rows','9').attr('cols','50');
    inputPanel.dom.appendChild( inputDescription[0] );
    container.add( inputPanel  );

    //----------------------------------------------------------------------------------------
    
    var infoPanel = new UI.Panel().setClass('galleryUploadPanel'); 

    var uploadButton = $( document.createElement('button') ).text('Upload').addClass('galleryUploadButton');
    infoPanel.dom.appendChild( uploadButton[0] );
	
	var fieldCheck = new function(){
		
	}
	
	uploadButton.click(function(){
	
		if( $('.imageContainer > a > canvas' ).length == 0 ){
			//addCameras
			var addCameraButton = $('#cameraPanel > button:eq(0)');
			for(var i = 0; i < 3; i++) addCameraButton.click();
			
			//rearrange cameras
			var rearrangeCameraButton = $('#cameraPanel > button:eq(1)');
			rearrangeCameraButton.click();
			
			//take screenshots
			$('#imagePanel > button')[1].click();
			
		}
	
		//TODO: FieldCheck
		var zip = new JSZip();
		var imageFolder = zip.folder('images');	
		
		$('.imageContainer > a > canvas' ).each(function(i,v){
			//console.log(v);
			var data = v.toDataURL('image/png');
			console.log(data.substr(data.indexOf(',')+1));
			imageFolder.file('image'+i+'.png', data.substr(data.indexOf(',')+1), {base64: true});
		});
		
		editor.storage.createZip( function(blob){
						
			var formData = new FormData();
								
			//console.log( inputName );
								
			formData.append("name",        inputName.val() );
			formData.append("scene",       editor.scene.name );
			formData.append("email",       inputMail.val() );
			formData.append("description", inputDescription.val() );
			formData.append("images",      zip.generate({type:'blob'}) );
			formData.append("playful",     blob );
			
			//console.log('send...');
			
			
			
			// var injectNewButton = function(){
				// $('#gallery > iframe').contents().find('.btn:contains("Open in PlayfulEditor")').each(function(){
					// var match = $(this).attr('href').match(/(\d+)$/);
					// if( match !== null ){
						// $(this).html('Open in this PlayfulEditor');
						// $(this).removeClass('btn-primary');
						// $(this).addClass('btn-warning');
						
						// //$(this).attr('target','');
						// $(this).click(function( event ){
							// event.preventDefault();
							// console.log(match[0]);
							// //editor.loader.loadRemotePlayful( match[0] );
						// });
					// }					
				// });
			// }
			
			// $('#gallery > iframe').load(function() {
				// injectNewButton();
			// });
			// injectNewButton();
			
			var success = function( a, b, c ){
				statusLabel.text("success");
				$('#gallery > iframe')[0].contentWindow.location.reload();
				//setTimeout(injectNewButton, 1000);
				
			};
			
			var error = function(a,b,c){
				statusLabel.text("error");
				console.log(a);
				console.log(b);
				console.log(c);
			};
			
			
			$.ajax({
				url: "gallery/upload",
				//url: "localhost:3000/upload",
				type: "POST",
				data: formData,
				crossDomain: true,
				error: error,
				success: success,
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			});
			
		} );
		
	});

    infoPanel.dom.appendChild( document.createElement("br") );

    var siteLink = document.createElement("a");
    
    infoPanel.dom.appendChild( document.createElement("br") );

    var statusLabel =  $( document.createElement('label') ).text('status').attr('id','galleryUploadStatus');   
    infoPanel.dom.appendChild( statusLabel[0] );

    container.add( infoPanel );

    return container;

}

