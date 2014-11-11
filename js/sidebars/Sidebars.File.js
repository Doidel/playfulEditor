Sidebars.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("File").appendTo(container.dom);
	var menu = new UI.Panel();
	menu.setClass("Panel menu");
	
	// Create a button for each menu item
	var newButton = $("<a/>").html("New Document").on("click",function(e)
	{
		if ( confirm( 'Are you sure?' ) )
		{
			editor.config.clear();
			editor.storage.clear( function () {
				location.href = location.pathname;
			} );
		}
	});
	
	var importButton = $("<a/>").html("Import").on("click",function(e)
	{
		fileInput.click();
	});
		
		// create file input element for scene import
		var fileInput = document.createElement( 'input' );
		fileInput.type = 'file';
		fileInput.addEventListener( 'change', onFileInputChange);
		
		function onFileInputChange ( event ) {
			editor.loader.loadFile( fileInput.files[ 0 ] );
		}
		
	var exportButton = $("<a/>").html("Export").on("click",function(e)
	{
		Sidebars.File.exportSceneHelper( editor, THREE.PlayfulExporter );
	});
	
	
	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu")
		.append( $("<li/>").html(newButton) )
		.append( $("<li/>").html(importButton) )
		.append( $("<li/>").html(exportButton) )
		.appendTo(menu.dom);
	
	// Add signal listener to show/hide this sidebar panel
	signals.menuButtonClicked.add( function(name) {
		if(name=="file+help")
		{
			// Show this sidebar panel when file+help menu button is clicked
			$(container.dom).toggle(200);
		}
		else {
			$(container.dom).hide()
		}
	});	
	
	container.add(menu);
	
	//
	editor.storage.createZip = function ( callback ) {
		Sidebars.File.exportSceneHelper( editor, THREE.PlayfulExporter, callback, true );
	};
	
	return container;
};
