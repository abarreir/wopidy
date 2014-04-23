/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var LibraryProvider = require('./library-provider');

module.exports = React.createClass({displayName: 'exports',
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        var filter = this.props.album && {album: this.props.album} || null;

        LibraryProvider
        .getTracks(filter)
        .catch(function(reason) {
            console.error("Error retrieving tracks.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                tracks: result || []
            });
        });
    },

    render: function() {
        var tracks = _.map(this.state.tracks, function(track) {
            return React.DOM.li(null, track);
        });

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Tracks" + (this.props.album && " from " + this.props.album || "")),
                React.DOM.ul(null, 
                    tracks
                )
            )
        );
    }
});
