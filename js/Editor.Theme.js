Editor.Theme = function ( editor ) {

	this.currentTheme = undefined;

	editor.signals.themeChanged.add( function ( value ) {
		
		console.log('load');
		$.ajax({
			url: 'js/themes/' + value + '.js',
			dataType: 'script',
			success: function() {
				
				console.log('theme loaded');
			
				//remove old theme
				if ( editor.theme.currentTheme ) editor.theme.currentTheme.remove();
				//assign the loaded script as current theme
				editor.theme.currentTheme = _lS;
				
				//execute the init function
				editor.theme.currentTheme.init();
				
				//decorate objects
				editor.scene.traverse( function( el ) {
					
					editor.theme.currentTheme.decorate( el );
					
				});
				
				editor.signals.sceneGraphChanged.dispatch();
				
			}
		}).done(function() {
			console.log('test2');
		}).fail(function(v1, v2, v3) {
			console.log(v1, v2, v3);
		});
		/*$.getScript( 'js/themes/' + value + '.js', function( data, textStatus, jqxhr ) {
		
			console.log( data, textStatus, jqxhr.status );
		
		});*/
		
		/*var request = new XMLHttpRequest();
		request.open('GET', 'js/themes/' + value + '.js', true);

		request.onload = function() {
		  if (this.status >= 200 && this.status < 400){
			
			// Success!
			console.log(this);
			var theme = JSON.parse(this.response);
			
			console.log('theme loaded');
			
			//remove old theme
			if ( editor.theme.currentTheme ) editor.theme.currentTheme.remove();
			
			//execute the init function
			theme.init();
			
			//decorate objects
			editor.scene.traverse( function( el ) {
				
				theme.decorate( el );
				
			});
			
			editor.theme.currentTheme = theme;
			
		  } else {
			// We reached our target server, but it returned an error
		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		};

		request.send();*/
		
	});

	
	// empty default theme to avoid conflicts
	this.currentTheme = {
		init: function() {},
		decorate: function( ) {},
		remove: function() {}
	};
};