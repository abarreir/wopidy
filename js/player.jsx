/** @jsx React.DOM */

var React = require('react');
var Async = require('react-async');
var when = require('when');

var PlaybackController = require('./playback-controller');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        when.all([
            PlaybackController.getCurrentTrack(),
            PlaybackController.getPlaybackState(),
            PlaybackController.getPlaybackPosition(),
            PlaybackController.getVolume(),
            PlaybackController.getMute()
        ]).spread(function(trackRes, stateRes, posRes, volume, mute) {
            console.log(arguments);
            return cb(null, {
                track: trackRes && trackRes.track || null,
                playState: stateRes,
                position: posRes,
                volume: volume,
                mute: mute
            });
        });

        PlaybackController.on("event:trackPlaybackStarted", this._onPlaybackStart.bind(this));
        PlaybackController.on("event:playbackStateChanged", this._onPlaystateChanged.bind(this));
        PlaybackController.on("event:trackPlaybackPaused", this._onPlaybackPausedOrResumed.bind(this));
        PlaybackController.on("event:trackPlaybackResumed", this._onPlaybackPausedOrResumed.bind(this));
        PlaybackController.on("event:volumeChanged", this._onVolumeChanged.bind(this));
        PlaybackController.on("event:muteChanged", this._onMuteChanged.bind(this));
    },

    _lastPositionCheck: null,
    _positionChecker: null,
    componentWillMount: function() {
        this._lastPositionCheck = Date.now();
        this._positionChecker = setTimeout(this._updatePosition, 1000);
    },

    _updatePosition: function() {
        var now = Date.now();

        if (this.state.playState === "playing") {
            this.setState({
                position: this.state.position + (now - this._lastPositionCheck)
            });
        }
        this._lastPositionCheck = now;
        this._positionChecker = setTimeout(this._updatePosition, 1000);
    },

    componentWillUnmount: function() {
        PlaybackController.off("event:trackPlaybackStarted", this._onPlaybackStart);
        PlaybackController.off("event:playbackStateChanged", this._onPlaystateChanged);
        PlaybackController.off("event:trackPlaybackPaused", this._onPlaybackPausedOrResumed.bind(this));
        PlaybackController.off("event:trackPlaybackResumed", this._onPlaybackPausedOrResumed.bind(this));

        if (this._positionChecker) {
            clearTimeout(this._positionChecker);
            this._positionChecker = null;
        }
    },

    _onPlaybackStart: function(e) {
        this.setState({
            track: e.tl_track.track,
            playState: "playing",
            position: 0
        });
    },

    _onPlaystateChanged: function(e) {
        this.setState({
            playState: e.new_state
        });
    },

    _onPlaybackPausedOrResumed: function(e) {
        this.setState({
            position: e.time_position
        });
    },

    _onVolumeChanged: function(e) {
        this.setState({
            volume: e.volume
        });
    },

    _onMuteChanged: function(e) {
        this.setState({
            mute: e.mute
        });
    },

    _togglePlay: function(e) {
        if (this.state.playState === "playing") {
            PlaybackController.pause();
        } else {
            PlaybackController.play();
        }
    },

    _stop: function(e) {
        PlaybackController.stop();
    },

    _prev: function(e) {
        PlaybackController.previous();
    },

    _next: function(e) {
        PlaybackController.next();
    },

    _changeVolume: function(e) {
        var vol = this.state.volume + parseInt(e.target.dataset.op);
        PlaybackController.setVolume(Math.min(100, Math.max(0, vol)));
        // this.setState({
        //     volume: Math.min(100, Math.max(0, vol))
        // });
    },

    _setMute: function(e) {
        PlaybackController.setMute(!this.state.mute);
        // this.setState({
        //     mute: !this.state.mute
        // });
    },

    render: function() {
        return (
            <div>
                <span>{this.state.track && this.state.track.name}</span>
                <span> -_- </span>
                <span onClick={this._prev}> Prev </span>
                <span onClick={this._togglePlay}> {this.state.playState === "playing" && "Pause" || "Play"}</span>
                <span onClick={this._stop}> Stop</span>
                <span onClick={this._next}> Next </span>
                <span> -_- </span>
                <span onClick={this._changeVolume} data-op="-10">Vol-</span>
                <span>{" Vol: " + this.state.volume} </span>
                <span onClick={this._changeVolume} data-op="+10"> Vol+ </span>
                <span onClick={this._setMute}> {this.state.mute && "Unmute" || "Mute"}</span> 
                <span> -_- </span>
                <span>{(this.state.position / 1000) + " / " + (this.state.track && this.state.track.length/1000 || 0)}</span>
            </div>
        );
    }
});
