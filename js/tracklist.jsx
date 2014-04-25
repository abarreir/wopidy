/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var PlaybackController = require('./playback-controller');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        PlaybackController
        .getTracklist()
        .catch(function(reason) {
            console.error("Error retrieving tracklist.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                tracklist: result || []
            });
        });
    },

    _play: function(e) {
        var tlTrack = this.state.tracklist[e.target.dataset.trackIdx];

        PlaybackController.changeTrack(tlTrack);
    },

    render: function() {
        var tracklist = _.map(this.state.tracklist, function(tlTrack) {
            return (
                <li>
                    <span>{tlTrack.track.name}</span>
                    <div data-track-idx={this.state.tracklist.indexOf(tlTrack)} onClick={this._play}>Play</div>
                </li>
            );
        }.bind(this));

        return (
            <div>
                <h2>Tracklist</h2>
                <ul>
                    {tracklist}
                </ul>
            </div>
        );
    }
});
