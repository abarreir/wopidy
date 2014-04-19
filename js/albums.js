/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({displayName: 'exports',
    
    render: function() {
        var albums = _.map(this.props.albums, function(album) {
            return React.DOM.li(null, album);
        });

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Albums"),
                React.DOM.ul(null, 
                    albums
                )
            )
        );
    }
});