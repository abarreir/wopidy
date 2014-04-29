/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var Link = ReactRouter.Link;

var Library = require('./library');
var Home = require('./home');
var Tracklist = require('./tracklist');
var Playlists = require('./playlists');
var Player = require('./player');

var Wopidy = React.createClass({
    render: function() {
        return (
            <div id="main">
              <h1><Link globalHash href="/">wopidy</Link></h1>
              <Link globalHash href="/library/">Library</Link>
              <span> | </span>
              <Link globalHash href="/playlists">Playlists</Link>
              <span> | </span>
              <Link globalHash href="/tracklist">Tracklist</Link>
              <Player />
              <div id="content">
                <Locations hash>
                  <Location path="/" handler={Home} />
                  <Location path="/library*" handler={Library} />
                  <Location path="/playlists*" handler={Playlists} />
                  <Location path="/tracklist" handler={Tracklist} />
                </Locations>
              </div>
            </div>
        );
    }
});

React.renderComponent(<Wopidy />, document.body);