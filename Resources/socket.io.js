require("socket.io-titanium");

module.exports = {
    io: io.connect(Alloy.CFG.host),
    reconnect: function() {
        this.io.socket.connect();
    },
    disconnect: function() {
        this.io.disconnect();
    }
};