/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var AlbumsList = React.createClass({

    render: function() {
        var albums = _.map(this.props.albums, function(album) {
            return <li><Link href={"/" + album}>{album}</Link></li>;
        });

        return (
            <div>
                <h2>{"Albums" + (this.props.artist && " from " + this.props.artist || "")}</h2>
                <ul>
                    {albums}
                </ul>
            </div>
        );
    }
});

var TracksList = React.createClass({

    render: function() {
        var tracks = _.map(this.props.tracks, function(track) {
            return <li>{track}</li>;
        });

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

module.exports = React.createClass({

    render: function() {
        return (
            <Locations contextual>
              <Location path="/" albums={this.props.albums} handler={AlbumsList} />
              <Location path="/:album" tracks={"Todo: Retrieve album's tracks".split(' ')} handler={TracksList} />
            </Locations>
        );
    }
});