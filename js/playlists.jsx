/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var PlaylistsController = require('./playlists-controller');
var TracksList = require('./tracks');

var PlaylistsList = React.createClass({
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
                    <Link href={"/" + playlist.uri}>{playlist.name}</Link>
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

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

module.exports = React.createClass({

    render: function() {

        return (
            <Locations contextual>
              <Location path="/" handler={PlaylistsList} />
              <Location path="/:playlistid" handler={TracksList} />
            </Locations>
        );
    }
});
