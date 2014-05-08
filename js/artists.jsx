/** @jsx React.DOM */

var _ = require('underscore');
var React = require('react');
var Async = require('react-async');

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var LibraryProvider = require('./library-provider');

var Albums = require('./albums');

var ArtistsList = React.createClass({
    render: function() {
        var artists = _.map(this.props.artists, function(artist) {
            return <li><Link href={"/" + artist + "/"}>{artist}</Link></li>;
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
        return (
            <Locations contextual>
              <Location path="/" artists={this.state.artists} handler={ArtistsList} />
              <Location path="/:artist/*" handler={Albums} />
            </Locations>
        );
    }
});