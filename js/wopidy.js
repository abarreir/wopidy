/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var Library = require('./library');
var Home = require('./home');
var Tracklist = require('./tracklist');
var Player = require('./player');

var Wopidy = React.createClass({displayName: 'Wopidy',
    render: function() {
        return (
            React.DOM.div( {id:"main"}, 
              React.DOM.h1(null, Link( {globalHash:true, href:"/"}, "wopidy")),
              Link( {globalHash:true, href:"/library/"}, "Library"),
              React.DOM.span(null,  " | " ),
              Link( {globalHash:true, href:"/tracklist"}, "Tracklist"),
              Player(null ),
              React.DOM.div( {id:"content"}, 
                Locations( {hash:true}, 
                  Location( {path:"/", handler:Home} ),
                  Location( {path:"/library*", handler:Library} ),
                  Location( {path:"/tracklist", handler:Tracklist} )
                )
              )
            )
        );
    }
});

React.renderComponent(Wopidy(null ), document.body);