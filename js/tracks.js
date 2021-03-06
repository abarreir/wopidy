/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var LibraryProvider = require('./library-provider');
var PlaylistsController = require('./playlists-controller');
var PlaybackController = require('./playback-controller');

module.exports = React.createClass({displayName: 'exports',
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        var tracksProvider = null;

        if (this.props.playlistid) {
            tracksProvider = PlaylistsController.lookup(this.props.playlistid);
        } else {
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

            tracksProvider = LibraryProvider.getTracks(filter);
        }
        
        tracksProvider
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
                React.DOM.li(null, 
                    React.DOM.span(null, track),
                    React.DOM.div( {'data-track':track, onClick:this._play}, "Play"),
                    React.DOM.div( {'data-track':track, onClick:this._addToTracklist}, "Queue")
                )
            );
        }.bind(this));

        return (
            React.DOM.div(null, 
                React.DOM.h2(null, "Tracks" + (this.props.album && " from " + this.props.album || "")),
                React.DOM.ul(null, 
                    tracks
                )
            )
        );
    }
});
