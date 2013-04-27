require('socket.io-titanium');

var initIO = io.connect(Alloy.CFG.host, {
  	'reconnect': false,
  	'force new connection':false,
    'auto connect': false
});

function socketModule(autoConnect) {
	
	if(autoConnect)
		initIO.socket.connect();
				
	return {
		io:initIO,
		connect: function() {	
			if(!this.io.socket.connected)	
				this.io.socket.connect();
		},
		disconnect: function() {			
			this.io.disconnect();
		}
	}
}

initIO.on('connect,disconnect', function () {
	console.log('nice!');
});

initIO.on('connect', function () {
    initIO.emit('DEVICE_CONNECTION', {deviceId:Ti.Platform.getId(), deviceName:Ti.Platform.getUsername()});
});

initIO.on('disconnect', function (e) {
	console.log('socket disconnected');
});

initIO.on('connect_error', reconnect);
initIO.on('connect_timeout', reconnect);
initIO.on('reconnect_error', reconnect);
initIO.on('reconnect_failed', reconnect);
initIO.on('error', reconnect);

function reconnect(e) {
	if(!initIO.socket.connected) {
		initIO.socket.disconnect();
		setTimeout(function() { initIO.socket.connect();}, 1000);
	}
}

Ti.App.addEventListener('resumed', function(e) {
	initIO.socket.connect();
});

Ti.App.addEventListener('pause', function(e) {
	initIO.disconnect();
});


module.exports = socketModule;