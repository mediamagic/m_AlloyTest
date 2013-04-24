var args = arguments[0] || {};
var Images = new Alloy.Globals.Resource('/images');

exports.upload = function(label) {
	switch(args.from) {
		case 'gallery':
			Titanium.Media.openPhotoGallery({
		        success: function(e){
		        	uploadImage(e.media, label);
		        },
		        error: function(error){
		            console.log('Image Gallery Error: '+error); 
		        },
		        cancel: function(){
		        },
		        allowImageEditing:true
		    });
		break;
		case 'camera':
			Ti.Media.showCamera({
				success: function(e) {
					uploadImage(e.media, label);
				},
				error: function(e) {
					alert('can\'t find a camera');
				},
				cancel: function(e) {
					
				},
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
				videoQuality:Ti.Media.QUALITY_HIGH
			});
		break;
		default:
		break;
	}
}

function uploadImage(image, label) {
	Images.upload({file:image, fileName:'test.jpg'}, function(err, res) {
    	label.text = 'Image Uploaded!';
    },
    function(percents) {
    	label.text = percents + '%';
    });
}
