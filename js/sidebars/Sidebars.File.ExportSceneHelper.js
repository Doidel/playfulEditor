Sidebars.File.exportSceneHelper = function ( editor, exporterClass, callback, noDownload ) {

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
}