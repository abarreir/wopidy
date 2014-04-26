var mopidy = require('./mopidy');
var _ = require('underscore');

var LibraryProvider = function () {

    this.getArtists = function() {
        return mopidy.library.search(null).then(function(results) {
            var artists = [];
            _.each(results, function(result) {
                if (result.hasOwnProperty("albums")) {
                    _.each(result.albums, function(album) {
                        if (album.hasOwnProperty("artists") && album.artists instanceof Array && album.artists.length) {
                            if (!album.artists[0].name) {
                                console.warn("Empty artist!");
                                console.log(album);
                            } else {
                                artists.push(album.artists[0].name);
                            }
                        } else {
                            console.log(album);
                        }
                    });
                } else if (result.hasOwnProperty("tracks")) {
                    _.each(result.tracks, function(track) {
                        if (track.hasOwnProperty("artists") && track.artists instanceof Array && track.artists.length) {
                            if (!track.artists[0].name) {
                                console.warn("Empty artist!");
                                console.log(track);
                            } else {
                                artists.push(track.artists[0].name);
                            }
                        } else {
                            console.warn("Track witout arists!");
                            console.log(track);
                        }
                    });
                } else {
                    console.warn("Unhandled search results.");
                    console.log(result);
                }
            });

            return _.chain(artists).uniq().sortBy(function(name) {
                return name;
            }).value();
        });
    };

    this.getAlbums = function(filter) {
        return mopidy.library.search(filter).then(function(results) {
            var albums = [];
            _.each(results, function(result) {
                // TODO: Album should be defined by (album, artist) tuple
                if (result.hasOwnProperty("albums")) {
                    _.each(result.albums, function(album) {
                        if (!album.name) {
                            // TODO: Such case can happen, fallback to Unknwon album
                            // if artist is set

                            // console.warn("Empty album name!");
                            // console.log(album);
                        } else {
                            albums.push(album.name);
                        }
                    });
                } else if (result.hasOwnProperty("tracks")) {
                    _.each(result.tracks, function(track) {
                        if (track.hasOwnProperty("album")) {
                            if (!track.album.name) {
                                // TODO: Such case can happen, fallback to Unknwon album
                                // if artist is set

                                // console.warn("Empty album!");
                                // console.log(track);
                            } else {
                                albums.push(track.album.name);
                            }
                        } else {
                            console.warn("Track witout album!");
                            console.log(track);
                        }
                    });
                } else {
                    console.warn("Unhandled search results.");
                    console.log(result);
                }
            });

            return _.chain(albums).uniq().sortBy(function(name) {
                return name;
            }).value();
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
                } else {
                    console.warn("Unhandled search results.");
                    console.log(result);
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
