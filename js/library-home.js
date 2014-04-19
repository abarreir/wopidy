/** @jsx React.DOM */
/* global require, module, console */

var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',
    render: function() {
        return (
            React.DOM.div(null, 
               Link( {href:"/artists/"}, "Artists"),
               Link( {href:"/albums/"}, "Albums")
            )
        );
    }
});