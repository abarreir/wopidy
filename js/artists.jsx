/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var Link = require('react-router-component').Link;

var LibraryProvider = require('./library-provider');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        LibraryProvider.getArtists()
        .then(function(result) {
            return cb(null, {
                artists: result
            });
        })
        .otherwise(function(reason) {
            console.error(reason);
            return cb(null, {
                artists: []
            });
        });
    },

    render: function() {
        var artists = _.map(this.state.artists, function(artist) {
            return <li><Link href={"/artist/" + artist}>{artist}</Link></li>;
        });

        return (
            <div>
                <h2>Artists</h2>
                <ul>
                    {artists}
                </ul>
            </div>
        );
    }
});