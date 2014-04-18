/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({displayName: 'exports',
    
    render: function() {
        var artists = _.map(this.props.artists, function(artist) {
            return React.DOM.li(null, artist);
        });

        return (
            React.DOM.div(null, 
                React.DOM.ul(null, 
                    artists
                )
            )
        );
    }
});