var args = arguments[0] || {};

exports.testing = function(win) {
	alert(args.message);
	win.title = args.message;
}
