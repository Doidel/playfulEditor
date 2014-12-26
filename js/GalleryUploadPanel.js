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
		
	uploadButton.click(function(){
	
		var lockPanel = function(){
		//background: url("../images/iconset/wait.gif") no-repeat scroll 25% 50% #E57245;
			uploadButton.attr('disabled','disabled');
			uploadButton.css('background-image','url("./images/iconset/wait.gif")');
			uploadButton.css('background-repeat','no-repeat');
			uploadButton.css('background-position','left center');
			removeLink.val('');
		};
		
		var unlockPanel = function(){
			uploadButton.removeAttr('disabled');
			uploadButton.css('background-image','');
			uploadButton.css('background-repeat','');
			uploadButton.css('background-position','');
		};
		
		var checkFields = function(){
			
		};
	
		lockPanel();
	
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
								
			formData.append("name",        	inputName.val() );
			formData.append("scene",       	editor.scene.name );
			formData.append("email",       	inputMail.val() );
			formData.append("description", 	inputDescription.val() );
			formData.append("images",      	zip.generate({type:'blob'}) );
			formData.append("playful",     	blob );
			formData.append("captcha", 		$('#g-recaptcha-response').val() || '' );
			
			//console.log($('#g-recaptcha-response').val());
									
			var success = function(a,b,c){
				//console.log(a);
				//var json = ;
				console.log(a.link);
				console.log(a.remove);
				removeLink.val(a.remove);
				statusLabel.css('color','green');
				statusLabel.text("Upload Successful!");
				
				$('#gallery > iframe')[0].contentWindow.location.reload();							
			};
			
			var error = function(a,b,c){
				var json = $.parseJSON(a.responseText);
				statusLabel.css('color','red');
				statusLabel.text( json['error-codes'] );
			};
			
			var complete = function(){
				grecaptcha.reset();
				unlockPanel();
			};
			
			
			$.ajax({
				url: "gallery/upload",
				//url: "localhost:3000/upload",
				type: "POST",
				dataType: 'json',
				data: formData,
				crossDomain: true,
				error: error,
				success: success,
				complete: complete,
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			});
			
		} );
		
	});
    
    infoPanel.dom.appendChild( document.createElement("br") );
	
	//add captcha
	var captcha = $( document.createElement('div') );
	captcha.addClass('g-recaptcha');	
	infoPanel.dom.appendChild( captcha[0] );
	
	var removeLinkLabel = $(document.createElement('label')).text('Delete Link:').attr('id','galleryUploadRemoveLinkLabel');
	infoPanel.dom.appendChild( removeLinkLabel[0] );
	
	var removeLink = $(document.createElement("input"));
	removeLink.attr('type','text');
	//removeLink.attr('href','');
	removeLink.attr('target','_blank');
	//removeLink.val('');
	removeLink.attr('id','galleryUploadRemoveLink');
	removeLink.attr('readonly', true);
	infoPanel.dom.appendChild( removeLink[0] );

    var statusLabel =  $( document.createElement('label') ).attr('id','galleryUploadStatus');   
    infoPanel.dom.appendChild( statusLabel[0] );

    container.add( infoPanel );

    return container;

}

