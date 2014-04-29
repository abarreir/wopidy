/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var PlaylistsController = require('./playlists-controller');

module.exports = React.createClass({displayName: 'exports',
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        PlaylistsController
        .get()
        .catch(function(reason) {
            console.error("Error retrieving playlists.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                playlists: result || []
            });
        });
    },

    render: function() {
        var playlists = _.map(this.state.playlists, function(playlist) {
            return (
                React.DOM.li(null, 
                    React.DOM.span(null, playlist.name)
                )
            );
        }.bind(this));

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Playlists"),
                React.DOM.ul(null, 
                    playlists
                )
            )
        );
    }
});
