/** @jsx React.DOM */

var _ = require('underscore');
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
        var tlTrack = this.state.tracklist[e.target.dataset.trackIdx];

        PlaybackController.changeTrack(tlTrack);
    },

    render: function() {
        var tracklist = _.map(this.state.tracklist, function(tlTrack) {
            return (
                React.DOM.li(null, 
                    React.DOM.span(null, tlTrack.track.name),
                    React.DOM.div( {'data-track-idx':this.state.tracklist.indexOf(tlTrack), onClick:this._play}, "Play")
                )
            );
        }.bind(this));

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Tracklist"),
                React.DOM.ul(null, 
                    tracklist
                )
            )
        );
    }
});
