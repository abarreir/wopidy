var mopidy = require('./mopidy');
var when = require('when');

var PlaybackController = function () {
    // -
    // Playback
    // --
    var _playstate = "stopped";

    this.play = function() {
        return mopidy.playback.play();
    };

    this.pause = function() {
        return mopidy.playback.pause();
    };

    this.stop = function() {
        return mopidy.playback.stop();
    };

    this.next = function() {
        return mopidy.playback.next();
    };

    mopidy.on("event:trackPlaybackPaused", function(data) {
        console.log("Playback paused");
        console.log(data);
        _playstate = "paused";
    });

    mopidy.on("event:trackPlaybackResumed", function(data) {
        console.log("Playback resumed");
        console.log(data);
        _playstate = "playing";
    });

    mopidy.on("event:trackPlaybackEnded", function(data) {
        console.log("Playback ended");
        console.log(data);
    });

    mopidy.on("event:playbackStateChanged", function(data) {
        console.log("Playback state changed");
        _playstate = data.new_state;
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

    // -
    // Tracklist
    // --
    var _tlTrack = null;

    mopidy.playback.getCurrentTlTrack()
    .done(function(tlTrack) {
        _tlTrack = tlTrack;
    });

    this.addToTracklist = function(uri, pos) {
        return mopidy.tracklist.add(null, pos, uri);
    };

    this.getTracklist = function() {
        return mopidy.tracklist.getTlTracks();
    };

    this.playNow = function(uri) {
        // If there's a current track in the list, add the new track after it
        // Otherwise add it to the queue
        return when(_tlTrack && mopidy.tracklist.index(_tlTrack) || null).then(function(result) {
            return this.addToTracklist(uri, result !== null && result + 1 || null);
        }.bind(this)).then(function(result) {
            return this.next();
        }.bind(this)).then(function(result) {
            if (_playstate !== "playing") {
                return this.play();
            }
        }.bind(this));
    };

    this.changeTrack = function(tlTrack) {
        return mopidy.playback.changeTrack(tlTrack).then(function(result) {
            if (_playstate !== "playing") {
                return this.play();
            }
        }.bind(this));
    };

    mopidy.on("event:trackPlaybackStarted", function(data) {
        console.log("Playback started");
        _tlTrack = data.tl_track;
    });

    mopidy.on("event:tracklistChanged", function(data) {
        console.log("Tracklist changed");
        console.log(data);
    });

    // -
    // Playlists
    // --

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
};

module.exports = new PlaybackController();