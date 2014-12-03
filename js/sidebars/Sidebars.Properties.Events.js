Sidebars.Properties.Events = function ( editor ) {

	var signals = editor.signals;
	
	var objectSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	//container.dom.classList.add( 'Material' );

	$("<h3/>",{ html: "Events" }).appendTo( container.dom );

	// event list

	var eventListRow = new UI.Panel();
	var eventList = new UI.EventList(  ).onChange( update );
	
	eventListRow.add( eventList );

	container.add( eventListRow );

	//

	function update( ) {
		
		objectSelected.events = eventList.getValue();
		
		if ( objectSelected._egh ) editor.setEdge( objectSelected, !objectSelected.events ? 3 : objectSelected.events.length );

	};

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object._physijs ) {
		
			objectSelected = object;

			container.setDisplay( '' );
			
			eventList.setValue( object.events );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
