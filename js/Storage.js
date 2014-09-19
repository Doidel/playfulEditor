var Storage = function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	var name = 'threejs-editor';
	var version = 1;

	var database;
	
	//idb: filesystem and currentWorkingDirectory
	var fs = null;
	var cwd = null;
	var onError = function ( error ) {
	
		console.log( error );
		
	};

	return {

		init: function ( callback ) {

			/*var request = indexedDB.open( name, version );
			request.onupgradeneeded = function ( event ) {

				var db = event.target.result;

				if ( db.objectStoreNames.contains( 'states' ) === false ) {

					db.createObjectStore( 'states' );

				}

			};
			request.onsuccess = function ( event ) {

				database = event.target.result;

				callback();

			};
			request.onerror = function ( event ) {

				console.error( 'IndexedDB', event );

			};*/
			
			window.requestFileSystem = window.requestFileSystem ||
                           window.webkitRequestFileSystem;
			window.URL = window.URL || window.webkitURL;
			
			window.requestFileSystem(TEMPORARY, 1024*1024, function(myFs) {
				fs = myFs;
				cwd = fs.root;
				callback();
			}, function(e) {
				console.err(e);
			});			

		},
		
		tryCreate: function( path ) {
		
			// tries to create a file if it doesn't exist yet
			cwd.getFile(path, {create: true, exclusive: true}); //, function(fileEntry) {}, onError
		
		},

		get: function ( callback ) {

			/*var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.get( 0 );
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};*/
			
			//this.tryCreate( 'playful.playful' );
			cwd.getFile( '/playful.playful' , { create: false }, function ( fileEntry ) {
			
				fileEntry.file( function( file ) {
					callback( file );
				});
				
			}, function () {
				callback( );
			});

		},

		set: function ( data, callback ) {

			var start = performance.now();

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.put( data, 0 );
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );

			};

		},
		
		store: function( file ) {
			
			var start = performance.now();
			
			this.clear(function() {
			
				cwd.getFile(file.name, {create: true}, function( fileEntry ) {
							//console.log('fileEntry', fileEntry); fE = fileEntry;
					fileEntry.createWriter( function( fileWriter ) {
					
						//console.log(fileWriter.write);
						/*fileWriter.onwritestart = function() {
							console.log('WRITE START');
						};*/
						fileWriter.onwriteend = function() {
						
							console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );
							
						};
						fileWriter.write(file);
						
					}, onError);
					
				}, onError);
				
			});
			
		},

		clear: function ( callback ) {

			/*var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.clear();
			request.onsuccess = function ( event ) {

				callback();
			
			};*/
			
			fs.root.createReader().readEntries(function(results) {
			
				[].forEach.call(results, function(entry) {
				
					if (entry.isDirectory) {
						entry.removeRecursively(function() {}, onError);
					} else {
						entry.remove(function() {}, onError);
					}
					
				});
				
				if (callback) callback();
				
			}, onError);

		}

	}

};