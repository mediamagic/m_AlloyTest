var Cloud = require('ti.cloud');

Ti.App.Properties.setString('app_push_notification_token', null);

function login(username, password, autoSubscribe, next) {
	Cloud.Users.login({
		login: username,
		password: password
	}, function (e) {
		if (e.success) {
			var user = e.users[0];
			
			if(autoSubscribe) {
				if(user.id) {
					subscribe({
						channel:'main_channel',
						device_token:Ti.App.Properties.getString('app_push_notification_token')
					}, function(e) {
						if(e.success) {
							if(next) 
								next(user);
						} else {
							if(next) 
								next(e);
						}
					});
				} else {
					if(next) 
						next(user);
				}
			} else {
				if(next) 
					next(user);
			}
		} else {
			if(next)
				next(e);
		}
	});
}

function subscribe(options, next) {
	Cloud.PushNotifications.subscribe(options, function (e) {
	    if (e.success && next) {
	        next(e);
	    } else {
	        if(next)
	        	next(e);
	    }
	});
}

function notifications(username, password, next) {	
	Titanium.Network.registerForPushNotifications({
		types: [
			Titanium.Network.NOTIFICATION_TYPE_BADGE,
			Titanium.Network.NOTIFICATION_TYPE_ALERT,
			Titanium.Network.NOTIFICATION_TYPE_SOUND
		],
		success:function(e)
		{
			Ti.App.Properties.setString('app_push_notification_token', e.deviceToken);
			
			if(username && password) {
				login(username, password, next);
			}
		},
		error:function(e)
		{
			console.log("Error during registration: " + e.error);
		},
		callback:function(e)
		{
			console.log(e);
		}
	});	
	
	return {
		user: {
			create: function(options, next) {
				Cloud.Users.create(options, function (e) {
				    if (e.success) {
				        var user = e.users[0];
				        
				        if(next) {
				        	next({ userId:user.id, sessionId:Cloud.sessionId});
				        }
				        // alert('Success:\n' +
				            // 'id: ' + user.id + '\n' +
				            // 'sessionId: ' + Cloud.sessionId + '\n' +
				            // 'first name: ' + user.first_name + '\n' +
				            // 'last name: ' + user.last_name);
				    } else {
				        //alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				        if(next)
				        	next(e);
				    }
				});
			},
			login: login,
			subscribe: subscribe,
			unsuscribe: function(options, next) {
				Cloud.PushNotifications.unsubscribe(options, function (e) {
				    if (e.success && next) {
				        next(e);
				    } else {
				        if(next)
				        	next(e);
				    }
				});
			}
		}
	}
}

module.exports = notifications;
