module.exports = function(_data, window, options) {
    function showMarquee() {
        if (animating && data.length > 0) {
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
    var data = _data || [];
    var dataIndex = 0;
    var animating = false;
    var direction = options.direction || "left";
    var directionChanged = false;
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
    var animation = Titanium.UI.createAnimation({
        curve: Titanium.UI.ANIMATION_CURVE_LINEAR,
        duration: options.duration || 5e3
    });
    if ("left" == direction) {
        label.updateLayout({
            left: 320,
            width: "100%",
            color: options.color || "#fff"
        });
        animation.setLeft(-320);
    } else if ("right" == direction) {
        label.updateLayout({
            right: 320,
            width: "100%",
            color: options.color || "#fff"
        });
        animation.setRight(-320);
    }
    var fade = Titanium.UI.createAnimation({
        duration: 1e3
    });
    options.location && ("bottom" === options.location ? view.bottom = 0 : "top" === options.location && (view.top = 0));
    view.add(label);
    win.add(view);
    window.add(win);
    animation.addEventListener("complete", function() {
        if ("left" == direction) {
            label.setLeft(320);
            label.setRight(null);
        } else if ("right" == direction) {
            label.setLeft(null);
            label.setRight(320);
        }
        if (directionChanged) {
            directionChanged = false;
            if ("right" == direction) {
                animation.setLeft(null);
                animation.setRight(-320);
            }
            if ("left" == direction) {
                animation.setLeft(-320);
                animation.setRight(null);
            }
        }
        dataIndex++;
        dataIndex >= data.length && (dataIndex = 0);
        showMarquee();
    });
    fade.addEventListener("complete", function() {
        animating && showMarquee();
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
                directionChanged = true;
                if (!animating) if ("left" == direction) {
                    label.setLeft(320);
                    label.setRight(null);
                    animation.setLeft(-320);
                    animation.setRight(null);
                } else if ("right" == direction) {
                    label.setLeft(null);
                    label.setRight(320);
                    animation.setLeft(null);
                    animation.setRight(-320);
                }
            }
        }
    };
};