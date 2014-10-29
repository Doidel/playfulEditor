var Sidebars = function ( editor ) {

	var container = new UI.Panel();

	var leftSidebar = new UI.Panel().setClass("sidebar left");
	var rightSidebar = new UI.Panel().setClass("sidebar right");
	
	//rightSidebar.add( new Sidebars.Renderer( editor ) );
	rightSidebar.add( new Sidebars.Scene( editor ) );
	rightSidebar.add( new Sidebars.Properties( editor ) );
	
	container.add(leftSidebar);
	container.add(rightSidebar);
	return container;
}