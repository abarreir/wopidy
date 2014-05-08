/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router-component');
var Link = ReactRouter.Link;

module.exports = React.createClass({
    render: function() {
        return (
            <div>
               <Link href="/artists">Artists</Link>
               <Link href="/albums/">Albums</Link>
            </div>
        );
    }
});