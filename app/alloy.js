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
Alloy.Globals.notifications = require('notifications')('info', 'chipo$$2013', true, function(user) {
	
});
Alloy.Globals.socket = require('socket.io')(true);

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

// var Cloud = require('ti.cloud');
// 
// function subscribeToPushNotifications() {
	// alert('tring to subscribe');
	// Cloud.PushNotifications.subscribe({
	    // channel: 'main_channel',
	    // user_id:'517d407f378cdc672f00b3c6',
	    // device_token: Ti.App.Properties.getString('app_push_notification_token')
	// }, function (e) {
	    // if (e.success) {
	        // console.log('Success');
	    // } else {
	        // console.log('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	    // }
	// });
// }
// 
// function loginUser(username, password) {
	// Cloud.Users.login({
		// login: username,
		// password: password
	// }, function (e) {
		// if (e.success) {
			// var user = e.users[0];
			// console.log('Success:\\n' + 'id: ' + user.id + '\\n' + 'first name: ' + user.first_name + '\\n' +	'last name: ' + user.last_name);
			// subscribeToPushNotifications();
		// } else {
			// console.log('Error:\\n' +	((e.error && e.message) || JSON.stringify(e)));
		// }
	// });
// }
// 
// Ti.App.Properties.setString('app_push_notification_token', null);
// 
// Titanium.Network.registerForPushNotifications({
	// types: [
		// Titanium.Network.NOTIFICATION_TYPE_BADGE,
		// Titanium.Network.NOTIFICATION_TYPE_ALERT,
		// Titanium.Network.NOTIFICATION_TYPE_SOUND
	// ],
	// success:function(e)
	// {
		// console.log('******************************************************');
		// var deviceToken = e.deviceToken;
// 		
		// var pushToken = Ti.App.Properties.getString('app_push_notification_token');
// 		
		// if(pushToken) {
			// console.log('token already exists', pushToken);
			// if(deviceToken && pushToken != deviceToken) {
				// console.log('token is diferent', deviceToken);
				// Ti.App.Properties.setString('app_push_notification_token', deviceToken);
				// loginUser('info', 'chipo$$2013');
			// }
		// } else {
			// console.log('no pushToken');
			// if(deviceToken) {
				// console.log(deviceToken);
				// Ti.App.Properties.setString('app_push_notification_token', deviceToken);
				// loginUser('info', 'chipo$$2013');
			// }
		// }
		// console.log('******************************************************');
// 		
		// // console.log("Device registered. Device token: \n\n"+deviceToken);
		// // Ti.API.info("Push notification device token is: "+deviceToken);
		// // Ti.API.info("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		// // Ti.API.info("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
	// },
	// error:function(e)
	// {
		// console.log("Error during registration: "+e.error);
	// },
	// callback:function(e)
	// {
		// // called when a push notification is received.
		// console.log(e);
		// //alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
	// }
// });	
