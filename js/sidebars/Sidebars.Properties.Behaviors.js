// TODO: Implement behavior of all prefabs. They would be selectable checkboxes, combineable.
Sidebars.Properties.Behaviors = function ( editor ) {

	var signals = editor.signals;
	
	var objectSelected = undefined;
	var physijsSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	//container.dom.classList.add( 'Material' );

	container.add( new UI.Text( 'BEHAVIORS' ) );
	container.add( new UI.Break(), new UI.Break() );

	// friction

	var physicsFrictionRow = new UI.Panel();
	var physicsFriction = new UI.Number( 0.5 ).setRange( 0, 1 ).onChange( update );

	physicsFrictionRow.add( new UI.Text( 'Friction' ).setWidth( '90px' ) );
	physicsFrictionRow.add( physicsFriction );

	container.add( physicsFrictionRow );

	// restitution

	var physicsRestitutionRow = new UI.Panel();
	var physicsRestitution = new UI.Number( 0.5 ).setRange( 0, 1 ).onChange( update );

	physicsRestitutionRow.add( new UI.Text( 'Bounciness' ).setWidth( '90px' ) );
	physicsRestitutionRow.add( physicsRestitution );

	container.add( physicsRestitutionRow );

	// static or dynamic

	var physicsModeRow = new UI.Panel();
	var physicsMode = new UI.Checkbox( false ).onChange( update );

	physicsModeRow.add( new UI.Text( 'Static' ).setWidth( '90px' ) );
	physicsModeRow.add( physicsMode );

	container.add( physicsModeRow );
	
	//

	function update() {
		
			var physics = physijsSelected;

			if ( physics ) {
			
				physics.friction = physicsFriction.getValue();

				physics.restitution = physicsRestitution.getValue();

				objectSelected.isStatic = physicsMode.getValue();

			}

	};

	// 1 = visible in easy mode, 2 = visible in advanced mode, not part of this list = visible in both modes
	var propertyVisibilities = {
		'friction': 2,
		'restitution': 2
	};
	
	function updateRows() {

		var properties = {
			'friction': physicsFrictionRow,
			'restitution': physicsRestitutionRow,
			'mode': physicsModeRow
		};
		
		var object = editor.selected;

		for ( var property in properties ) {
		
			var visible = (workMode == 'advanced' && propertyVisibilities[ property ] == 2) || ( workMode == 'easy' && propertyVisibilities[ property ] == 1 ) || propertyVisibilities[ property ] == undefined;
			properties[ property ].setDisplay( visible ? '' : 'none' );

		}

	};
	
	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material && object.material._physijs ) {
		
			objectSelected = object;
			physijsSelected = object.material._physijs;

			container.setDisplay( '' );

			var physics = object.material._physijs;
			
			if ( physics.friction === undefined ) physics.friction = 0.5;
			physicsFriction.setValue( physics.friction );
			
			if ( physics.restitution === undefined ) physics.restitution = 0.5;
			physicsRestitution.setValue( physics.restitution );
			
			if ( object.isStatic == undefined ) object.isStatic = false;
			physicsMode.setValue( object.isStatic );
			
			updateRows();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
