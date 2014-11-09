Sidebars.Properties.AdvancedSwitch = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass("Panel advancedSwitch")
	// container.setDisplay( 'none' );
	
	var switchButton = $("<a/>").attr("href","#switchMode").addClass("switchButton");
	
	var advMode = false;
	var switchMode = function(advanced)
	{
		if(advanced===false || (advanced===undefined && advMode))
		{
			// Switch to easy
			advMode = false;
			switchButton
				.removeClass("advanced icon-open-small").addClass("easy icon-closed-small")
				.html("Show advanced settings");
		}
		else
		{
			// Switch to advanced
			advMode = true;
			switchButton
				.removeClass("easy icon-closed-small").addClass("advanced icon-open-small")
				.html("Hide advanced settings");
		}
	};
	switchMode(false);
	
	switchButton.on("click",function(e) { e.preventDefault(); switchMode() });		
	
	switchButton.appendTo(container.dom);
	
	return container;
}