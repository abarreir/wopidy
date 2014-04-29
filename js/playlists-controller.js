var mopidy = require('./mopidy');
var when = require('when');

var PlaylistsController = function () {
    // -
    // Forward events listening to mopidy
    this.on = mopidy.on.bind(mopidy);
    this.off = mopidy.off.bind(mopidy);

    this.get = mopidy.playlists.getPlaylists.bind(mopidy);
    this.lookup = mopidy.playlists.lookup.bind(mopidy);
};

module.exports = new PlaylistsController();