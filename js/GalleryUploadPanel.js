var GalleryUploadPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 

    var inputPanel = new UI.Panel().setClass('galleryUploadPanel'); 
       
    var labelMail = $( document.createElement('label') ).text('E-Mail:');
    inputPanel.dom.appendChild( labelMail[0] );
    
    inputPanel.dom.appendChild( document.createElement("br") );

    var inputMail = $( document.createElement('input') ).attr('type','text').attr('name','email').attr('size','50');	
	deactivateEventListener( inputMail[0], 'keydown' );	
    inputPanel.dom.appendChild( inputMail[0] );

    inputPanel.dom.appendChild( document.createElement("br") );

    var labelName = $( document.createElement('label') ).text('Componist:');
    inputPanel.dom.appendChild( labelName[0] );    
    
//$('#outliner > div:eq(0)').text()
    inputPanel.dom.appendChild( document.createElement("br") );

    var inputName = $( document.createElement('input') ).attr('type','text').attr('name','nickname').attr('size','50');
	deactivateEventListener( inputName[0], 'keydown' );
    inputPanel.dom.appendChild( inputName[0] );

    inputPanel.dom.appendChild( document.createElement("br") );
    
	var labelSceneName = $( document.createElement('label') ).text('Scenename:');
    inputPanel.dom.appendChild( labelSceneName[0] );   
	inputPanel.dom.appendChild( document.createElement("br") );
	var inputSceneName = $( document.createElement('input') ).attr('type','text').attr('name','scenename').attr('size','50');
	deactivateEventListener( inputSceneName[0], 'keydown' );
    inputPanel.dom.appendChild( inputSceneName[0] );

    inputPanel.dom.appendChild( document.createElement("br") );
	
	
    var labelDescription = $( document.createElement('label') ).text('Description:');
    inputPanel.dom.appendChild( labelDescription[0] );

    inputPanel.dom.appendChild( document.createElement("br") );

    var inputDescription = $( document.createElement('textarea') ).attr('name','description').attr('rows','5').attr('cols','50');
	deactivateEventListener( inputDescription[0], 'keydown' );
    inputPanel.dom.appendChild( inputDescription[0] );
    container.add( inputPanel  );

    //----------------------------------------------------------------------------------------
    
    var infoPanel = new UI.Panel().setClass('galleryUploadPanel'); 

    var uploadButton = $( document.createElement('button') ).text('Upload').addClass('galleryUploadButton');
    infoPanel.dom.appendChild( uploadButton[0] );
	
	var lockPanel = function(){
			uploadButton.attr('disabled','disabled');
			uploadButton.css('background-image','url("./images/iconset/wait.gif")');
			uploadButton.css('background-repeat','no-repeat');
			uploadButton.css('background-position','left center');
			//removeLink.val('');
		};
		
	var unlockPanel = function(){
		uploadButton.removeAttr('disabled');
		uploadButton.css('background-image','');
		uploadButton.css('background-repeat','');
		uploadButton.css('background-position','');
	};
	
	var checkFields = function(){

		if( inputMail.val().length == 0 || inputMail.val().length > 50 ){
			inputMail.css('border','1px solid red');
			statusLabel.text('E-Mail must be between 1 and 50 characters');
			statusLabel.css('color','red');
			return false;
		}else{
			inputMail.css('border','');				
		}
		
		if( inputName.val().length == 0 || inputName.val().length > 50 ){
			statusLabel.text('Componist must be between 1 and 50 characters');
			statusLabel.css('color','red');
			inputName.css('border','1px solid red');
			return false;
		}else{
			inputName.css('border','');
		}
		
		if( inputSceneName.val().length == 0 || inputSceneName.val().length > 50 ){
			statusLabel.text('Scenename must be between 1 and 50 characters');
			statusLabel.css('color','red');
			inputSceneName.css('border','1px solid red');
			return false;
		}else{
			inputSceneName.css('border','');
		}
		
		if( inputDescription.val().length > 500 ){
			statusLabel.text('Description must be 500 characters or less');
			statusLabel.css('color','red');
			inputDescription.css('border','1px solid red');
			return false;
		}else{
			inputDescription.css('border','');
		}
		
		return true;
		
	};
		
	uploadButton.click(function(){		
	
		
		
		if( checkFields() ){
		
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
		
			//get captcha before the session timeout
			var captcha = $('#g-recaptcha-response').val() || '';
			
			var complete = function(){
						grecaptcha.reset();
						unlockPanel();
						$('#gallery > iframe')[0].contentWindow.location.reload();	
			};
			
			var error = function(a,b,c){
				complete();
				var json = $.parseJSON(a.responseText);
				//console.log(json);
				statusLabel.css('color','red');
				statusLabel.text( json['error-codes'] );
			};			
			
			var uploadData = function(){
				var formData = new FormData();
				
				formData.append("name",        	inputName.val() );
				formData.append("scenename",  	inputSceneName.val() );
				formData.append("email",       	inputMail.val() );
				formData.append("description", 	inputDescription.val() );
				formData.append("captcha", 		captcha );
				//console.log()
				
				editor.storage.createZip( function(blob){	
					
					var zip = new JSZip();
					var imageFolder = zip.folder('images');	
				
					$('.imageContainer > a > canvas' ).each(function(i,v){
						var data = v.toDataURL('image/png');
						imageFolder.file('image'+i+'.png', data.substr(data.indexOf(',')+1), {base64: true});
					});
					var imageBlob = zip.generate({type:'blob'});					

					formData.append("images",      	imageBlob );
					formData.append("playful",     	blob );
					
					
					//console.log($('#g-recaptcha-response').val());
										
					
										
					var success = function(a,b,c){
						complete();	
						removeLink.val(a.remove+"\n"+removeLink.val());
						statusLabel.css('color','green');
						statusLabel.text("Upload Successful!");												
					};				
					
					//console.log('send gallery');
					
					$.ajax({
						url: "gallery/upload",
						type: "POST",
						dataType: 'json',
						data: formData,
						crossDomain: true,
						error: error,
						success: success,
						//complete: complete,
						processData: false,  // tell jQuery not to process the data
						contentType: false   // tell jQuery not to set contentType
					});
					
				} );				
			};
			
			var checkCaptcha = function(){	

				var success = function(a,b,c){
					//console.log(a.success);
					uploadData();
				};
				
				//console.log('check captcha: '+"gallery/captchacheck?token="+captcha);
				
				//checkin captcha
				$.ajax({
					url: "gallery/captchacheck?token="+captcha,
					type: "GET",
					dataType: 'json',					
					crossDomain: true,
					error: error,
					success: success,
					processData: false,  // tell jQuery not to process the data
					contentType: false   // tell jQuery not to set contentType
				});
			};
			
			checkCaptcha();

		}
	
		
		
	});
    
    infoPanel.dom.appendChild( document.createElement("br") );
	
	//add captcha
	var captcha = $( document.createElement('div') );
	captcha.addClass('g-recaptcha');	
	infoPanel.dom.appendChild( captcha[0] );
	
	var removeLinkLabel = $(document.createElement('label')).text('Delete Links:').attr('id','galleryUploadRemoveLinkLabel');
	infoPanel.dom.appendChild( removeLinkLabel[0] );
	
	var removeLink = $(document.createElement("textarea"));
	removeLink.attr('rows','3').attr('cols','50');
	//removeLink.attr('target','_blank');
	removeLink.attr('id','galleryUploadRemoveLink');
	removeLink.attr('readonly', true);
	removeLink.attr('wrap','off');
	infoPanel.dom.appendChild( removeLink[0] );

    var statusLabel =  $( document.createElement('label') ).attr('id','galleryUploadStatus');   
    infoPanel.dom.appendChild( statusLabel[0] );

    container.add( infoPanel );

    return container;

}

function deactivateEventListener( dom, type ){
	dom.addEventListener( type, function ( event ) {

		event.stopPropagation();

	}, false );
}

