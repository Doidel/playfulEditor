Sidebars.Add = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	$("<h2/>").html("Add Object").appendTo(container.dom);
	var addmenu = new UI.Panel();
	
	// TODO
	// addmenu.add( new Sidebar.Events( editor ) );
	
	container.add(addmenu);
	return container;
}
