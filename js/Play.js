var Play = function ( editor ) {

	//this.isGrabbing = false;
	
	this.effects = new Play.Effects();
	
	this.gestureDisplay = document.createElement( 'img' );
	this.gestureDisplay.id = 'gestureDisplay';
	this.gestureDisplay.src = 'images/gesture_open.png';
};

// what are the timeouts for certain actions? Are those timeouts only for certain triggers?
Play.prototype.actionTimeouts = {
	'Toss': 1000,
	'Play sound': {
		'Touch Fist': 1000,
		'Touch Point': 1000,
		'Touch Stroke': 1000,
		'Collision': 50
	}
}

Play.prototype.playAction = function ( object, eventIndex, args ) {
	var action = object.events[ eventIndex ].action;
	var triggerType = object.events[ eventIndex ].trigger.type;
	var timeout = typeof this.actionTimeouts[ action.type ] == 'object' ? this.actionTimeouts[ action.type ][ triggerType ] || 0 : this.actionTimeouts[ action.type ] || 0;
	
	if ( (object._eventsLastFired[ eventIndex ] || 0) + timeout > new Date().getTime() ) return;
	
	args = args || {};
	
	switch ( action.type ) {
		case 'Toss':
			//make it dynamic
			object.mass = object._originalMass;
			
			var multFactor = Math.max( -editor.scene._gravity.y, 1 ) * object.mass;
			object.applyCentralImpulse( new THREE.Vector3(
				action.x * multFactor, 
				action.y * multFactor,
				action.z * multFactor 
			));
			break;
		case 'Play sound':
			var speed = args.relative_velocity != undefined ? args.relative_velocity.length() : 1;
			if ( speed < 0.1 ) return;
				editor.soundCollection.playAttachedSound( action.sound, object, false );
		break;
		case 'Change Static':
			var mode = action.mode > 1 ? (object.isStatic ? 0 : 1) : action.mode;
			if ( mode == 0 && object.isStatic == true ) {
				object.mass = object._originalMass;
			} else if ( mode == 1 && object.isStatic == false ) {
				object._originalMass = object.mass;
				object.mass = 0;
			}
		break;
	}
	
	object._eventsLastFired[ eventIndex ] = new Date().getTime();
};

Play.prototype.start = function ( ) {

	this.createPlayerCharacter( 0xcccc44 );
	
	//https://github.com/mrdoob/three.js/issues/1239
	var aspect = viewport.dom.offsetWidth / viewport.dom.offsetHeight;
	var hFOV = Math.abs(2 * Math.atan( Math.tan( this._camera.fov / 2 ) * aspect ));
	this._widthMultiplier = 2 * Math.tan( ( hFOV / 2 ) );
	this._heightMultiplier = 2 * Math.tan( ( this._camera.fov / 2 ) );
	
	this._leapStreaming = false;
	this._currentGesture = 'stroke';
	
	viewport.dom.addEventListener('mousedown', this._mouseEvents.down);
	viewport.dom.addEventListener('mouseup', this._mouseEvents.up);
	
	this.startLeap();
	document.getElementById('menubar').appendChild( this.gestureDisplay );
	
	// analyser temp array
	this._analyserArray = new Uint8Array(512); //half fft count
	
	this._playTimeStart = (new Date()).getTime();
	
};

Play.prototype.stop = function ( ) {
		
	viewport.dom.removeEventListener('mousedown', this._mouseEvents.down);
	viewport.dom.removeEventListener('mouseup', this._mouseEvents.up);
	
	this.removePlayerCharacter();	
	this.stopLeap();
	
	document.getElementById('menubar').removeChild( this.gestureDisplay );
};

