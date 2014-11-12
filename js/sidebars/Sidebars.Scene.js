Sidebars.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	$("<h2/>").html("Scene").appendTo(container.dom);

	var outliner = new UI.FancySelect().setId( 'outliner' );
	outliner.onChange( function () {

		editor.selectById( parseInt( outliner.getValue() ) );

	} );
	container.add( outliner );

	// events

	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var sceneType = editor.getObjectType( scene );

		var options = [];

		options.push( { value: scene.id, html: '<span class="type ' + sceneType + '"></span> ' + scene.name } );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];
				
				if ( editor.omittedObjects.indexOf( object.name ) === -1 ) {
				
					var objectType = editor.getObjectType( object );

					var html = pad + '<span class="type ' + objectType + '"></span> ' + object.name;
					
					html += ' <span class="icon-dupli-small"></span>';
					html += ' <span class="icon-del-small"></span>';

					/*if ( object instanceof THREE.Mesh ) {

						var geometry = object.geometry;
						var material = object.material;

						var geometryType = editor.getGeometryType( geometry );
						var materialType = editor.getMaterialType( material );

						html += ' <span class="type ' + geometryType + '"></span> ' + geometry.name;
						html += ' <span class="type ' + materialType + '"></span> ' + material.name;

					}*/

					options.push( { value: object.id, html: html } );

					addObjects( object.children, pad + '&nbsp;&nbsp;&nbsp;' );
				
				}

			}

		} )( scene.children, '&nbsp;&nbsp;&nbsp;' );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}
		
		for ( var x = 0; x < options.length; x++ ) {
			var child = $(outliner.dom.children[ x ]);
			var duplicateBtn = child.find('.icon-dupli-small');
			var deleteBtn = child.find('.icon-del-small');
			
			if ( duplicateBtn.length > 0 ) $( duplicateBtn[0] ).click( function ( el ) {
				
				var object = editor.scene.getObjectById( this.valueOf(), true );

				if ( object.parent === undefined ) return; // avoid cloning the camera or scene

				var clone = object.clone();
				clone.material = clone.material.clone();

				editor.addObject( clone );
				editor.select( clone );
				
			}.bind(options[ x ].value));
			
			if ( deleteBtn.length > 0 ) $( deleteBtn[0] ).click( function ( el ) {
			
				var object = editor.scene.getObjectById( this.valueOf(), true );

				var parent = object.parent;
				editor.removeObject( object );
				editor.select( parent );
				
			}.bind(options[ x ].value));
		}

	} );

	signals.objectSelected.add( function ( object ) {

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

}
