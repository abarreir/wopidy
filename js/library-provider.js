var mopidy = require('./mopidy');
var when = require('when');
var _ = require('underscore');

var LibraryProvider = function () {
    var _mopidyOnline = false;

    mopidy.on("state:online", function() {
        _mopidyOnline = true;
    });

    mopidy.on("state:offline", function() {
        _mopidyOnline = false;
    });

    var _getArtists = function(resolve, reject) {
        mopidy.library.search(null).then(function(results) {
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

            return resolve(_.chain(artists).uniq().sortBy(function(name) {
                return name;
            }).value());
        }, reject);
    };

    this.getArtists = function() {
        if (!_mopidyOnline) {
            return when.promise(function(resolve, reject) {
                return mopidy.on("state:online", function() {
                    return _getArtists(resolve, reject);
                });
            });            
        }

        return when.promise(function(resolve, reject) {
            return _getArtists(resolve, reject);
        });
    };

    var _getAlbums = function(resolve, reject) {
        mopidy.library.search(null).then(function(results) {
            var albums = [];
            _.each(results, function(result) {
                // TODO: Album should be defined by (album, artist) tuple
                if (result.hasOwnProperty("albums")) {
                    _.each(result.albums, function(album) {
                        if (!album.name) {
                            console.warn("Empty album name!");
                            console.log(album);
                        } else {
                            albums.push(album.name);
                        }
                    });
                } else if (result.hasOwnProperty("tracks")) {
                    _.each(result.tracks, function(track) {
                        if (track.hasOwnProperty("album")) {
                            if (!track.album.name) {
                                console.warn("Empty album!");
                                console.log(track);
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

            return resolve(_.chain(albums).uniq().sortBy(function(name) {
                return name;
            }).value());
        }, reject);
    };

    this.getAlbums = function() {
        if (!_mopidyOnline) {
            return when.promise(function(resolve, reject) {
                return mopidy.on("state:online", function() {
                    return _getAlbums(resolve, reject);
                });
            });            
        }

        return when.promise(function(resolve, reject) {
            return _getAlbums(resolve, reject);
        });
    };
};

module.exports = new LibraryProvider();
