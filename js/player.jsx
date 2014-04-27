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
            PlaybackController.getPlaybackPosition()
        ]).spread(function(trackRes, stateRes, posRes) {
            console.log(trackRes);
            console.log(posRes);
            return cb(null, {
                track: trackRes && trackRes.track || null,
                playState: stateRes,
                position: posRes
            });
        });

        PlaybackController.on("event:trackPlaybackStarted", this._onPlaybackStart.bind(this));
        PlaybackController.on("event:playbackStateChanged", this._onPlaystateChanged.bind(this));
        PlaybackController.on("event:trackPlaybackPaused", this._onPlaybackPausedOrResumed.bind(this));
        PlaybackController.on("event:trackPlaybackResumed", this._onPlaybackPausedOrResumed.bind(this));
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
                <span>{(this.state.position / 1000) + " / " + (this.state.track && this.state.track.length/1000 || 0)}</span>
            </div>
        );
    }
});
