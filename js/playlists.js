/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var PlaylistsController = require('./playlists-controller');
var TracksList = require('./tracks');

var PlaylistsList = React.createClass({displayName: 'PlaylistsList',
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
                    Link( {href:"/" + playlist.uri}, playlist.name)
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

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',

    render: function() {

        return (
            Locations( {contextual:true}, 
              Location( {path:"/", handler:PlaylistsList} ),
              Location( {path:"/:playlistid", handler:TracksList} )
            )
        );
    }
});
