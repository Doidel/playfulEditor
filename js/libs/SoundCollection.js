/**
* Class for creating an artwork cluster in space
**/
var SoundCollection = function(options){
		
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    this._context = new AudioContext();
    this._loaderContext = new OfflineAudioContext(2, 1024, 44100); //22050 to 96000, CD = 44100
		
    this._listenerUpdater = new WebAudiox.ListenerObject3DUpdater(this._context, options.cam);
		
		
    // Create lineOut
    this._lineOut = new WebAudiox.LineOut(this._context);
    this._lineOut.volume = 1;
};
	
SoundCollection.prototype = {
	//class options, set by the constructor or left default
	options: {
		cam: undefined
	},
	
	_soundCollection: {
		soundUrl: [],
		//panner: [],
		pannerUpdaters: [],
		buffer: [],
		source: [] //optional, filled when the sound is currently playing
	},
	
    /**
     * Adds a sound to the collection
     * @param sound The sound url
     */
	add: function(sound, callback) {		
		var soundListIndex = this._findEmptySpotInSoundList();
		//reserve spot so no overwrites will happen
		if (soundListIndex != -1) this._soundCollection.soundUrl[soundListIndex] = 'reserved';
		
		WebAudiox.loadBuffer(this._loaderContext, sound, function(buffer){
			
			if (soundListIndex == -1) {
				soundListIndex = this._soundCollection.soundUrl.push( sound ) - 1;
				//this._soundCollection.panner.push( panner );
				this._soundCollection.buffer.push( buffer );
			} else {
				this._soundCollection.soundUrl[soundListIndex] = sound;
				//this._soundCollection.panner[soundListIndex] = panner;
				this._soundCollection.buffer[soundListIndex] = buffer;
			}
			
			if (callback) callback(buffer);
			
		}.bind(this));
	},
	
	remove: function(sound) {
		var index = this._getSoundIndex(sound);
		if (index != -1) {
			this.stop(sound);
			delete this._soundCollection.soundUrl[index];
			delete this._soundCollection.panner[index];
			delete this._soundCollection.buffer[index];
			//delete this._soundCollection.source[index];
		}
	},
	
	play: function(sound /* Can be URL, panner or source */, object3d, offset, endedCallback) {
		var playInitialized = 0;
		if (sound) {
			playInitialized++;
			var soundIndex = this._getSoundIndex(sound);
			if (soundIndex != -1) {
				playInitialized++;
				var buffer = this._soundCollection.buffer[soundIndex];
				if (buffer != undefined) {
					//loaded the sound source, start playing
					
					// init AudioBufferSourceNode
					var source = this._context.createBufferSource();
					source.buffer = buffer;
					source.loop	= true;
					source.connect(this._lineOut.destination);
					if (endedCallback) source.onended = endedCallback;
					
					source.start(0, offset|0);
					source.playbackState = 1;
					source.onended = function (event) {
						source.playbackState = 0;
					};
					
					this._soundCollection.source[soundIndex] = source;
					playInitialized++;
				} else {
					console.log('source', source);
				}
			}
		}
		if (playInitialized < 3) {
			console.log('play but not play', playInitialized, sound);
		} else {
			return true;
		}
		return false;
	},
	
	addAudioPannerToMesh: function(object3d) {
        var panner	= this._context.createPanner();
        // panner.coneOuterGain	= 0.1
        // panner.coneOuterAngle	= Math.PI *180/Math.PI
        // panner.coneInnerAngle	= 0 *180/Math.PI
		
		// init AudioPannerNode
		panner.connect(this._lineOut.destination);

        var pannerUpdater	= new WebAudiox.PannerObject3DUpdater(panner, object3d);
        this._soundCollection.pannerUpdaters.push(pannerUpdater);
        object3d._panner = panner;
		object3d._pannerUpdater = pannerUpdater;
    },
	
    playAttachedSound: function(sound, object3d, loop) {
        var panner = object3d._panner;
        if (!panner) {
            this.addAudioPannerToMesh(object3d);
            panner = object3d._panner;
        }
        var index = this._getSoundIndex(sound);
        if (index != -1 && panner) {
			var buffer = this._soundCollection.buffer[index];
			if (buffer != undefined) {
			
				var source = this._context.createBufferSource();
				source.buffer = buffer;
				source.loop	= loop === false ? false : true;
				source.connect(panner);
				source._connectedPanner = panner;
				
				this._soundCollection.source.push( source );
				source.start(0);
				
			}
        } else {
            console.log('can\'t play sound ' + sound, index, panner);
        }
    },
	
	/* play a sound collection, make sure every sound is loaded before */
	playCollection: function(indexes) {
		//TODO: Positions to indexes, timeouts to onload.
		var self = this;
		
		var bufferResult = this._gatherPositionBuffers(
			indexes,
			[], 
			function(positionBuffers) {
				var x = 0;
				var playBuffer = function () {
					console.log('playBuffer', x);
					var source = self._context.createBufferSource();
					source.buffer = positionBuffers[x];
					x++;
					source.loop	= false;
					source.connect(self._lineOut.destination);
					//console.log('duration', source, source.buffer.duration * 1000);
					//source.onended = playBuffer;
					if (x < positionBuffers.length) setTimeout(playBuffer.bind(this), source.buffer.duration * 1000);
					
					source.start(0);
					
					//this._soundCollection.source[soundIndex] = source;
				};
				
				if (x < positionBuffers.length) playBuffer();
			},
			function(positionBuffers) {
				console.log('unable to load play collection', positionBuffers); 
			}
		);
		
		//gathering failed, invalid indexes
		if (bufferResult == false) return false;
	},
	
	stop: function(sound /* Can be URL, panner or source */, deleteAudioBufferSource) {
		if (sound) {
			var soundIndex = this._getSoundIndex(sound);
			if (soundIndex != -1) {
				var source = this._soundCollection.source[soundIndex];
				if (source != undefined && source.playbackState != 0) {
					//loaded the sound source, stop it IF it is playing
					source.stop();
					if (deleteAudioBufferSource) this._soundCollection.source[soundIndex] = undefined;
					return true;
				}
			}
		}
		return false;
	},
	
	stopAll: function(panner) {
		for (var x = 0, l = this._soundCollection.source.length; x < l ; x++) {
			var source = this._soundCollection.source[ x ];
			if (source != undefined && ( !panner || source._connectedPanner === panner)) {
				if (source.playbackState != 0) {
					console.log('stop sound');
					source.stop();
				}
				this._soundCollection.source[ x ] = undefined;
			}
		}
	},
	
	_getSoundIndex: function(sound) {
		var soundIndex = -1;
		//figure out index
		if (sound) {
		    if (typeof (sound) == 'string' || sound instanceof Blob) {
				soundIndex = this._soundCollection.soundUrl.indexOf(sound);
			} else if (sound instanceof THREE.Vector3) {
				for (var x = 0; x < this._soundCollection.panner.length; x++) {
					if (this._soundCollection.panner[x] && this._soundCollection.panner[x].position.distanceTo(sound) < 0.001) {
						soundIndex = x;
						break;
					}
				}
			} else if (sound instanceof AudioBufferSourceNode) {
				soundIndex = this._soundCollection.source.indexOf(sound);
			}
		}
		return soundIndex
	},
	
	_findEmptySpotInSoundList: function() {
		for (var x = 0; x < this._soundCollection.soundUrl.length; x++) {
			if (this._soundCollection.soundUrl[x] == undefined) return x;
		}
		return -1;
	},
	
	_update: function(delta, now) {
		this._listenerUpdater.update(delta, now);

        for (var x = 0; x < this._soundCollection.pannerUpdaters.length; x++) {
            this._soundCollection.pannerUpdaters[x].update(delta, now);
        }
	},
	
	_gatherPositionBuffers: function(indexes, positionBuffers, successCallback, errorCallback, tryCount, positions) {
		if (!tryCount) tryCount = 1;
		if (!positions) positions = focusedArtCluster.getPointsByIndexes(indexes);
	
		for (var x = 0; x < indexes.length; x++) {
			console.log('try', tryCount, 'positionBuffer is', positionBuffers[x], 'position', indexes[x]);
			if (positionBuffers[x]) continue;
			if (!indexes[x] || !positions[x]) return false;
			
			var soundIndex = this._getSoundIndex(positions[x]);
			if (soundIndex != -1) {
				var buffer = this._soundCollection.buffer[soundIndex];
				if (buffer != undefined) {
					//loaded the sound source, add it to buffers
					positionBuffers[x] = buffer;
				}
			} else {
				//-1 = sound neither added nor loaded.
				//initiate buffer loading
				//this.add('sounds/sound' + (indexes[x] % 7) + '.ogg', positions[x]);
				this.add('sounds/usage permitted only with a contimbre.com license ' + soundList[(indexes[x] % soundList.length)][0] + '.ogg', positions[x]);
			}
		}
		
		//do we have all buffers loaded?
		var allLoaded = true;
		for (var y = 0; y < indexes.length; y++) {
			if (!positionBuffers[y]) {
				//if not, set a new timeout with another call/check to see if all are loaded
				setTimeout(function() {
					if (tryCount < 5) this._gatherPositionBuffers(indexes, positionBuffers, successCallback, errorCallback, tryCount, positions);
				}.bind(this), 200);
				allLoaded = false;
				break;
			}
		}
		
		tryCount++;
		
		if (allLoaded && successCallback) successCallback(positionBuffers);
		else if (tryCount >= 5 && !allLoaded && errorCallback) errorCallback(positionBuffers);
	}
};