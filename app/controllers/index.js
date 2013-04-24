//var m = require('module');

$.index.title = 'window';

// function test(e) {
	// m.test(e.source.customVar);
// }

function upload(e) {
	var dialog = Ti.UI.createOptionDialog({
		cancel:2,
		options:['Gallery', 'Camera', 'Cancel'],
		selectedIndex:1,
		destructive:2,
		title:'Upload From...?'
	});
	
	dialog.addEventListener('click', function(e) {
		var from = e.index == 0 ? 'gallery' : e.index == 1 ? 'camera' : 0;
		if(from != 0)
	    	Alloy.createController('uploadImage', { from:from }).upload($.uploadProgress);
	});
	
	dialog.show();
}

if (OS_IOS || OS_MOBILEWEB) {
    Alloy.Globals.navgroup = $.nav;
}

function testing(e) {
	Alloy.createController('test', { message:'message'}).testing($.win2);
}

function openNewWindow(e) {
	var newWindow = Alloy.createController('newwindow').getView();
	Alloy.Globals.navgroup.open(newWindow, { animated:true});
}

$.index.open();

var news = [
	'this is news row number 1',
	'this is news row number 2',
	'this is news row number 3',
	'this is news row number 4',
	'this is news row number 5',
];

var news1 = [
	'*this is news row number 1',
	'*this is news row number 2',
	'*this is news row number 3',
	'*this is news row number 4',
	'*this is news row number 5',
];

var Marquee = require('marquee');

var marquee = new Marquee(news, $.index, { 
	backgroundColor:'#000',
	color:'#fff',
	height:20,
	duration:9000,
	location:'bottom',
	direction:'left'
});


Alloy.Globals.socket.io.on('START_MARQUEE', function (data) {
	marquee.start();
});

Alloy.Globals.socket.io.on('STOP_MARQUEE', function (data) {
	marquee.stop();
});

Alloy.Globals.socket.io.on('RESET_MARQUEE', function (data) {
	marquee.reset();
});

Alloy.Globals.socket.io.on('UPDATE_MARQUEE', function (data) {
	marquee.setData(data);
});

Alloy.Globals.socket.io.on('SET_MARQUEE_DIRECTION', function (data) {
	marquee.setDirection(data.direction);
});

// var picker = Ti.UI.createPicker({
  // top:0,
  // useSpinner: false
// });
// 
// var data = [];
// data[0]=Ti.UI.createPickerRow({title:'Bananas'});
// data[1]=Ti.UI.createPickerRow({title:'Strawberries'});
// data[2]=Ti.UI.createPickerRow({title:'Mangos'});
// data[3]=Ti.UI.createPickerRow({title:'Grapes'});
// 
// picker.add(data);
// picker.selectionIndicator = true;
// 
// $.index.add(picker);
// 
// // must be after picker has been displayed
// picker.setSelectedRow(0, 2, true); // select Mangos
// 
// // picker.addEventListener('change',function(e){
  // // Ti.API.info(e);
// // });
// 
// picker.addEventListener('click',function(e){
  // Ti.API.info(e);
// });
