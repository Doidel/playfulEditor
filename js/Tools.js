var Tools = function ( editor ) {

	var container = new UI.Panel();
	
	container.modes = new Tools.Modes( editor );
	container.add( container.modes );
	
	container.view = new Tools.View( editor );
	container.add( container.view );
	
	container.menu = new Tools.Menu( editor );
	container.add( container.menu );

	return container;

}
