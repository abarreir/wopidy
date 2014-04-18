/** @jsx React.DOM */
/* global require, module, console */

var React = require('react');

module.exports = React.createClass({displayName: 'exports',
    render: function() {
        return (
            React.DOM.div(null,                
               "This is home"
            )
        );
    }
});