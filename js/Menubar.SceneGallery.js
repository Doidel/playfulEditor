Menubar.SceneGallery = function ( editor ) {

	// event handlers

	function onShowHide () {
	    var galleryPanel = document.getElementById('gallery');
	    if(galleryPanel.style.display == 'none'){
		console.log('on');
		galleryPanel.style.display = '';
	    }else{
		console.log('off');
		galleryPanel.style.display = 'none';
	    }
		// window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )

	}

	function onUpload () {

		// window.open( 'http://threejs.org', '_blank' );

	}

	// configure menu contents

	var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		createOption( 'Show / Hide Gallery Panel', onShowHide ),
		createOption( 'Upload Gallery', onUpload )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'Gallery', optionsPanel );
}
