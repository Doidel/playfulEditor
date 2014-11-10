Menubar.File = function ( editor ) {

	// helpers
	
	function exportGeometry ( exporterClass ) {

		var object = editor.selected;
		var exporter = new exporterClass();

		var output = exporter.parse( object.geometry );

		if ( exporter instanceof THREE.BufferGeometryExporter ||
		     exporter instanceof THREE.GeometryExporter ) {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		}

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		window.open( objectURL, '_blank' );
		window.focus();

	};

	function exportObject ( exporterClass ) {

		var object = editor.selected;
		var exporter = new exporterClass();

		var output = JSON.stringify( exporter.parse( object ), null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		window.open( objectURL, '_blank' );
		window.focus();

	}

	function exportScene ( exporterClass, callback, noDownload ) {

		var exporter = new exporterClass();

		var output = exporter.parse( editor.scene );

		if ( exporter instanceof THREE.ObjectExporter || exporter instanceof THREE.PlayfulExporter ) {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		}
		
		// CUSTOM
		
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
		
		// END CUSTOM

	}
	
	editor.storage.createZip = function ( callback ) {
		exportScene( THREE.PlayfulExporter, callback, true );
	}

	// event handlers

	function onNewOptionClick () {

		if ( confirm( 'Are you sure?' ) ) {

			editor.config.clear();
			editor.storage.clear( function () {

				location.href = location.pathname;

			} );

		}

	}

	function onImportOptionClick () {

		fileInput.click();

	}

	function onFileInputChange ( event ) {

		editor.loader.loadFile( fileInput.files[ 0 ] );

	}

	function onExportGeometryOptionClick () {
		
		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		if ( geometry instanceof THREE.BufferGeometry ) {

			exportGeometry( THREE.BufferGeometryExporter );

		} else if ( geometry instanceof THREE.Geometry ) {

			exportGeometry( THREE.GeometryExporter );

		}

	}

	function onExportObjectOptionClick () {

		if ( editor.selected === null ) {

			alert( 'No object selected' );
			return;

		}

		exportObject( THREE.ObjectExporter );

	}

	function onExportSceneOptionClick () {

		exportScene( THREE.PlayfulExporter );

	}

	function onExportOBJOptionClick () {

		exportGeometry( THREE.OBJExporter );

	}

	function onExportSTLOptionClick () {

		exportScene( THREE.STLExporter );

	}

	// create file input element for scene import

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', onFileInputChange);

	// configure menu contents

	var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;
	
	var menuConfig = [
		createOption( 'New', onNewOptionClick ),
		createDivider(),

		createOption( 'Import', onImportOptionClick ),
		createDivider(),

		//createOption( 'Export Geometry', onExportGeometryOptionClick ),
		//createOption( 'Export Object', onExportObjectOptionClick ),
		createOption( 'Export', onExportSceneOptionClick ),
		//createOption( 'Export OBJ', onExportOBJOptionClick ),
		//createOption( 'Export STL', onExportSTLOptionClick )
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( 'File', optionsPanel );

}
