/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var Albums = require('./albums');

var ArtistsList = React.createClass({displayName: 'ArtistsList',
    render: function() {
        var artists = _.map(this.props.artists, function(artist) {
            return React.DOM.li(null, Link( {href:"/" + artist + "/"}, artist));
        });

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Artists"),
                React.DOM.ul(null, 
                    artists
                )
            )
        );
    }
});

module.exports = React.createClass({displayName: 'exports',

    render: function() {
        return (
            Locations( {contextual:true}, 
              Location( {path:"/", artists:this.props.artists, handler:ArtistsList} ),
              Location( {path:"/:artist/*", handler:Albums} )
            )
        );
    }
});