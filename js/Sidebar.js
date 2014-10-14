var Sidebar = function ( editor ) {

	var container = new UI.Panel();

	//container.add( new Sidebar.Renderer( editor ) );
	container.add( new Sidebar.Scene( editor ) );
	container.add( new Sidebar.Properties( editor ) );
	/*
	
	*/
	return container;

}
