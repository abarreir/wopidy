/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var PlaylistsController = require('./playlists-controller');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        PlaylistsController
        .get()
        .catch(function(reason) {
            console.error("Error retrieving playlists.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                playlists: result || []
            });
        });
    },

    render: function() {
        var playlists = _.map(this.state.playlists, function(playlist) {
            return (
                <li>
                    <span>{playlist.name}</span>
                </li>
            );
        }.bind(this));

        return (
            <div>
                <h2>Playlists</h2>
                <ul>
                    {playlists}
                </ul>
            </div>
        );
    }
});
