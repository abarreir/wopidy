var mopidy = require('./mopidy');
var _ = require('underscore');

var PlaylistsController = function () {
    // -
    // Forward events listening to mopidy
    this.on = mopidy.on.bind(mopidy);
    this.off = mopidy.off.bind(mopidy);

    this.get = mopidy.playlists.getPlaylists.bind(mopidy);
    this.lookup = function(playlistUri) {
        return mopidy.playlists.lookup(playlistUri).then(function(playlist) {
            var res = {
                tracks: [],
                uris: {}
            };

            if (playlist.hasOwnProperty("tracks") && playlist.tracks instanceof Array) {
                _.each(playlist.tracks, function(track) {
                    res.tracks.push(track.name);
                    res.uris[track.name] = track.uri;
                });
            }

            return res;
        });
    };
};

module.exports = new PlaylistsController();