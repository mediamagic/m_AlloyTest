module.exports = function(_data, window, options) {
    function showMarquee() {
        if (animating && data.length > 0) {
            view.remove(label);
            "left" == direction ? labelOptions = {
                left: width,
                width: "auto",
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                font: font,
                color: color,
                text: data[dataIndex]
            } : "right" == direction && (labelOptions = {
                right: width,
                width: "auto",
                textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                font: font,
                color: color,
                text: data[dataIndex]
            });
            label = Titanium.UI.createLabel();
            label.updateLayout(labelOptions);
            setAnimationValue();
            view.add(label);
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
    function setAnimationValue() {
        var newWidth = label.toImage().width;
        animationValue = -newWidth;
        label.setWidth(newWidth);
        adjustDuration(newWidth);
        if ("left" == direction) {
            animation.setLeft(animationValue);
            animation.setRight(null);
        } else if ("right" == direction) {
            animation.setLeft(null);
            animation.setRight(animationValue);
        }
    }
    function adjustDuration(labelWidth) {
        duration = options.duration || 5e3;
        var dif = 0;
        if (width > labelWidth) {
            dif = width - labelWidth;
            duration -= 10 * dif;
        } else if (labelWidth > width) {
            dif = labelWidth - width;
            duration += 10 * dif;
        }
        animation.setDuration(duration);
    }
    var data = _data || [];
    var dataIndex = 0;
    var font = options.font || {
        fontSize: 13
    };
    var color = options.color || "#fff";
    var duration = options.duration || 5e3;
    var animating = false;
    var width = Titanium.Platform.displayCaps.platformWidth;
    var animationValue = -width;
    var direction = options.direction || "left";
    var settingsChanged = false;
    "left" != direction && "right" != direction && (direction = "left");
    var win = Ti.UI.createWindow({
        width: "100%",
        backgroundColor: "transparent",
        tabBarHidden: true,
        touchEnabled: false
    });
    var view = Ti.UI.createView({
        width: "100%",
        height: options.height || 20,
        backgroundColor: options.backgroundColor || "#000",
        opacity: 0
    });
    var label = Titanium.UI.createLabel();
    var labelOptions = null;
    var animation = Titanium.UI.createAnimation({
        curve: Titanium.UI.ANIMATION_CURVE_LINEAR
    });
    var fade = Titanium.UI.createAnimation({
        duration: 1e3
    });
    options.location && ("bottom" === options.location ? view.bottom = 0 : "top" === options.location && (view.top = 0));
    view.add(label);
    win.add(view);
    window.add(win);
    animation.addEventListener("complete", function() {
        if (settingsChanged) {
            settingsChanged = false;
            width = Titanium.Platform.displayCaps.platformWidth;
        }
        dataIndex++;
        dataIndex >= data.length && (dataIndex = 0);
        showMarquee();
    });
    fade.addEventListener("complete", function() {
        animating && showMarquee();
    });
    Ti.Gesture.addEventListener("orientationchange", function() {
        settingsChanged = true;
    });
    return {
        start: function() {
            if (data.length > 0 && !animating) {
                animating = true;
                fade.opacity = 1;
                setTimeout(function() {
                    view.animate(fade);
                }, 100);
            }
        },
        stop: function() {
            animating = false;
        },
        reset: function() {
            dataIndex = animating ? -1 : 0;
        },
        setData: function(_data) {
            data = _data;
        },
        setDirection: function(_direction) {
            if ("left" == _direction || "right" == _direction) {
                direction = _direction;
                settingsChanged = true;
            }
        }
    };
};