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

					if ( object instanceof THREE.Mesh ) {

						var geometry = object.geometry;
						var material = object.material;

						var geometryType = editor.getGeometryType( geometry );
						var materialType = editor.getMaterialType( material );

						html += ' <span class="type ' + geometryType + '"></span> ' + geometry.name;
						html += ' <span class="type ' + materialType + '"></span> ' + material.name;

					}

					options.push( { value: object.id, html: html } );

					addObjects( object.children, pad + '&nbsp;&nbsp;&nbsp;' );
				
				}

			}

		} )( scene.children, '&nbsp;&nbsp;&nbsp;' );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}

	} );

	signals.objectSelected.add( function ( object ) {

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

}
