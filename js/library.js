/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;

var LibraryProvider = require('./library-provider');

var LibraryHome = require('./library-home');
var Artists = require('./artists');
var Albums = require('./albums');

module.exports = React.createClass({displayName: 'exports',

    getInitialState: function() {
        return {
            artists: [],
            albums: [],
            tracks: []
        };
    },

    _loadArtists: function() {
        LibraryProvider.getArtists().then(function(result) {
            this.setState({
                artists: result
            });
        }.bind(this), function(reason) {
            console.error(reason);
        });
    },

    _loadAlbums: function() {
        LibraryProvider.getAlbums().then(function(result) {
            this.setState({
                albums: result
            });
        }.bind(this), function(reason) {
            console.error(reason);
        });
    },

    componentWillMount: function() {
        this._loadArtists();  
        this._loadAlbums();  
    },

    render: function() {
        return (
            React.DOM.div(null, 
                
                Locations( {contextual:true}, 
                  Location( {path:"/", handler:LibraryHome} ),
                  Location( {path:"/artists/*", artists:this.state.artists, handler:Artists} ),
                  Location( {path:"/albums/*", albums:this.state.albums, handler:Albums} )
                )
            )
        );
    }
});