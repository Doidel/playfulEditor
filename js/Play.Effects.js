Play.Effects = function ( ) {

	this._glowMaterial = new THREE.ShaderMaterial({
	    uniforms: 
		{ 
			"c":   { type: "f", value: 0.05 },
			"p":   { type: "f", value: 4.5 },
			glowColor: { type: "c", value: new THREE.Color(0xffff00) },
			viewVector: { type: "v3", value: null }
		},
		vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	});

};

Play.Effects.prototype.displayGestureType = function ( type ) {

	editor.play._character.material.color.setHex( this.gestureColors[ type ] );
	editor.play._character.children[0].color.setHex( this.gestureColors[ type ] );
	editor.play.gestureDisplay.src = 'images/gesture_' + type + '.png';

};

Play.Effects.prototype.gestureColors = {
	'stroke': 0xd7d23c,
	'point': 0xdcb946,
	'grab': 0xb4c846
};


//DEPRECATED
Play.Effects.prototype.glow = function ( element ) {

	if ( element._glow == undefined ) {
		var mat = this._glowMaterial.clone();
		mat.uniforms.viewVector.value = editor.play._camera.parent.parent.position;

		var glow = new THREE.Mesh( element.geometry.clone(), mat );
		//glow.position = element.position;
		//glow.rotation = element.rotation;
		glow.scale.multiplyScalar(1.2);
		element.parent.add( glow );
		//element.add( glow );
		
		element._glow = glow;
	}
	
};

Play.Effects.prototype.removeGlow = function ( element ) {
	
	if ( element._glow != undefined ) {
		
		element.parent.remove( element._glow );
		element._glow.material.dispose();
		element._glow.geometry.dispose();
		element._glow = undefined;
		
	}
	
};

