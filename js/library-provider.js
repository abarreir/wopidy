var mopidy = require('./mopidy');
var _ = require('underscore');
var when = require('when');

var LibraryProvider = function () {

    this.getArtists = function() {
        return mopidy.library.search(null).then(function(results) {
            var artists = {};
            _.each(results, function(result) {
                _.each(result.albums || result.tracks || [], function(item) {
                    if (item.hasOwnProperty("artists") && item.artists instanceof Array && item.artists.length) {
                        if (!item.artists[0].name) {
                            console.warn("Empty artist!");
                            console.log(item);
                        } else {
                            var artistKey = item.artists[0].name.trim().toLowerCase();
                            if (artists.hasOwnProperty(artistKey) && artists[artistKey].indexOf(item.artists[0].name) === -1) {
                                artists[artistKey].push(item.artists[0].name);
                            } else if (!artists.hasOwnProperty(artistKey)) {
                                artists[artistKey] = [item.artists[0].name];
                            }
                        }
                    } else {
                        console.warn("No artist key for item!");
                        console.log(item);
                    }
                });
            });
            
            var res = [];

            _.each(Object.keys(artists), function(artistKey) {
                res.push(artists[artistKey][0]);
            });

            return _.sortBy(res, function(name) {
                return name;
            });
        });
    };

    this.getAlbums = function(filter) {
        return mopidy.library.search(filter).then(function(results) {
            //var albums = [];
            var albumKeys = [];
            var albums = [];
            console.log(results);

            _.each(results, function(result) {
                _.each(result.albums || result.tracks || [], function(item) {
                    var artistName = "";

                    if (filter && filter.artist) {
                        artistName = filter.artist;

                        if (item.artists && item.artists instanceof Array && item.artists.length) {
                            var match = false;

                            _.each(item.artists, function(artist) {
                                match = match || artist.name && artist.name.trim().toLowerCase() === filter.artist.trim().toLowerCase();
                            });

                            if (!match) {
                                return;
                            }
                        }
                    }

                    var albumName = "";

                    if (item.__model__ === "Track") {
                        albumName = item.album && item.album.name.trim() && item.album.name || "Unknown album";
                    } else {
                        albumName = item.name.trim() && item.name || "Unknown album"; 
                    }
                    
                    if (!artistName) {
                        if (item.hasOwnProperty("artists") && item.artists instanceof Array && item.artists.length) {
                            artistName = item.artists[0] && item.artists[0].name.trim() && item.artists[0].name || "Unknown artist";
                        } else {
                            artistName = "Unknown artist";
                        }
                    }

                    var albumKey = albumName.trim().toLowerCase() + artistName.trim().toLowerCase();

                    if (albumKeys.indexOf(albumKey) === -1) {
                        albumKeys.push(albumKey);
                        albums.push({
                            artist: artistName,
                            album: albumName
                        });
                    }
                });
            });

            return _.sortBy(albums, function(albumTuple) {
                return albumTuple.album;
            });
        });
    };

    this.getTracks = function(filter) {
        return mopidy.library.search(filter).then(function(results) {
            var tracks = [];
            var uris = {};

            _.each(results, function(result) {
                if (result.hasOwnProperty("tracks")) {
                    _.each(result.tracks, function(track) {
                        tracks.push(track.name);

                        if (!uris.hasOwnProperty(track.name)) {
                            uris[track.name] = [];
                        }

                        uris[track.name].push(track.uri);
                    });
                }
            });

            return {
                tracks: _.chain(tracks).uniq().sortBy(function(name) { return name; }).value(), 
                uris: uris
            };
        });
    };
};

module.exports = new LibraryProvider();
