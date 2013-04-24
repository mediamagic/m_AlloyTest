function performHandshake() {
    handshake.get({}, function(err, res) {
        err ? setTimeout(function() {
            performHandshake();
        }, 2e3) : Alloy.CFG.csrf = res.csrf;
    });
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Resource = require("resource");

Alloy.Globals.socket = require("socket.io");

var handshake = new Alloy.Globals.Resource("/handshake");

performHandshake();

Alloy.createController("index");