function Controller() {
    function upload() {
        var dialog = Ti.UI.createOptionDialog({
            cancel: 2,
            options: [ "Gallery", "Camera", "Cancel" ],
            selectedIndex: 1,
            destructive: 2,
            title: "Upload From...?"
        });
        dialog.addEventListener("click", function(e) {
            var from = 0 == e.index ? "gallery" : 1 == e.index ? "camera" : 0;
            0 != from && Alloy.createController("uploadImage", {
                from: from
            }).upload($.uploadProgress);
        });
        dialog.show();
    }
    function testing() {
        Alloy.createController("test", {
            message: "message"
        }).testing($.win2);
    }
    function openNewWindow() {
        var newWindow = Alloy.createController("newwindow").getView();
        Alloy.Globals.navgroup.open(newWindow, {
            animated: true
        });
    }
    function performHandshake() {
        handshake.get({}, function(err, res) {
            err ? setTimeout(function() {
                performHandshake();
            }, 2e3) : Alloy.CFG.csrf = res.csrf;
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.win2 = Ti.UI.createWindow({
        id: "win2",
        title: "Red Window",
        backgroundColor: "red"
    });
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "Click Me",
        customVar: "works!",
        id: "__alloyId1"
    });
    $.__views.win2.add($.__views.__alloyId1);
    testing ? $.__views.__alloyId1.addEventListener("click", testing) : __defers["$.__views.__alloyId1!click!testing"] = true;
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Upload Image",
        top: "60",
        id: "__alloyId2"
    });
    $.__views.win2.add($.__views.__alloyId2);
    upload ? $.__views.__alloyId2.addEventListener("click", upload) : __defers["$.__views.__alloyId2!click!upload"] = true;
    $.__views.uploadProgress = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "uploadProgress",
        top: "90"
    });
    $.__views.win2.add($.__views.uploadProgress);
    $.__views.__alloyId3 = Ti.UI.createButton({
        title: "open new window",
        top: "10",
        id: "__alloyId3"
    });
    $.__views.win2.add($.__views.__alloyId3);
    openNewWindow ? $.__views.__alloyId3.addEventListener("click", openNewWindow) : __defers["$.__views.__alloyId3!click!openNewWindow"] = true;
    $.__views.nav = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.win2,
        id: "nav"
    });
    $.__views.index.add($.__views.nav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.title = "window";
    Alloy.Globals.Resource = require("resource");
    Alloy.Globals.navgroup = $.nav;
    $.index.open();
    var handshake = new Alloy.Globals.Resource("/handshake");
    performHandshake();
    Alloy.Globals.socket = require("socket.io");
    var news = [ "this is news row number 1", "this is news row number 2", "this is news row number 3", "this is news row number 4", "this is news row number 5" ];
    var Marquee = require("marquee");
    var marquee = new Marquee(news, $.index, {
        backgroundColor: "#000",
        color: "#fff",
        height: 20,
        duration: 9e3,
        location: "bottom",
        direction: "left"
    });
    Alloy.Globals.socket.io.on("START_MARQUEE", function() {
        marquee.start();
    });
    Alloy.Globals.socket.io.on("STOP_MARQUEE", function() {
        marquee.stop();
    });
    Alloy.Globals.socket.io.on("RESET_MARQUEE", function() {
        marquee.reset();
    });
    Alloy.Globals.socket.io.on("UPDATE_MARQUEE", function(data) {
        marquee.setData(data);
    });
    Alloy.Globals.socket.io.on("SET_MARQUEE_DIRECTION", function(data) {
        marquee.setDirection(data.direction);
    });
    __defers["$.__views.__alloyId1!click!testing"] && $.__views.__alloyId1.addEventListener("click", testing);
    __defers["$.__views.__alloyId2!click!upload"] && $.__views.__alloyId2.addEventListener("click", upload);
    __defers["$.__views.__alloyId3!click!openNewWindow"] && $.__views.__alloyId3.addEventListener("click", openNewWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;