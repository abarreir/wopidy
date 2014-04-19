/** @jsx React.DOM */
/* global require, module, console */

var _ = require('underscore');
var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

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

    render: function() {
        return (
            <Locations contextual>
              <Location path="/" artists={this.props.artists} handler={ArtistsList} />
              <Location path="/:artist/*" albums={"Todo: Retrive artist's albums".split(' ')} handler={Albums} />
            </Locations>
        );
    }
});