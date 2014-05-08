/** @jsx React.DOM */

var React = require('react');

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;

var LibraryHome = require('./library-home');
var Artists = require('./artists');
var Albums = require('./albums');

module.exports = React.createClass({displayName: 'exports',

    render: function() {
        return (
            React.DOM.div(null,                 
                Locations( {contextual:true}, 
                  Location( {path:"/", handler:LibraryHome} ),
                  Location( {path:"/artists*", handler:Artists} ),
                  Location( {path:"/albums*", handler:Albums} )
                )
            )
        );
    }
});