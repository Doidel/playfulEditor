var GalleryUploadPanel = function( editor ){
    var signals = editor.signals;
    
    var container = new UI.Panel().setDisplay('none'); 

    var inputPanel = new UI.Panel().setClass('galleryUploadPanel'); 
       
    var labelMail = document.createElement("label");
    labelMail.innerHTML = "E-Mail:";
    inputPanel.dom.appendChild( labelMail );
    
    inputPanel.dom.appendChild( document.createElement("br") );

    var inputMail = document.createElement("input");
    inputMail.type = "text";
    inputMail.name = "email";
    inputMail.size = "30";
    inputPanel.dom.appendChild( inputMail );

    inputPanel.dom.appendChild( document.createElement("br") );

    var labelName = document.createElement("label");
    labelName.innerHTML = "Name:";
    inputPanel.dom.appendChild( labelName );    
    

    inputPanel.dom.appendChild( document.createElement("br") );

     var inputName = document.createElement("input");
    inputName.type = "text";
    inputName.name = "name";
    inputName.size = "30";
    inputPanel.dom.appendChild( inputName );

    inputPanel.dom.appendChild( document.createElement("br") );
    

    var labelDescription = document.createElement("label");
    labelDescription.innerHTML = "Description:";
    inputPanel.dom.appendChild( labelDescription );

    inputPanel.dom.appendChild( document.createElement("br") );

    var inputDescription = document.createElement("textarea");
    inputMail.rows = "4";
    inputMail.cols = "50";

    inputPanel.dom.appendChild( inputDescription );
    container.add( inputPanel  );

    //----------------------------------------------------------------------------------------
    
    var infoPanel = new UI.Panel().setClass('galleryUploadPanel'); 

    var uploadButton = document.createElement("button");
    uploadButton.innerHTML = "Upload";
    uploadButton.className = "galleryUploadButton";
    infoPanel.dom.appendChild( uploadButton );

    
    // var closeButton = document.createElement("button");
    // closeButton.innerHTML = "Close";
    // closeButton.className = "galleryUploadButton";
    // infoPanel.dom.appendChild( closeButton );

    infoPanel.dom.appendChild( document.createElement("br") );

    var siteLink = document.createElement("a");
    
    infoPanel.dom.appendChild( document.createElement("br") );

    var statusLabel =  document.createElement("label");
    statusLabel.innerHTML = "status";
    statusLabel.id = "galleryUploadStatus";
    infoPanel.dom.appendChild( statusLabel );

    container.add( infoPanel );
    
    //inputName.id   = "galleryUploadInputName";


    //labelName.id = "galleryUploadInputName";
    
    
   

    

    // console.log(inputPanel);

    return container;

}

