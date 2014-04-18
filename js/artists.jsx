/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({
    
    render: function() {
        var artists = _.map(this.props.artists, function(artist) {
            return <li>{artist}</li>;
        });

        return (
            <div>
                <ul>
                    {artists}
                </ul>
            </div>
        );
    }
});