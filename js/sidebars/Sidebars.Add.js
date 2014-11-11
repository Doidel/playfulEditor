Sidebars.Add = function ( editor ) {

	var signals = editor.signals;
	var sidebarAddHelper = new Sidebars.Add.Helper( editor );

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("Add Object").appendTo(container.dom);
	var addmenu = new UI.Panel();
	
	// Create a button for each object
	var cube = $("<a/>").append('<img src="images/objects/cube.png" />').on("click",function(e) { sidebarAddHelper.Cube( editor ) });
	var sphere = $("<a/>").append('<img src="images/objects/sphere.png" />').on("click",function(e) { sidebarAddHelper.Sphere( editor ) });
	var cylinder = $("<a/>").append('<img src="images/objects/cylinder.png" />').on("click",function(e) { sidebarAddHelper.Cylinder( editor ) });
	var onion = $("<a/>").append('<img src="images/objects/onion.png" />').on("click",function(e) { sidebarAddHelper.Sphere( editor ) });

	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu object")
		.append( $("<li/>").html(cube) )
		.append( $("<li/>").html(sphere) )
		.append( $("<li/>").html(cylinder) )
		.append( $("<li/>").html(onion) )
		.append( $("<li/>").html(onion) )
		.appendTo(addmenu.dom);
	
	container.add(addmenu);
	
	signals.menuButtonClicked.add( function(name) {
		if(name=="add")
		{
			// Show this sidebar panel when add menu button is clicked
			$(container.dom).toggle(200);
		}
		else {
			$(container.dom).hide()
		}
	});
	
	return container;
}
