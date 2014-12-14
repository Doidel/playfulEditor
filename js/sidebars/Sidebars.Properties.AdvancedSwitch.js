Sidebars.Properties.AdvancedSwitch = function ( editor, propertiesContainer ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass("Panel advancedSwitch");
	container.setDisplay( 'none' );
	
	var switchButton = $("<a/>").attr("href","#switchMode").addClass("switchButton");
	
	var switchMode = function(advanced)
	{
		if ( advanced === false || ( advanced === undefined && workMode == 'advanced' ) )
		{
			// Switch to easy
			workMode = 'easy';
			$(propertiesContainer.dom).removeClass("advancedMode").addClass("easyMode");
			console.log( $(propertiesContainer) );
			switchButton
				.removeClass("advanced icon-open-small").addClass("easy icon-closed-small")
				.html("Show advanced settings");
		}
		else
		{
			// Switch to advanced
			workMode = 'advanced';
			$(propertiesContainer.dom).removeClass("easyMode").addClass("advancedMode");
			console.log( $(propertiesContainer) );
			switchButton
				.removeClass("easy icon-closed-small").addClass("advanced icon-open-small")
				.html("Hide advanced settings");
		}
		
		editor.signals.objectSelected.dispatch( editor.selected );
	};
	switchMode( false );
	
	switchButton.on( "click", function(e) { e.preventDefault(); switchMode(); } );		
	switchButton.appendTo( container.dom );
	
	signals.objectSelected.add( function ( object ) {

		container.setDisplay( object ? '' : 'none' );

	} );
	
	return container;
}