var mopidy = require('./mopidy');
var when = require('when');

var PlaybackController = function () {
    // -
    // Forward events listening to mopidy
    this.on = mopidy.on.bind(mopidy);
    this.off = mopidy.off.bind(mopidy);

    // -
    // Playback
    // --
    var _playstate = null;
    mopidy.playback.getState()
    .done(function(state) {
        _playstate = state;
    });

    var _position = null;
    mopidy.playback.getTimePosition()
    .done(function(pos) {
        _position = pos;
    });

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

    this.previous = function() {
        return mopidy.playback.previous();
    };

    this.getPlaybackState = function() {
        return when(_playstate && _playstate || mopidy.playback.getState());
    };

    this.getPlaybackPosition = function() {
        return when(_position !== null ? _position : mopidy.playback.getTimePosition());
    };

    mopidy.on("event:trackPlaybackPaused", function(data) {
        _playstate = "paused";
    });

    mopidy.on("event:trackPlaybackResumed", function(data) {
        _playstate = "playing";
    });

    // mopidy.on("event:trackPlaybackEnded", function(data) {
    //     console.log("Playback ended");
    //     console.log(data);
    // });

    mopidy.on("event:playbackStateChanged", function(data) {
        _playstate = data.new_state;
    });

    this.getVolume = function() {
        return mopidy.playback.getVolume();
    };

    this.setVolume = function(volume) {
        return mopidy.playback.setVolume(volume);
    };

    this.getMute = function() {
        return mopidy.playback.getMute();
    };

    this.setMute = function(mute) {
        return mopidy.playback.setMute(mute);
    };

    // mopidy.on("event:volumeChanged", function(data) {
    //     console.log("Volume changed");
    //     console.log(data);
    // });

    // mopidy.on("event:muteChanged", function(data) {
    //     console.log("Mute changed");
    //     console.log(data);
    // });

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

    this.getCurrentTrack = function() {
        return when(_tlTrack && _tlTrack || mopidy.playback.getCurrentTlTrack());
    };

    this.playNow = function(uri) {
        // If there's a current track in the list, add the new track after it
        // Otherwise add it to the queue
        return when(_playstate !== "stopped" && this.stop())
        .then(function() {
            return when(_tlTrack && mopidy.tracklist.index(_tlTrack) || null);
        })
        .then(function(result) {
            return this.addToTracklist(uri, result !== null && result + 1 || null);
        }.bind(this))
        .then(this.next.bind(this))
        .then(this.play.bind(this));
    };

    this.changeTrack = function(tlTrack) {
        return when(_playstate !== "stopped" && this.stop())
        .then(mopidy.playback.changeTrack(tlTrack))
        .then(this.play.bind(this));
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