Play.prototype.createPlayerCharacter = function ( color ) {
	
	//create floating bright ball
	var radius = 0.07;
	var widthSegments = 16;
	var heightSegments = 16;

	var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
	var material = Physijs.createMaterial(
		new THREE.MeshBasicMaterial(),
		0.5,
		0.5
	);
	material.color.setHex( color );
	var mesh = new Physijs.SphereMesh( geometry, material, 0.01 );
	
	mesh.name = 'PlayerCharacter';
	
	var light = new THREE.PointLight( color, 2, 4 );
	mesh.add( light );
	
	mesh.position.set(0, -0.5, -10);
	mesh._physijs.collision_flags = 4;
	
	this._character = mesh;
	this._character._color = color;
		
	editor.scene.add( this._character );
	
	// we don't want it to turn and jump around
	mesh.setLinearFactor( new THREE.Vector3( 0, 0, 0 ) );
	mesh.setAngularFactor( new THREE.Vector3( 0, 0, 0 ) );
	mesh.setLinearVelocity( new THREE.Vector3( 0, 0, 0 ) );
	mesh.setAngularVelocity( new THREE.Vector3( 0, 0, 0 ) );
	
};

Play.prototype.removePlayerCharacter = function ( color ) {
	
	this._character.parent.remove( this._character );
	this._character.material.dispose();
	this._character.geometry.dispose();
	this._character = undefined;
	
};

Play.prototype.setLeapCamera = function ( el ) {
	/*if ( this._character && this._character.parent != undefined ) {
		this._character.parent.remove( this._character );
	}
	
	el.add( this._character );*/
	
	this._camera = el;
}

Play.prototype.grab = function ( ) {

	if ( !this.isGrabbing ) {
	
		this._character.material.color.multiplyScalar( 4 );
		this._character.children[0].intensity *= 2.5;
		this.isGrabbing = true;
		
	}
	
}

Play.prototype.release = function ( ) {

	if ( this.isGrabbing ) {
		
		this._character.material.color.setHex( this._character._color );
		this._character.children[0].intensity /= 2.5;
		this.isGrabbing = false;
	
	}

}

Play.prototype.startLeap = function ( ) {

	if ( !this._leapController ) {
	
		this._leapController = Leap.loop( { background: true }, {
			hand: function (hand) {
			
				// The Leap movements should take place according to screen dimensions, in order to fill the position range of the screen. The screen's left to right have to be "filled" by leap.
				// Approximate ranges: x = -210 to 210 to , y = 0 to 400, z = -230 to 230
				
				
				var zModifier = -400;
				
				var z = hand.palmPosition[2] + zModifier;
				z *= 1 + (Math.abs(hand.palmPosition[2] - 230) / 100); // increase z's range somewhat exponentially to allow more movement
				
				// scale y according to the character's z position. 320 and 4 are random tweaks.
				var y = editor.play._heightMultiplier * z * ((hand.palmPosition[1] - 220) / 400) * 4;
				
				var cameraCapturedWidth  = editor.play._widthMultiplier * -z;
				
				var xRatio = hand.palmPosition[0] / 180;
				//scale x too
				var x = hand.palmPosition[0] + xRatio * (cameraCapturedWidth - editor.play._widthMultiplier );
			
				var character = editor.play._character;
				if ( !character ) return;
				var newpos = new THREE.Vector3(x, y, z);
				newpos.multiplyScalar( 0.01 );
				newpos.applyMatrix4( editor.play._camera.matrixWorld );
				character.position.multiplyScalar( 0.6 ).add( newpos.multiplyScalar( 0.4 ) ); //linear interpolation
				//character.position = newpos;
				character.position.y = Math.max( character.position.y, 0.07 );
				
				
				// which gesture is it?
				
				var gestureType = 'stroke';	
				if (hand.confidence >= 0.4) {
					
					if ( hand.indexFinger.extended ) {
						
						// check whether only 1 finger is extended
						var extendedFingers = 0;
						hand.fingers.forEach( function( finger ) {
							if ( finger.extended ) extendedFingers++;
						} );
						
						if ( extendedFingers == 1 || extendedFingers == 2 ) {
							editor.play.gestureDisplay.src = 'images/gesture_point.png';
							gestureType = 'point';
						}						
						
					} 
					
					if ( gestureType == 'stroke' && hand.grabStrength > 0.8 ) {
						editor.play.gestureDisplay.src = 'images/gesture_fist.png';
						gestureType = 'grab';
					}
				
					if ( gestureType == 'stroke' ) editor.play.gestureDisplay.src = 'images/gesture_open.png';
					
					this._previousGesture = gestureType;
				} else {
					
					//assign previous gesture
					gestureType = this._previousGesture || 'stroke';
					
				}
				
				editor.play._currentGesture = gestureType;

			}
		});
		// these two LeapJS plugins, handHold and handEntry are available from leapjs-plugins, included above.
		// handHold provides hand.data
		// handEntry provides handFound/handLost events.
		this._leapController.use('handHold')
		.use('handEntry')
		.on('handFound', function(hand) {
			
			editor.play._leapStreaming = true;

			if ( editor.play._character != undefined ) {
				
				editor.play._character.visible = true;
				editor.play._character.children[0].visible = true;
				editor.play._character.mass = 0.01;
				
			}

		})
		.on('streamingStarted', function () {
			
			editor.play._leapStreaming = true;

			if ( editor.play._character != undefined ) {
				
				editor.play._character.visible = true;
				editor.play._character.children[0].visible = true;
				editor.play._character.mass = 0.01;
				
			}
			
		})
		.on('handLost', function(hand) {

			if ( editor.play._character != undefined && editor.play._character.parent ) {
				
				editor.play._character.visible = false;
				editor.play._character.children[0].visible = false;
				editor.play._character.mass = 0;
			
			}

		})
		.on('streamingStopped', function () {
			editor.play._leapStreaming = false;
		});
		
	}
	
	this._leapController.connect();

};

