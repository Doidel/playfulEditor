Sidebars.Properties.Physics = function ( editor ) {

	var signals = editor.signals;
	
	var objectSelected = undefined;
	var physijsSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	container.setClass("Panel advanced");
	
	$("<h3/>",{ html: "Physics" }).appendTo( container.dom );

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

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
