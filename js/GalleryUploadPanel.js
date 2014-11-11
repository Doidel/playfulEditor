var GalleryUploadPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 

    var inputPanel = new UI.Panel().setClass('galleryUploadPanel'); 
       
    var br = $( document.createElement('br') )[0];

    var labelMail = $( document.createElement('label') ).html('E-Mail:');
    inputPanel.dom.appendChild( labelMail[0] );
    
    inputPanel.dom.appendChild( br );

    var inputMail = $( document.createElement('input') ).attr('type','text').attr('name','email').attr('size','30').attr('id','uploadMail');
    inputPanel.dom.appendChild( inputMail[0] );

    inputPanel.dom.appendChild( br );

    var labelName = $( document.createElement('label') ).html('Name:');    
    inputPanel.dom.appendChild( labelName[0] );    
    
    inputPanel.dom.appendChild( br );

    var inputName = $( document.createElement('input') ).attr('type','text').attr('name','name').attr('size','30').attr('id','uploadName');
    inputPanel.dom.appendChild( inputName[0] );

    inputPanel.dom.appendChild( br );    

    var labelDescription = $( document.createElement('label') ).html('Description:');    
    inputPanel.dom.appendChild( labelDescription[0] );   

    inputPanel.dom.appendChild( br );

    var inputDescription = $( document.createElement('textarea') ).attr('rows','4').attr('cols','50');
  
    inputPanel.dom.appendChild( inputDescription[0] );
    
    container.add( inputPanel  );

    //----------------------------------------------------------------------------------------
    
    var infoPanel = new UI.Panel().setClass('galleryUploadPanel'); 

    var uploadButton = $( document.createElement('button') ).html('Upload').addClass('galleryUploadButton');  
    infoPanel.dom.appendChild( uploadButton[0] );

    uploadButton.click( function(){
	editor.storage.createZip( upload );	
    });

    function upload( blob ){

	var email = $('#uploadMail').val() || 'nomail';
	var name  = $('#uploadName').val() || 'noname';
	var scene = 'test_scene';

	//console.log( email +" "+ name);

	var playfulBlob  = blob;
	var imageZip = new JSZip();
	$('.imageContainer').each( function( index ){
	    var image = $(this).find('img');
	    var result = image.attr('src').match(/^data:image\/(png|jpeg);base64,(.*)/);	   
	    if( result ) imageZip.file(name + "_" + scene + "_" + index + "." + result[1], result[2], {base64:true} );	    	
	});

	//var imageBlob = imageZip.generate( { type: 'blob',  compression: 'DEFLATE' } );
	var imageBlob = imageZip.generate( { type: 'blob',  compression: 'STORE' } );
	
	//console.log(imageBlob);

	var formData = new FormData();
	formData.append('email', email);
	formData.append('name',  name );
	formData.append('scene', scene);

	formData.append('playful', playfulBlob );
	formData.append('images',  imageBlob  );
	
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener('progress', function(){}, false);
	xhr.addEventListener('load',  function(){ console.log("complete"); }, false);
	xhr.addEventListener('error', function(){ console.log("error"); }, false);
	xhr.addEventListener('abort', function(){}, false);	
	xhr.open('POST', "128.0.0.1:3000/testupload");
	xhr.send( formData );	
	//;
    }

    
    // var closeButton = document.createElement("button");
    // closeButton.innerHTML = "Close";
    // closeButton.className = "galleryUploadButton";
    // infoPanel.dom.appendChild( closeButton );

    infoPanel.dom.appendChild( br );

    //var siteLink = document.createElement("a");
    
    infoPanel.dom.appendChild( br );

    // var statusLabel =  document.createElement("label");
    // statusLabel.innerHTML = "status";
    // statusLabel.id = "galleryUploadStatus";
    // infoPanel.dom.appendChild( statusLabel );

    container.add( infoPanel );
    
    //inputName.id   = "galleryUploadInputName";


    //labelName.id = "galleryUploadInputName";
    
    
   

    

    // console.log(inputPanel);

    return container;

}

