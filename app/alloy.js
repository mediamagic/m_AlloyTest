// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.Resource = require('resource');
Alloy.Globals.socket = require('socket.io');

var handshake = new Alloy.Globals.Resource('/handshake');

function performHandshake() {
	handshake.get({}, function(err, res) {
		if(!err) { 
			Alloy.CFG.csrf = res.csrf;
		} else {
			setTimeout(function() {
				performHandshake();	
			}, 2000);			
		}
	});
}

performHandshake();