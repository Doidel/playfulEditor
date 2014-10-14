UI.MenubarHelper = {

	createMenuContainer: function ( name, optionsPanel ) {

		var container = new UI.Panel();
		var title = new UI.Panel();

		title.setTextContent( name );
		title.setMargin( '0px' );
		title.setPadding( '8px' );

		container.setClass( 'menu' );
		container.add( title );
		container.add( optionsPanel );

		return container;

	},
	
	createOption: function ( name, callbackHandler ) {

		var option = new UI.Panel();
		option.setClass( 'option' );
		option.setTextContent( name );
		option.onClick( callbackHandler );

		return option;

	},

	createOptionsPanel: function ( menuConfig ) {

		var options = new UI.Panel();
		options.setClass( 'options' );

		menuConfig.forEach(function(option) {
			options.add(option);
		});

		return options;

	},

	createDivider: function () {

		return new UI.HorizontalRule();

	}

};

UI.ButtonHelper = {

	createButtonPanel: function ( name ) {

		var container = new UI.Panel();
		container.setClass( 'buttongroup' );
		container.setId( name );
		
		container.addButton = function ( styleclass, callbackHandler ) {
	
			var button = document.createElement( 'a' );
			button.className = 'button '+styleclass;
			button.addEventListener( 'click', callbackHandler );
				
			container.dom.appendChild( button );
		};

		return container;

	}

};
