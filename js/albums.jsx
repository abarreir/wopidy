/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var Link = require('react-router-component').Link;

var LibraryProvider = require('./library-provider');

module.exports = React.createClass({
    mixins: [Async.Mixin],

    getInitialStateAsync: function(cb) {
        var filter = this.props.artist && {artist: this.props.artist} || null;

        LibraryProvider
        .getAlbums(filter)
        .catch(function(reason) {
            console.error("Error retrieving albums.");
            console.error(reason);
        })
        .done(function(result) {
            return cb(null, {
                albums: result || []
            });
        });
    },

    render: function() {
        var albums = _.map(this.state.albums, function(album) {
            return <li><Link href={"/album/" + album.artist + "/" + album.album}>{album.album + " - " + album.artist}</Link></li>;
        });

        return (
            <div>
                <h2>{"Albums" + (this.state.artist && " from " + this.state.artist || "")}</h2>
                <ul>
                    {albums}
                </ul>
            </div>
        );
    }
});