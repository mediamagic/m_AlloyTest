module.exports = function(_data, window, options) {
	var data = _data || [];
	var dataIndex = 0;
	
	var animating = false;
	
	var direction = options.direction || 'left';
	var directionChanged = false;
	
	if(direction != 'left' && direction != 'right')
		direction = 'left';
	
	var view = Ti.UI.createView({
	    width:'100%',
	    height:options.height || 20,
	    backgroundColor:options.backgroundColor || '#000',
	    opacity:0
	});
	
	var label = Titanium.UI.createLabel();
	
	var animation = Titanium.UI.createAnimation({
	    curve: Titanium.UI.ANIMATION_CURVE_LINEAR,
	    duration:options.duration || 5000
	});
	
	if(direction == 'left') {
		label.updateLayout({ left:320, width:'100%', color:options.color || '#fff'});
		animation.setLeft(-320);
	} else if(direction == 'right') {
		label.updateLayout({ right:320, width:'100%', color:options.color || '#fff'});
		animation.setRight(-320);
	}
	
	var fade = Titanium.UI.createAnimation({
		duration:1000,
	});
	
	if(options.location) {
		if(options.location === 'bottom') {
			view.bottom = 0;
		} else if(options.location === 'top') {
			view.top = 0;
		}
	}
			 
	function showMarquee() {		
		if(animating && data.length > 0) {
			label.text = data[dataIndex];
			setTimeout(function() {
				label.animate(animation);
			}, 100);
		} else {
			animating = false;
			fade.opacity = 0;
			setTimeout(function() {
				view.animate(fade);
			}, 100);
		}
	}
			
	view.add(label);
	window.add(view);
	
	animation.addEventListener('complete',function() {    		
		if(direction == 'left') {
	    	label.setLeft(320);
			label.setRight(null);
	    } else if(direction == 'right') {
	    	label.setLeft(null);
			label.setRight(320);
	    }		    	
		
		if(directionChanged) {
			directionChanged = false;

		    if(direction == 'right') {	
				animation.setLeft(null);
				animation.setRight(-320);				
			}
			
			if(direction == 'left') {	
				animation.setLeft(-320);
				animation.setRight(null);
			}
	    }
	    
	    dataIndex++;
	    
	    if(dataIndex >= data.length)
	    	dataIndex = 0;
	    
	    showMarquee();
	});
	 
	fade.addEventListener('complete',function() {
		if(animating) {
			showMarquee();
		}
	});
	
	return {
		start:function() {
			if(data.length > 0 && !animating) {
				animating = true;
				fade.opacity = 1;
				setTimeout(function() {
					view.animate(fade);
				}, 100);				
			}			
		},		
		stop:function() {
			animating = false;
		},		
		reset:function() {
			if(animating) {
				dataIndex = -1;
			} else {
				dataIndex = 0;
			}
		},		
		setData:function(_data) {
			data = _data;
		},
		setDirection:function(_direction) {
			if(_direction == 'left' || _direction == 'right') {
				direction = _direction;			
				directionChanged = true;
				
				if(!animating) {
					if(direction == 'left') {
				    	label.setLeft(320);
						label.setRight(null);
						animation.setLeft(-320);
						animation.setRight(null);
				    } else if(direction == 'right') {
				    	label.setLeft(null);
						label.setRight(320);
						animation.setLeft(null);
						animation.setRight(-320);
				    }
				}
			}
		}
	}
}