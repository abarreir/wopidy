/** @jsx React.DOM */
/* global require, document */

var React = require('react');
var ReactRouter = require('react-router-component');
var Locations = ReactRouter.Locations;
var Location = ReactRouter.Location;
var NotFound = ReactRouter.NotFound;
var Link = ReactRouter.Link;

var Library = require('./library');
var Home = require('./home');

var Wopidy = React.createClass({
    render: function() {
        return (
            <div id="main">
              <h1><Link globalHash href="/">wopidy</Link></h1>
              <Link globalHash href="/library/">Library</Link>
              <div id="content">
                <Locations hash>
                  <Location path="/library/*" handler={Library} />
                  <Location path="/" handler={Home} />
                </Locations>
              </div>
            </div>
        );
    }
});

React.renderComponent(<Wopidy />, document.body);