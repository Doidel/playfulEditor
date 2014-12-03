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

    var inputDescription = $( document.createElement('textarea') ).attr('rows','4').attr('cols','50');
    inputPanel.dom.appendChild( inputDescription[0] );
    container.add( inputPanel  );

    //----------------------------------------------------------------------------------------
    
    var infoPanel = new UI.Panel().setClass('galleryUploadPanel'); 

    var uploadButton = $( document.createElement('button') ).text('Upload').addClass('galleryUploadButton');
    infoPanel.dom.appendChild( uploadButton[0] );

    infoPanel.dom.appendChild( document.createElement("br") );

    var siteLink = document.createElement("a");
    
    infoPanel.dom.appendChild( document.createElement("br") );

    var statusLabel =  $( document.createElement('label') ).text('status').attr('id','galleryUploadStatus');   
    infoPanel.dom.appendChild( statusLabel[0] );

    container.add( infoPanel );

    return container;

}

