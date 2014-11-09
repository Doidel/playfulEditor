var Menubar = function ( editor ) {

    var container = new UI.Panel();
    
    // TODO: review and remove menubar when all options moved to sidebar menus
    
    //container.add( new Menubar.File( editor ) );
    container.add( new Menubar.Edit( editor ) );
    container.add( new Menubar.Add( editor ) );
    //container.add( new Menubar.View( editor ) );
    //container.add( new Menubar.Help( editor ) );
    container.add( new Menubar.PlayCameras( editor ) );
    
    //container.add( new Menubar.SceneGallery( editor ) );
    
    return container;

}
