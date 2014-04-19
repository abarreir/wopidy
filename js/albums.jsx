/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({
    
    render: function() {
        var albums = _.map(this.props.albums, function(album) {
            return <li>{album}</li>;
        });

        return (
            <div>
                <h2>Albums</h2>
                <ul>
                    {albums}
                </ul>
            </div>
        );
    }
});