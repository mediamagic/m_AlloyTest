module.exports = function(template) {
	return {
		get: function(data, next, progress) {				
			handleRequest('GET', template, data, progress, function(err, res) {
				if(next != null)
					next(err, res);
			});
		},
		post: function(data, next, progress) {
			handleRequest('POST', template, data, progress, function(err, res) {
				if(next != null)
					next(err, res);
			});
		},
		put: function(data, next, progress) {	
			handleRequest('PUT', template, data, progress, function(err, res) {
				if(next != null)
					next(err, res);
			});
		},
		del: function(data, next, progress) {
			handleRequest('DELETE', template, data, progress, function(err, res) {
				if(next != null)
					next(err, res);
			});
		},
		upload: function(data, next, progress) {
			handleRequest('POST', template, data, progress, function(err, res) {
				if(next != null)
					next(err, res);
			});
		}
	}
}

function handleRequest(method, action, data, progress, next) {
	var xhr = Ti.Network.createHTTPClient();
	//xhr.setRequestHeader('X-HTTP-Method-Override', method);
	
	xhr.onload = function(resp) {
		if(next != null) 
			next(null, JSON.parse(resp.source.responseData))
	}
	
	xhr.onerror = function() {
		if(next != null) 
			next('error', null);
	}
	
	if(progress) {
		xhr.ondatastream = function(e)
	  	{
	    	progress(Math.ceil((e.progress * 100)));		 
	    };
	 
		xhr.onsendstream = function(e)
	    {
	    	progress(Math.ceil((e.progress * 100)));		 
	    };
	}

	xhr.open(method, Alloy.CFG.host + action);
	xhr.setRequestHeader('X-CSRF-Token', Alloy.CFG.csrf);
	
	if(data.file)		
		xhr.setRequestHeader("enctype", "multipart/form-data");
	
	xhr.send(data);
}