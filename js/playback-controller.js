var mopidy = require('./mopidy');

var PlaybackController = function () {
    this.play = function(uri) {
        mopidy.tracklist.add(null, null, uri)
        .then(function(result) {
            return mopidy.playback.play();
        })
        .catch(function(reason) {
            console.error(reason);
        })
        
    };
};

module.exports = new PlaybackController();