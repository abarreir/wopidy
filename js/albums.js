/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var LibraryProvider = require('./library-provider');

var AlbumsList = React.createClass({displayName: 'AlbumsList',

    render: function() {
        var albums = _.map(this.props.albums, function(album) {
            return React.DOM.li(null, Link( {href:"/" + album.album}, album.album + " - " + album.artist));
        });

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Albums" + (this.props.artist && " from " + this.props.artist || "")),
                React.DOM.ul(null, 
                    albums
                )
            )
        );
    }
});

var TracksList = require('./tracks');

module.exports = React.createClass({displayName: 'exports',
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        var filter = this.props.artist && {artist: this.props.artist} || null;

        LibraryProvider
        .getAlbums(filter)
        .catch(function(reason) {
            console.error("Error retrieving albums.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                albums: result || []
            });
        });
    },

    render: function() {
        return (
            Locations( {contextual:true}, 
              Location( {path:"/", albums:this.state.albums, artist:this.props.artist, handler:AlbumsList} ),
              Location( {path:"/:album", artist:this.props.artist, handler:TracksList} )
            )
        );
    }
});