Sidebars.Properties.AdvancedSwitch = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass("Panel advancedSwitch")
	// container.setDisplay( 'none' );
	
	var switchButton = $("<a/>").attr("href","#switchMode").addClass("switchButton");
	
	var switchMode = function(advanced)
	{
		if ( advanced === false || ( advanced === undefined && workMode == 'advanced' ) )
		{
			// Switch to easy
			workMode = 'easy';
			switchButton
				.removeClass("advanced icon-open-small").addClass("easy icon-closed-small")
				.html("Show advanced settings");
		}
		else
		{
			// Switch to advanced
			workMode = 'advanced';
			switchButton
				.removeClass("easy icon-closed-small").addClass("advanced icon-open-small")
				.html("Hide advanced settings");
		}
		
		editor.signals.objectSelected.dispatch( editor.selected );
	};
	switchMode( false );
	
	switchButton.on( "click", function(e) { e.preventDefault(); switchMode(); } );		
	
	switchButton.appendTo( container.dom );
	
	return container;
}