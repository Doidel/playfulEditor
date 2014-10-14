var Tools = function ( editor ) {

	var container = new UI.Panel();

	container.add( new Tools.Modes( editor ) );
	container.add( new Tools.View( editor ) );
	container.add( new Tools.Menu( editor ) );

	return container;

}
