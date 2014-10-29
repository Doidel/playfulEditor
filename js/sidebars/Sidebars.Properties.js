Sidebars.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	$("<h2/>").html("Properties").appendTo(container.dom);
	var properties = new UI.Panel();
	
	properties.add( new Sidebars.Properties.Events( editor ) );
	properties.add( new Sidebars.Properties.Object3D( editor ) );
	properties.add( new Sidebars.Properties.Geometry( editor ) );
	properties.add( new Sidebars.Properties.Physics( editor ) );
	properties.add( new Sidebars.Properties.Material( editor ) );
	properties.add( new Sidebars.Properties.Animation( editor ) );
	properties.add( new Sidebars.Properties.Scene( editor ) );

	container.add(properties);
	return container;
}
