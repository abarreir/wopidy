/** @jsx React.DOM */

var React = require('react');
var Async = require('react-async');

var PlaybackController = require('./playback-controller');

module.exports = React.createClass({displayName: 'exports',
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        PlaybackController
        .getTracklist()
        .catch(function(reason) {
            console.error("Error retrieving tracklist.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                tracklist: result || []
            });
        });
    },

    _play: function(e) {
        PlaybackController.play();
    },

    _pause: function(e) {
        PlaybackController.pause();
    },

    _stop: function(e) {
        PlaybackController.stop();
    },

    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.span( {onClick:this._play}, "Play"),
                React.DOM.span( {onClick:this._pause},  " Pause"),
                React.DOM.span( {onClick:this._stop},  " Stop")
            )
        );
    }
});