Play.prototype.stopLeap = function ( ) {
	
	//Disconnect leap from the web socket
	this._leapController.disconnect();
	
};

Play.prototype.preloadSounds = function ( object ) {

	for (var k in object) {
		if (object.hasOwnProperty( k )) {
			
			if ( k == 'sound' && object[ k ] != undefined ) {
				
				if ( editor.soundCollection._getSoundIndex( object[ k ]) == -1 ) editor.soundCollection.add( object[ k ] );
			
			} else if ( typeof object[ k ] == 'object' ) {
				editor.play.preloadSounds( object[ k ]);
			}
			
		}
	}	
	

};

Play.prototype._playLoop = function ( delta ) {

	this._delta = delta;

	if ( !this._leapStreaming ) {
		
		// calculate the ball position to be in front of the camera
		this._character.position.set(0, 0, -5);
		this._character.position.applyMatrix4( editor.play._camera.matrixWorld );
		
	}

	this._character.__dirtyPosition = true;
	
	
	
	var touches = this._character._physijs.touches;
				
	var touchesGrabCheck = this._previousTouches || [];
	this._previousTouches = touches.slice(0);
	
	
	//console.log('touches', touches.length);
	
	// loop through all touched objects and assign touch events
	var obj;
	for (var x = 0; x < touches.length; x++) {
		
		obj = editor.scene._objects[ touches[ x ] ];
		if ( obj[ this._currentGesture ] !== undefined ) {
			obj[ this._currentGesture ]();
			
			var previousGrabIndex = touchesGrabCheck.indexOf( touches[ x ] );
			if ( previousGrabIndex >= 0 ) {
				touchesGrabCheck[ previousGrabIndex ] = -1;
			}
		}
	
	}
	
	// loop through the touches and try to find objects which were left i.e. aren't touched anymore
	for (var x = 0; x < touchesGrabCheck.length; x++) {
	
		if ( touchesGrabCheck[ x ] == -1 || !editor.scene._objects[ touchesGrabCheck[ x ] ] ) continue;
		
		editor.scene._objects[ touchesGrabCheck[ x ] ].release();
	
	}
	
	
	
	// loop through each type
	for (var type in this._timeBasedActionsCollection) {
		if (this._timeBasedActionsCollection.hasOwnProperty( type )) {
			
			if ( this._timeBasedActionsCollection[ type ] !== undefined ) {
				for (var x = 0; x < this._timeBasedActionsCollection[ type ].length; x++) {
				
					var rm = this._timeBasedActionsCollection[ type ][ x ];
					var scale = this.runtimeMaterials.getTriggerValue( type, rm[0], rm[1] );
					this.runtimeMaterials.apply( scale, rm[0].action, rm[1] );
					
				}
			}
		}
	}
	
	

};

