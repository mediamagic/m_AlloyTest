var btn = Ti.UI.createButton({
	title:'Back'
});

$.newwindow.leftNavButton = btn;

btn.addEventListener('click', function(e) {
	Alloy.Globals.navgroup.close($.newwindow, { animated:true});
});

var Records = new Alloy.Globals.Resource('/records');

var sound = null;
//Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_RECORD;

var mic = Ti.Media.createAudioRecorder({
	format:Ti.Media.AUDIO_FILEFORMAT_WAVE,
	compression:Ti.Media.AUDIO_FORMAT_ULAW
});

$.btnRecord.addEventListener('touchstart', function(e) {
	Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_RECORD;
	
	mic.start();
	Ti.Media.startMicrophoneMonitor();	
});

$.btnRecord.addEventListener('touchend', function(e) {
	$.btnRecord.enabled = false;
	
	var file = mic.stop();		
	Ti.Media.stopMicrophoneMonitor();
	var fileName = (new Date()).getTime().toString() + '.wav';

	Records.upload({file:file.blob, fileName:fileName}, function(err, res) {
		if(!err)
			Alloy.Globals.socket.io.emit('SEND_SOUND', {sound:Alloy.CFG.host + '/records/' + fileName});
    	$.btnRecord.enabled = true;    	
    },
    function(percents) {
    	//$.label.text = percents + '%';
    });	
});

setTimeout(function()
{
        var peak = Ti.Media.peakMicrophonePower;
        var avg = Ti.Media.averageMicrophonePower;
        $.label.text = 'seconds\npeak power: '+peak+'\navg power: '+avg;
}, 200);

Alloy.Globals.socket.io.on('RECIEVE_SOUND', function (data) {
	Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
	sound = Ti.Media.createSound({ 
		url:data.sound,
	    allowBackground: true,
	    preload:false,
	    volume:1
	});	
	sound.play();
});
