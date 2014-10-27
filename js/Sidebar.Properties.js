Sidebar.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	$("<h2/>").html("Properties").appendTo(container.dom);
	var properties = new UI.Panel();
	
	properties.add( new Sidebar.Events( editor ) );
	properties.add( new Sidebar.Object3D( editor ) );
	properties.add( new Sidebar.Geometry( editor ) );
	properties.add( new Sidebar.Physics( editor ) );
	properties.add( new Sidebar.Material( editor ) );
	properties.add( new Sidebar.Animation( editor ) );
	properties.add( new Sidebar.SceneProperties( editor ) );

	container.add(properties);
	return container;
}
