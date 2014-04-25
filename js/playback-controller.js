var mopidy = require('./mopidy');

var PlaybackController = function () {
    this.play = function(uri) {
        mopidy.tracklist.add(null, null, uri)
        .then(function(result) {
            return mopidy.playback.play();
        })
        .catch(function(reason) {
            console.error(reason);
        });        
    };

    this.addToTracklist = function(uri) {
        return mopidy.tracklist.add(null, null, uri);
    };

    this.getTracklist = function() {
        return mopidy.tracklist.getTracks();
    };

    mopidy.on("event:trackPlaybackPaused", function(data) {
        console.log("Playback paused");
		console.log(data);
    });

    mopidy.on("event:trackPlaybackResumed", function(data) {
        console.log("Playback resumed");
		console.log(data);
    });

    mopidy.on("event:trackPlaybackStarted", function(data) {
        console.log("Playback started");
		console.log(data);
    });

    mopidy.on("event:trackPlaybackEnded", function(data) {
        console.log("Playback ended");
		console.log(data);
    });

    mopidy.on("event:playbackStateChanged", function(data) {
        console.log("Playback state changed");
		console.log(data);
    });

    mopidy.on("event:tracklistChanged", function(data) {
        console.log("Tracklist changed");
		console.log(data);
    });

    mopidy.on("event:playlistsLoaded", function(data) {
        console.log("Playlist loaded");
		console.log(data);
    });

    mopidy.on("event:playlistChanged", function(data) {
        console.log("Playlist changed");
		console.log(data);
    });

    mopidy.on("event:optionsChanged", function(data) {
        console.log("Options changed");
		console.log(data);
    });

    mopidy.on("event:volumeChanged", function(data) {
        console.log("Volume changed");
		console.log(data);
    });

    mopidy.on("event:muteChanged", function(data) {
        console.log("Mute changed");
		console.log(data);
    });

    mopidy.on("event:seeked", function(data) {
        console.log("Seeked");
		console.log(data);
    });

};

module.exports = new PlaybackController();