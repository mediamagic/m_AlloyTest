var btn = Ti.UI.createButton({
	title:'Back'
});

$.newwindow.leftNavButton = btn;

btn.addEventListener('click', function(e) {
	Alloy.Globals.navgroup.close($.newwindow, { animated:true});
});
