function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.newwindow = Ti.UI.createWindow({
        title: "new window",
        backgroundColor: "blue",
        id: "newwindow"
    });
    $.__views.newwindow && $.addTopLevelView($.__views.newwindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var btn = Ti.UI.createButton({
        title: "Back"
    });
    $.newwindow.leftNavButton = btn;
    btn.addEventListener("click", function() {
        Alloy.Globals.navgroup.close($.newwindow, {
            animated: true
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;