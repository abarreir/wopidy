/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var AlbumsList = React.createClass({displayName: 'AlbumsList',

    render: function() {
        var albums = _.map(this.props.albums, function(album) {
            return React.DOM.li(null, Link( {href:"/" + album}, album));
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

var TracksList = React.createClass({displayName: 'TracksList',

    render: function() {
        var tracks = _.map(this.props.tracks, function(track) {
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

module.exports = React.createClass({displayName: 'exports',

    render: function() {
        return (
            Locations( {contextual:true}, 
              Location( {path:"/", albums:this.props.albums, handler:AlbumsList} ),
              Location( {path:"/:album", tracks:"Todo: Retrieve album's tracks".split(' '), handler:TracksList} )
            )
        );
    }
});