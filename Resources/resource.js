function handleRequest(method, action, data, progress, next) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function(resp) {
        null != next && next(null, JSON.parse(resp.source.responseData));
    };
    xhr.onerror = function() {
        null != next && next("error", null);
    };
    if (progress) {
        xhr.ondatastream = function(e) {
            progress(Math.ceil(100 * e.progress));
        };
        xhr.onsendstream = function(e) {
            progress(Math.ceil(100 * e.progress));
        };
    }
    xhr.open(method, Alloy.CFG.host + action);
    xhr.setRequestHeader("X-CSRF-Token", Alloy.CFG.csrf);
    data.file && xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.send(data);
}

module.exports = function(template) {
    return {
        get: function(data, next, progress) {
            handleRequest("GET", template, data, progress, function(err, res) {
                null != next && next(err, res);
            });
        },
        post: function(data, next, progress) {
            handleRequest("POST", template, data, progress, function(err, res) {
                null != next && next(err, res);
            });
        },
        put: function(data, next, progress) {
            handleRequest("PUT", template, data, progress, function(err, res) {
                null != next && next(err, res);
            });
        },
        del: function(data, next, progress) {
            handleRequest("DELETE", template, data, progress, function(err, res) {
                null != next && next(err, res);
            });
        },
        upload: function(data, next, progress) {
            handleRequest("POST", template, data, progress, function(err, res) {
                null != next && next(err, res);
            });
        }
    };
};