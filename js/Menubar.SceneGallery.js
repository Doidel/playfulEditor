Menubar.SceneGallery = function ( editor ) {

	// event handlers

	function showHide ( id ) {
	    //console.log(id);
	    var panel = document.getElementById( id );
	    if(panel.style.display == 'none'){	
		panel.style.display = '';
	    }else{	
		panel.style.display = 'none';
	    }
	}

    function onShowHideGallery(){
	showHide('gallery');
    }

    function onShowHideUpload(){
	showHide('galleryUpload');
    }
	// configure menu contents

	var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		createOption( 'Show / Hide Camera Panel', onShowHideGallery ),
		createOption( 'Show / Hide Upload Panel', onShowHideUpload )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'Gallery', optionsPanel );
}
