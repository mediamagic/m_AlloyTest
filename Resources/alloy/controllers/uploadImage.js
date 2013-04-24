function Controller() {
    function uploadImage(image, label) {
        Images.upload({
            file: image,
            fileName: "test.jpg"
        }, function() {
            label.text = "Image Uploaded!";
        }, function(percents) {
            label.text = percents + "%";
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var Images = new Alloy.Globals.Resource("/images");
    exports.upload = function(label) {
        switch (args.from) {
          case "gallery":
            Titanium.Media.openPhotoGallery({
                success: function(e) {
                    uploadImage(e.media, label);
                },
                error: function(error) {
                    console.log("Image Gallery Error: " + error);
                },
                cancel: function() {},
                allowImageEditing: true
            });
            break;

          case "camera":
            Ti.Media.showCamera({
                success: function(e) {
                    uploadImage(e.media, label);
                },
                error: function() {
                    alert("can't find a camera");
                },
                cancel: function() {},
                allowEditing: true,
                mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
                videoQuality: Ti.Media.QUALITY_HIGH
            });
            break;

          default:        }
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;