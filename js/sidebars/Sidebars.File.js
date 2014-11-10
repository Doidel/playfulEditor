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
	
	var exportScene = function ( exporterClass, callback, noDownload ) {

		var exporter = new exporterClass();

		var output = exporter.parse( editor.scene );

		if ( exporter instanceof THREE.ObjectExporter || exporter instanceof THREE.PlayfulExporter ) {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		}
		
		var zip = new JSZip();
		zip.file("Sceneobjects.json", output);
		var soundFolder = zip.folder("sounds");
		var texturesFolder = zip.folder("textures");
		
		var sounds = exporter.getSounds();
		var textures = exporter.getTextures();
		var soundsLength = sounds.length;
		var texturesLength = textures.length;
		var attachmentsLength = soundsLength + texturesLength;
		
		var attachmentsLoadedAmount = 0;
		
		var createDownload = function() {
			var blob = zip.generate({ type: "blob" });
			if ( callback ) callback( blob );
			if ( !noDownload ) window.saveAs(blob, "playful.playful");
		};
		
		if ( attachmentsLength > 0 ) {
		
			// check whether all sounds are loaded every time an individual sound is loaded
			var attachmentsLoaded = function() {
				attachmentsLoadedAmount++;
				if (attachmentsLoadedAmount >= attachmentsLength) {
					createDownload();
				}
			};
			
			for ( var sI = 0; sI < soundsLength; sI++ ) {
				var loader = new FileReader();
				loader.sound = sounds[sI];
				loader.onload = function() {
					soundFolder.file(this.sound.name, this.result, {base64: true});
					//console.log('loaded ', this.sound.name);
					attachmentsLoaded();
				};
				loader.onerror = function() {
					attachmentsLoaded();
				};
				loader.readAsArrayBuffer(loader.sound);
			}
			
			for ( var tI = 0; tI < texturesLength; tI++ ) {
				var loader = new FileReader();
				loader.texture = textures[tI];
				loader.onload = function() {
					texturesFolder.file(this.texture.sourceFile, this.result, {base64: true});
					attachmentsLoaded();
				};
				loader.onerror = function() {
					attachmentsLoaded();
				};
				loader.readAsArrayBuffer(loader.texture.sourceBlob);
			}
		
		} else {
			createDownload();
		}

	};
	
	editor.storage.createZip = function ( callback ) {
		exportScene( THREE.PlayfulExporter, callback, true );
	};
	
	return container;
};

Sidebars.File.prototype.exportScene = (function ( ) {
})();
