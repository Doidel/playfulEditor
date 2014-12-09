// TODO: Implement behavior of all prefabs. They would be selectable checkboxes, combineable.
Sidebars.Properties.Behaviors = function ( editor ) {

	var signals = editor.signals;
	
	var objectSelected = undefined;
	var physijsSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	container.setClass("Panel advanced");
	
	$("<h3/>",{ html: "Behaviours" }).appendTo( container.dom );

	
	// rocket

	var rocketRow = new UI.Panel();
	var rocket = new UI.Behavior( 'Rocket' ).onChange( update );
	//rocket.setProperties( '' );

	rocketRow.add( rocket );

	container.add( rocketRow );

	
	// resurrection

	var resurrectionRow = new UI.Panel();
	var resurrection = new UI.Behavior( 'Resurrection' ).onChange( update );
	
	var resurrectionPropertiesPanel = new UI.Panel();
	resurrectionPropertiesPanel.add( new UI.Text('Activator').setWidth('90px') );
	var resurrectionPropertiesActivator = new UI.Select().setOptions({ 'collision':'Collision' }).setWidth('150px').onChange( resurrection.fireChange );
	resurrectionPropertiesPanel.add( resurrectionPropertiesActivator );
	resurrectionPropertiesPanel.add( new UI.Text('Delay (sec)').setWidth('90px') );
	var resurrectionPropertiesDelay = new UI.Number( 0.5 ).setRange(0, 10000).onChange( resurrection.fireChange );
	resurrectionPropertiesPanel.add( resurrectionPropertiesDelay );
	resurrection.setPropertiesDOM( resurrectionPropertiesPanel.dom );
	
	resurrection.setProperties = function ( properties ) {
	
		resurrectionPropertiesActivator.setValue( properties.activator );
		resurrectionPropertiesDelay.setValue( properties.delay );
		
	};
	resurrection.getProperties = function (  ) {
		
		return { activator: resurrectionPropertiesActivator.getValue(), delay: resurrectionPropertiesDelay.getValue() };
		
	};

	resurrectionRow.add( resurrection );

	container.add( resurrectionRow );
	
	//
	
	var behaviorList = {
		'rocket': rocket,
		'resurrection': resurrection
	}
	
	function update() {
		
		if ( objectSelected ) {
		
			var object = objectSelected;
		
			var behaviors = {};
			
			for ( var behavior in behaviorList ) {
				
				if ( behaviorList[ behavior ].getValue() ) behaviors[ behavior ] = behaviorList[ behavior ].getProperties() || 1; // need the 1 in order to have the JSON export it...
				
			}
			
			// assign behaviors to the object
			object.behaviors = behaviors;
			
			signals.objectChanged.dispatch( object );
			
		}

	};

	// 1 = visible in easy mode, 2 = visible in advanced mode, not part of this list = visible in both modes
	/*var propertyVisibilities = {
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

	};*/
	
	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material && object.material._physijs ) {
		
			objectSelected = object;

			container.setDisplay( '' );

			var behaviors = object.behaviors || {};
			var keys = Object.keys( behaviors );
			
			// init all values
			for ( var behavior in behaviorList ) {
				
				if ( keys.indexOf( behavior ) > -1 ) {
					behaviorList[ behavior ].setValue( true );
					behaviorList[ behavior ].setProperties( behaviors[ behavior ] );
				} else {
					behaviorList[ behavior ].setValue( false );
				}
				
			}
			
			//updateRows();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