Play.prototype.runtimeMaterials = {

	// get a value from 0 to 1 indicating the scale for a certain trigger
	getTriggerValue: function( type, args, object ) {
		var val = 0;
		
		switch( type ) {
			case 'Time':
				var easing = (args && args.easing) || 'none';
				var duration = 1000;
				var time = editor.play.getTime();
				val = editor.play.effects.easing[ easing ]( time % duration, 1, duration );
				if ( (time / duration) % 2 >= 1 ) val = 1 - val;
				break;
				
			case 'Amplitude':				
				var array = editor.play._analyserArray; //reuse array to avoid tons of garbage collection
				if ( !object._analyser ) editor.play.Audio.attachAnalyser( object );
				
				if ( object._analyser ) {
					object._analyser.getByteFrequencyData(array);
					var average = editor.play.Audio.getAverageVolume(array);
					val = average / 15; //TODO: Don't use fixed value, instead calc max per sound
				}
				
				break;
		}
		
		return Math.min(Math.max( val , 0), 1);
		
	},
	
	// apply a runtime material change with a certain value (from 0 to 1) to the provided object
	apply: function( scale, args, object ) {
		
		switch( args.type ) {
			case 'Brightness':
				if (!object._origColor) {
					object._origColor = object.material.color.clone();
				}
				if (!object._brightnessScale) object._brightnessScale = 1 - Math.max( object._origColor.r, object._origColor.g, object._origColor.b, 0.2 );
				var delta = object._brightnessScale * scale;
				object.material.color.setRGB( object._origColor.r + delta, object._origColor.g + delta, object._origColor.b + delta );
				break;
			case 'Color':
				if (!object._origColor) {
					object._origColor = object.material.color.clone();
				}
				if (!object._colorDelta) {
					object._colorDelta = new THREE.Color( args.color );
					object._colorDelta.r -= object._origColor.r;
					object._colorDelta.g -= object._origColor.g;
					object._colorDelta.b -= object._origColor.b;
				}
				object.material.color.setRGB( object._origColor.r + object._colorDelta.r * scale, object._origColor.g + object._colorDelta.g * scale, object._origColor.b + object._colorDelta.b * scale );
				break;
		}
	
	}
	
};

Play.prototype.Audio = {
	attachAnalyser: function( object ) {
		if ( !object._panner ) return false;
	
		// analyser
		object._analyser = editor.soundCollection._context.createAnalyser();
		object._analyser.smoothingTimeConstant = 0.3;
		object._analyser.fftSize = 1024;
		object._panner.connect( object._analyser );
		//object._analyser.connect( object._panner );
		//object._analyser.connect(editor.soundCollection._context.destination);
		//editor.soundCollection._lineOut.destination.connect( this._analyser );
		return true;
		
	},
	getAverageVolume: function(array) {
		var values = 0;
		var average;

		var length = array.length;

		// get all the frequency amplitudes
		for (var i = 0; i < length; i++) {
			values += array[i];
		}

		average = values / length;
		return average;
	}
};

Play.prototype._mouseEvents = {
	down: function( event ) {
		
		if ( event.which == 1 ) {
		
			editor.play._currentGesture = 'point';
		
		} else if ( event.which == 3 ) {
			
			editor.play._currentGesture = 'grab';
			
		}
	
	},
	up: function( event ) {
					
		editor.play._currentGesture = 'stroke';
	
	}
};

Play.prototype.getTime = function() {
	return (new Date()).getTime() - this._playTimeStart;
}