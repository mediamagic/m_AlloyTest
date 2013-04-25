function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.newwindow = Ti.UI.createWindow({
        title: "new window",
        backgroundColor: "blue",
        id: "newwindow"
    });
    $.__views.newwindow && $.addTopLevelView($.__views.newwindow);
    $.__views.label = Ti.UI.createLabel({
        id: "label",
        top: "10"
    });
    $.__views.newwindow.add($.__views.label);
    $.__views.btnRecord = Ti.UI.createButton({
        title: "Hold To Talk",
        id: "btnRecord",
        top: "60"
    });
    $.__views.newwindow.add($.__views.btnRecord);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var btn = Ti.UI.createButton({
        title: "Back"
    });
    $.newwindow.leftNavButton = btn;
    btn.addEventListener("click", function() {
        Alloy.Globals.navgroup.close($.newwindow, {
            animated: true
        });
    });
    var Records = new Alloy.Globals.Resource("/records");
    var sound = null;
    var mic = Ti.Media.createAudioRecorder({
        format: Ti.Media.AUDIO_FILEFORMAT_WAVE,
        compression: Ti.Media.AUDIO_FORMAT_ULAW
    });
    $.btnRecord.addEventListener("touchstart", function() {
        Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_RECORD;
        mic.start();
    });
    $.btnRecord.addEventListener("touchend", function() {
        $.btnRecord.enabled = false;
        var file = mic.stop();
        var fileName = new Date().getTime().toString() + ".wav";
        Records.upload({
            file: file.blob,
            fileName: fileName
        }, function(err) {
            err || Alloy.Globals.socket.io.emit("SEND_SOUND", {
                sound: Alloy.CFG.host + "/records/" + fileName
            });
            $.btnRecord.enabled = true;
        }, function() {});
    });
    Alloy.Globals.socket.io.on("RECIEVE_SOUND", function(data) {
        Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
        sound = Ti.Media.createSound({
            url: data.sound,
            allowBackground: true,
            preload: false,
            volume: 1
        });
        sound.play();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;