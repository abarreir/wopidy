/* global Mopidy */
var when = require('when');

var MopidyProxy = function() {
    var _mopidy = new Mopidy();
    var _online = false;

    var _whenConnected = when.defer();

    _mopidy.on("state:online", function() {
        _online = true;
        _whenConnected.resolve();
    });

    _mopidy.on("state:offline", function() {
        _online = false;
        _whenConnected = when.defer();
    });

    var _proxyFunc = function proxyFunc(funcName) {
        return function() {
            var args = arguments;

            if (_online) {
                return eval("_" + funcName).apply(_mopidy, args);
            }

            return when(_whenConnected.promise, function() {
                return eval("_" + funcName).apply(_mopidy, args);
            });
        };
    };

    // Listeners can be set at all times
    this.on = _mopidy.on.bind(_mopidy);
    this.off = _mopidy.off.bind(_mopidy);

    // Would love to use ES6 proxies here, but compatibility is really low (04/2014)
    this.library = {
        browse: _proxyFunc("mopidy.library.browse"),
        findExact: _proxyFunc("mopidy.library.findExact"),
        lookup: _proxyFunc("mopidy.library.lookup"),
        refresh: _proxyFunc("mopidy.library.refresh"),
        search: _proxyFunc("mopidy.library.search")
    };

    this.playback = {
        changeTrack: _proxyFunc("mopidy.playback.changeTrack"),
        getCurrentTlTrack: _proxyFunc("mopidy.playback.getCurrentTlTrack"),
        getCurrentTrack: _proxyFunc("mopidy.playback.getCurrentTrack"),
        getMute: _proxyFunc("mopidy.playback.getMute"),
        getState: _proxyFunc("mopidy.playback.getState"),
        getTimePosition: _proxyFunc("mopidy.playback.getTimePosition"),
        getVolume: _proxyFunc("mopidy.playback.getVolume"),
        next: _proxyFunc("mopidy.playback.next"),
        onEndOfTrack: _proxyFunc("mopidy.playback.onEndOfTrack"),
        onTracklistChange: _proxyFunc("mopidy.playback.onTracklistChange"),
        pause: _proxyFunc("mopidy.playback.pause"),
        play: _proxyFunc("mopidy.playback.play"),
        previous: _proxyFunc("mopidy.playback.previous"),
        resume: _proxyFunc("mopidy.playback.resume"),
        seek: _proxyFunc("mopidy.playback.seek"),
        setMute: _proxyFunc("mopidy.playback.setMute"),
        setState: _proxyFunc("mopidy.playback.setState"),
        setVolume: _proxyFunc("mopidy.playback.setVolume"),
        stop: _proxyFunc("mopidy.playback.stop")
    };

    this.playlists = {
        create: _proxyFunc("mopidy.playlists.create"),
        'delete': _proxyFunc("mopidy.playlists.delete"),
        filter: _proxyFunc("mopidy.playlists.filter"),
        getPlaylists: _proxyFunc("mopidy.playlists.getPlaylists"),
        lookup: _proxyFunc("mopidy.playlists.lookup"),
        refresh: _proxyFunc("mopidy.playlists.refresh"),
        save: _proxyFunc("mopidy.playlists.save")
    };

    this.tracklist = {
        add: _proxyFunc("mopidy.tracklist.add"),
        clear: _proxyFunc("mopidy.tracklist.clear"),
        eotTrack: _proxyFunc("mopidy.tracklist.eotTrack"),
        filter: _proxyFunc("mopidy.tracklist.filter"),
        getConsume: _proxyFunc("mopidy.tracklist.getConsume"),
        getLength: _proxyFunc("mopidy.tracklist.getLength"),
        getRandom: _proxyFunc("mopidy.tracklist.getRandom"),
        getRepeat: _proxyFunc("mopidy.tracklist.getRepeat"),
        getSingle: _proxyFunc("mopidy.tracklist.getSingle"),
        getTlTracks: _proxyFunc("mopidy.tracklist.getTlTracks"),
        getTracks: _proxyFunc("mopidy.tracklist.getTracks"),
        getVersion: _proxyFunc("mopidy.tracklist.getVersion"),
        index: _proxyFunc("mopidy.tracklist.index"),
        markPlayed: _proxyFunc("mopidy.tracklist.markPlayed"),
        markPlaying: _proxyFunc("mopidy.tracklist.markPlaying"),
        markUnplayable: _proxyFunc("mopidy.tracklist.markUnplayable"),
        move: _proxyFunc("mopidy.tracklist.move"),
        nextTrack: _proxyFunc("mopidy.tracklist.nextTrack"),
        previousTrack: _proxyFunc("mopidy.tracklist.previousTrack"),
        remove: _proxyFunc("mopidy.tracklist.remove"),
        setConsume: _proxyFunc("mopidy.tracklist.setConsume"),
        setRandom: _proxyFunc("mopidy.tracklist.setRandom"),
        setRepeat: _proxyFunc("mopidy.tracklist.setRepeat"),
        setSingle: _proxyFunc("mopidy.tracklist.setSingle"),
        shuffle: _proxyFunc("mopidy.tracklist.shuffle"),
        slice: _proxyFunc("mopidy.tracklist.slice")
    };
};

module.exports = new MopidyProxy();