Play.Effects.prototype.easing = {
	// Easing equations converted from AS to JS from original source at
	// http://robertpenner.com/easing/
	// t: current time, c: change in value, d: duration
	none: function(t, c, d) {
		return c*t/d;
	},
	inQuad: function(t, c, d) {
		return c*(t/=d)*t;
	},
	outQuad: function(t, c, d) {
		return -c *(t/=d)*(t-2);
	},
	inOutQuad: function(t, c, d) {
		if((t/=d/2) < 1) { return c/2*t*t; }
		return -c/2 *((--t)*(t-2) - 1);
	},
	inCubic: function(t, c, d) {
		return c*(t/=d)*t*t;
	},
	outCubic: function(t, c, d) {
		return c*((t=t/d-1)*t*t + 1);
	},
	inOutCubic: function(t, c, d) {
		if((t/=d/2) < 1) { return c/2*t*t*t; }
		return c/2*((t-=2)*t*t + 2);
	},
	outInCubic: function(t, c, d) {
		if(t < d/2) { return this.outCubic(t*2, c/2, d); }
		return this.inCubic((t*2)-d, c/2, c/2, d);
	},
	inQuart: function(t, c, d) {
		return c*(t/=d)*t*t*t;
	},
	outQuart: function(t, c, d) {
		return -c *((t=t/d-1)*t*t*t - 1);
	},
	inOutQuart: function(t, c, d) {
		if((t/=d/2) < 1) { return c/2*t*t*t*t; }
		return -c/2 *((t-=2)*t*t*t - 2);
	},
	outInQuart: function(t, c, d) {
		if(t < d/2) { return this.outQuart(t*2, c/2, d); }
		return this.inQuart((t*2)-d, c/2, c/2, d);
	},
	inQuint: function(t, c, d) {
		return c*(t/=d)*t*t*t*t;
	},
	outQuint: function(t, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1);
	},
	inOutQuint: function(t, c, d) {
		if((t/=d/2) < 1) { return c/2*t*t*t*t*t; }
		return c/2*((t-=2)*t*t*t*t + 2);
	},
	outInQuint: function(t, c, d) {
		if(t < d/2) { return this.outQuint(t*2, c/2, d); }
		return this.inQuint((t*2)-d, c/2, c/2, d);
	},
	inSine: function(t, c, d) {
		return -c * Math.cos(t/d *(Math.PI/2)) + c;
	},
	outSine: function(t, c, d) {
		return c * Math.sin(t/d *(Math.PI/2));
	},
	inOutSine: function(t, c, d) {
		return -c/2 *(Math.cos(Math.PI*t/d) - 1);
	},
	outInSine: function(t, c, d) {
		if(t < d/2) { return this.outSine(t*2, c/2, d); }
		return this.inSine((t*2)-d, c/2, c/2, d);
	},
	inExpo: function(t, c, d) {
		return(t === 0) ? 0 : c * Math.pow(2, 10 *(t/d - 1)) - c * 0.001;
	},
	outExpo: function(t, c, d) {
		return(t === d) ? c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1);
	},
	inOutExpo: function(t, c, d) {
		if(t === 0) { return 0; }
		if(t === d) { return c; }
		if((t/=d/2) < 1) { return c/2 * Math.pow(2, 10 *(t - 1)) - c * 0.0005; }
		return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2);
	},
	outInExpo: function(t, c, d) {
		if(t < d/2) { return this.outExpo(t*2, c/2, d); }
		return this.inExpo((t*2)-d, c/2, c/2, d);
	},
	inCirc: function(t, c, d) {
		return -c *(Math.sqrt(1 -(t/=d)*t) - 1);
	},
	outCirc: function(t, c, d) {
		return c * Math.sqrt(1 -(t=t/d-1)*t);
	},
	inOutCirc: function(t, c, d) {
		if((t/=d/2) < 1) { return -c/2 *(Math.sqrt(1 - t*t) - 1); }
		return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1);
	},
	outInCirc: function(t, c, d) {
		if(t < d/2) { return this.outCirc(t*2, c/2, d); }
		return this.inCirc((t*2)-d, c/2, c/2, d);
	},
	inElastic: function(t, c, d, a, p) {
		var s;
		if(t===0) {return 0;}
		if((t/=d)===1) { return c; }
		if(!p) { p=d*0.3; }
		if(!a || a < Math.abs(c)) { a=c; s=p/4; } else { s = p/(2*Math.PI) * Math.asin(c/a); }
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p ));
	},
	outElastic: function(t, c, d, a, p) {
		var s;
		if(t===0) { return 0; }
		if((t/=d)===1) { return c; }
		if(!p) { p=d*0.3; }
		if(!a || a < Math.abs(c)) { a=c; s=p/4; } else { s = p/(2*Math.PI) * Math.asin(c/a); }
		return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c);
	},
	inOutElastic: function(t, c, d, a, p) {
		var s;
		if(t===0) { return 0; }
		if((t/=d/2)===2) { return c; }
		if(!p) { p=d*(0.3*1.5); }
		if(!a || a < Math.abs(c)) { a=c; s=p/4; } else { s = p/(2*Math.PI) * Math.asin(c/a); }
		if(t < 1) { return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p)); }
		return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*0.5 + c;
	},
	outInElastic: function(t, c, d, a, p) {
		if(t < d/2) { return this.outElastic(t*2, c/2, d, a, p); }
		return this.inElastic((t*2)-d, c/2, c/2, d, a, p);
	},
	inBack: function(t, c, d, s) {
		if(s === undefined) { s = 1.70158; }
		return c*(t/=d)*t*((s+1)*t - s);
	},
	outBack: function(t, c, d, s) {
		if(s === undefined) { s = 1.70158; }
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1);
	},
	inOutBack: function(t, c, d, s) {
		if(s === undefined) { s = 1.70158; }
		if((t/=d/2) < 1) { return c/2*(t*t*(((s*=(1.525))+1)*t - s)); }
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
	},
	outInBack: function(t, c, d, s) {
		if(t < d/2) { return this.outBack(t*2, c/2, d, s); }
		return this.inBack((t*2)-d, c/2, c/2, d, s);
	},
	inBounce: function(t, c, d) {
		return c - this.outBounce(d-t, 0, c, d);
	},
	outBounce: function(t, c, d) {
		if((t/=d) <(1/2.75)) {
			return c*(7.5625*t*t);
		} else if(t <(2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75);
		} else if(t <(2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375);
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375);
		}
	},
	inOutBounce: function(t, c, d) {
		if(t < d/2) {
			return this.inBounce(t*2, 0, c, d) * 0.5;
		} else {
			return this.outBounce(t*2-d, 0, c, d) * 0.5 + c*0.5;
		}
	},
	outInBounce: function(t, c, d) {
		if(t < d/2) { return this.outBounce(t*2, c/2, d); }
		return this.inBounce((t*2)-d, c/2, c/2, d);
	}
};