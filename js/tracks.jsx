/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var LibraryProvider = require('./library-provider');
var PlaybackController = require('./playback-controller');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        var filter = null;

        if (this.props.album) {
            filter = {
                album: this.props.album
            };
        }

        if (this.props.artist) {
            if (filter) {
                filter.artist = this.props.artist;
            } else {
                filter = {
                    artist: this.props.artist
                }
            }
        }

        LibraryProvider
        .getTracks(filter)
        .catch(function(reason) {
            console.error("Error retrieving tracks.");
            console.error(reason);
            return {
                tracks: [],
                uris: {}
            };
        })
        .done(function(result) {
            return cb(null, {
                tracks: result.tracks || [],
                uris: result.uris || {}
            });
        });
    },

    _addToTracklist: function(e) {
        var uris = this.state.uris[e.target.dataset.track];

        if (!uris.length) {
            return console.error("No uri for the selected track");
        }

        PlaybackController
        .addToTracklist(uris[0])
        .catch(function(reason) {
            console.error("Error adding track to tracklist.");
            console.error(reason);
        })
        .done(function() {

        });
    },

    _play: function(e) {
        var uris = this.state.uris[e.target.dataset.track];

        if (!uris.length) {
            return console.error("No uri for the selected track");
        }

        PlaybackController.playNow(uris[0]);
    },

    render: function() {
        var tracks = _.map(this.state.tracks, function(track) {
            return (
                <li>
                    <span>{track}</span>
                    <div data-track={track} onClick={this._play}>Play</div>
                    <div data-track={track} onClick={this._addToTracklist}>Queue</div>
                </li>
            );
        }.bind(this));

        return (
            <div>
                <h2>{"Tracks" + (this.props.album && " from " + this.props.album || "")}</h2>
                <ul>
                    {tracks}
                </ul>
            </div>
        );
    }
});
