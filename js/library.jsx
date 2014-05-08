/** @jsx React.DOM */

var React = require('react');

var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;

var LibraryHome = require('./library-home');
var Artists = require('./artists');
var Albums = require('./albums');
var TracksList = require('./tracks');

module.exports = React.createClass({

    render: function() {
        return (
            <div>                
                <Locations contextual>
                  <Location path="/" handler={LibraryHome} />
                  <Location path="/artists" handler={Artists} />
                  <Location path="/artist/:artist" handler={Albums} />
                  <Location path="/albums*" handler={Albums} />
                  <Location path="/album/:artist/:album" handler={TracksList} />
                </Locations>
            </div>
        );
    }
});