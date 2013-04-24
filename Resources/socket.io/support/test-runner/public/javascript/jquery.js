(function(window, undefined) {
    function dataAttr(elem, key, data) {
        if (data === undefined && 1 === elem.nodeType) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            data = elem.getAttribute(name);
            if ("string" == typeof data) {
                try {
                    data = "true" === data ? true : "false" === data ? false : "null" === data ? null : jQuery.isNaN(data) ? rbrace.test(data) ? jQuery.parseJSON(data) : data : parseFloat(data);
                } catch (e) {}
                jQuery.data(elem, key, data);
            } else data = undefined;
        }
        return data;
    }
    function isEmptyDataObject(obj) {
        for (var name in obj) if ("toJSON" !== name) return false;
        return true;
    }
    function handleQueueMarkDefer(elem, type, src) {
        var deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", defer = jQuery.data(elem, deferDataKey, undefined, true);
        !defer || "queue" !== src && jQuery.data(elem, queueDataKey, undefined, true) || "mark" !== src && jQuery.data(elem, markDataKey, undefined, true) || setTimeout(function() {
            if (!jQuery.data(elem, queueDataKey, undefined, true) && !jQuery.data(elem, markDataKey, undefined, true)) {
                jQuery.removeData(elem, deferDataKey, true);
                defer.resolve();
            }
        }, 0);
    }
    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }
    function trigger(type, elem, args) {
        var event = jQuery.extend({}, args[0]);
        event.type = type;
        event.originalEvent = {};
        event.liveFired = undefined;
        jQuery.event.handle.call(elem, event);
        event.isDefaultPrevented() && args[0].preventDefault();
    }
    function liveHandler(event) {
        var stop, maxLevel, related, match, handleObj, elem, j, i, l, close, namespace, ret, elems = [], selectors = [], events = jQuery._data(this, "events");
        if (event.liveFired === this || !events || !events.live || event.target.disabled || event.button && "click" === event.type) return;
        event.namespace && (namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)"));
        event.liveFired = this;
        var live = events.live.slice(0);
        for (j = 0; live.length > j; j++) {
            handleObj = live[j];
            handleObj.origType.replace(rnamespaces, "") === event.type ? selectors.push(handleObj.selector) : live.splice(j--, 1);
        }
        match = jQuery(event.target).closest(selectors, event.currentTarget);
        for (i = 0, l = match.length; l > i; i++) {
            close = match[i];
            for (j = 0; live.length > j; j++) {
                handleObj = live[j];
                if (close.selector === handleObj.selector && (!namespace || namespace.test(handleObj.namespace)) && !close.elem.disabled) {
                    elem = close.elem;
                    related = null;
                    if ("mouseenter" === handleObj.preType || "mouseleave" === handleObj.preType) {
                        event.type = handleObj.preType;
                        related = jQuery(event.relatedTarget).closest(handleObj.selector)[0];
                        related && jQuery.contains(elem, related) && (related = elem);
                    }
                    related && related === elem || elems.push({
                        elem: elem,
                        handleObj: handleObj,
                        level: close.level
                    });
                }
            }
        }
        for (i = 0, l = elems.length; l > i; i++) {
            match = elems[i];
            if (maxLevel && match.level > maxLevel) break;
            event.currentTarget = match.elem;
            event.data = match.handleObj.data;
            event.handleObj = match.handleObj;
            ret = match.handleObj.origHandler.apply(match.elem, arguments);
            if (false === ret || event.isPropagationStopped()) {
                maxLevel = match.level;
                false === ret && (stop = false);
                if (event.isImmediatePropagationStopped()) break;
            }
        }
        return stop;
    }
    function liveConvert(type, selector) {
        return (type && "*" !== type ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
    }
    function isDisconnected(node) {
        return !node || !node.parentNode || 11 === node.parentNode.nodeType;
    }
    function winnow(elements, qualifier, keep) {
        qualifier = qualifier || 0;
        if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
            var retVal = !!qualifier.call(elem, i, elem);
            return retVal === keep;
        });
        if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
            return elem === qualifier === keep;
        });
        if ("string" == typeof qualifier) {
            var filtered = jQuery.grep(elements, function(elem) {
                return 1 === elem.nodeType;
            });
            if (isSimple.test(qualifier)) return jQuery.filter(qualifier, filtered, !keep);
            qualifier = jQuery.filter(qualifier, filtered);
        }
        return jQuery.grep(elements, function(elem) {
            return jQuery.inArray(elem, qualifier) >= 0 === keep;
        });
    }
    function root(elem) {
        return jQuery.nodeName(elem, "table") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }
    function cloneCopyEvent(src, dest) {
        if (1 !== dest.nodeType || !jQuery.hasData(src)) return;
        var internalKey = jQuery.expando, oldData = jQuery.data(src), curData = jQuery.data(dest, oldData);
        if (oldData = oldData[internalKey]) {
            var events = oldData.events;
            curData = curData[internalKey] = jQuery.extend({}, oldData);
            if (events) {
                delete curData.handle;
                curData.events = {};
                for (var type in events) for (var i = 0, l = events[type].length; l > i; i++) jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data);
            }
        }
    }
    function cloneFixAttributes(src, dest) {
        var nodeName;
        if (1 !== dest.nodeType) return;
        dest.clearAttributes && dest.clearAttributes();
        dest.mergeAttributes && dest.mergeAttributes(src);
        nodeName = dest.nodeName.toLowerCase();
        if ("object" === nodeName) dest.outerHTML = src.outerHTML; else if ("input" !== nodeName || "checkbox" !== src.type && "radio" !== src.type) "option" === nodeName ? dest.selected = src.defaultSelected : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue); else {
            src.checked && (dest.defaultChecked = dest.checked = src.checked);
            dest.value !== src.value && (dest.value = src.value);
        }
        dest.removeAttribute(jQuery.expando);
    }
    function getAll(elem) {
        return "getElementsByTagName" in elem ? elem.getElementsByTagName("*") : "querySelectorAll" in elem ? elem.querySelectorAll("*") : [];
    }
    function fixDefaultChecked(elem) {
        ("checkbox" === elem.type || "radio" === elem.type) && (elem.defaultChecked = elem.checked);
    }
    function findInputs(elem) {
        jQuery.nodeName(elem, "input") ? fixDefaultChecked(elem) : "getElementsByTagName" in elem && jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
    }
    function evalScript(i, elem) {
        elem.src ? jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
        }) : jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
        elem.parentNode && elem.parentNode.removeChild(elem);
    }
    function getWH(elem, name, extra) {
        var val = "width" === name ? elem.offsetWidth : elem.offsetHeight, which = "width" === name ? cssWidth : cssHeight;
        if (val > 0) {
            "border" !== extra && jQuery.each(which, function() {
                extra || (val -= parseFloat(jQuery.css(elem, "padding" + this)) || 0);
                "margin" === extra ? val += parseFloat(jQuery.css(elem, extra + this)) || 0 : val -= parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0;
            });
            return val + "px";
        }
        val = curCSS(elem, name, name);
        (0 > val || null == val) && (val = elem.style[name] || 0);
        val = parseFloat(val) || 0;
        extra && jQuery.each(which, function() {
            val += parseFloat(jQuery.css(elem, "padding" + this)) || 0;
            "padding" !== extra && (val += parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0);
            "margin" === extra && (val += parseFloat(jQuery.css(elem, extra + this)) || 0);
        });
        return val + "px";
    }
    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            if ("string" != typeof dataTypeExpression) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }
            if (jQuery.isFunction(func)) {
                var dataType, list, placeBefore, dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax), i = 0, length = dataTypes.length;
                for (;length > i; i++) {
                    dataType = dataTypes[i];
                    placeBefore = /^\+/.test(dataType);
                    placeBefore && (dataType = dataType.substr(1) || "*");
                    list = structure[dataType] = structure[dataType] || [];
                    list[placeBefore ? "unshift" : "push"](func);
                }
            }
        };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
        dataType = dataType || options.dataTypes[0];
        inspected = inspected || {};
        inspected[dataType] = true;
        var selection, list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = structure === prefilters;
        for (;length > i && (executeOnly || !selection); i++) {
            selection = list[i](options, originalOptions, jqXHR);
            if ("string" == typeof selection) if (!executeOnly || inspected[selection]) selection = undefined; else {
                options.dataTypes.unshift(selection);
                selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
            }
        }
        !executeOnly && selection || inspected["*"] || (selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected));
        return selection;
    }
    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) src[key] !== undefined && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        deep && jQuery.extend(true, target, deep);
    }
    function buildParams(prefix, obj, traditional, add) {
        if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
            traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
        }); else if (traditional || null == obj || "object" != typeof obj) add(prefix, obj); else for (var name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
    }
    function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
        for (type in responseFields) type in responses && (jqXHR[responseFields[type]] = responses[type]);
        while ("*" === dataTypes[0]) {
            dataTypes.shift();
            ct === undefined && (ct = s.mimeType || jqXHR.getResponseHeader("content-type"));
        }
        if (ct) for (type in contents) if (contents[type] && contents[type].test(ct)) {
            dataTypes.unshift(type);
            break;
        }
        if (dataTypes[0] in responses) finalDataType = dataTypes[0]; else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                firstDataType || (firstDataType = type);
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
            finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType);
            return responses[finalDataType];
        }
    }
    function ajaxConvert(s, response) {
        s.dataFilter && (response = s.dataFilter(response, s.dataType));
        var i, key, tmp, prev, conversion, conv, conv1, conv2, dataTypes = s.dataTypes, converters = {}, length = dataTypes.length, current = dataTypes[0];
        for (i = 1; length > i; i++) {
            if (1 === i) for (key in s.converters) "string" == typeof key && (converters[key.toLowerCase()] = s.converters[key]);
            prev = current;
            current = dataTypes[i];
            if ("*" === current) current = prev; else if ("*" !== prev && prev !== current) {
                conversion = prev + " " + current;
                conv = converters[conversion] || converters["* " + current];
                if (!conv) {
                    conv2 = undefined;
                    for (conv1 in converters) {
                        tmp = conv1.split(" ");
                        if (tmp[0] === prev || "*" === tmp[0]) {
                            conv2 = converters[tmp[1] + " " + current];
                            if (conv2) {
                                conv1 = converters[conv1];
                                true === conv1 ? conv = conv2 : true === conv2 && (conv = conv1);
                                break;
                            }
                        }
                    }
                }
                conv || conv2 || jQuery.error("No conversion from " + conversion.replace(" ", " to "));
                true !== conv && (response = conv ? conv(response) : conv2(conv1(response)));
            }
        }
        return response;
    }
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {}
    }
    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    function createFxNow() {
        setTimeout(clearFxNow, 0);
        return fxNow = jQuery.now();
    }
    function clearFxNow() {
        fxNow = undefined;
    }
    function genFx(type, num) {
        var obj = {};
        jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function() {
            obj[this] = type;
        });
        return obj;
    }
    function defaultDisplay(nodeName) {
        if (!elemdisplay[nodeName]) {
            var body = document.body, elem = jQuery("<" + nodeName + ">").appendTo(body), display = elem.css("display");
            elem.remove();
            if ("none" === display || "" === display) {
                if (!iframe) {
                    iframe = document.createElement("iframe");
                    iframe.frameBorder = iframe.width = iframe.height = 0;
                }
                body.appendChild(iframe);
                if (!iframeDoc || !iframe.createElement) {
                    iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
                    iframeDoc.write(("CSS1Compat" === document.compatMode ? "<!doctype html>" : "") + "<html><body>");
                    iframeDoc.close();
                }
                elem = iframeDoc.createElement(nodeName);
                iframeDoc.body.appendChild(elem);
                display = jQuery.css(elem, "display");
                body.removeChild(iframe);
            }
            elemdisplay[nodeName] = display;
        }
        return elemdisplay[nodeName];
    }
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType ? elem.defaultView || elem.parentWindow : false;
    }
    var document = window.document, navigator = window.navigator, location = window.location;
    var jQuery = function() {
        function doScrollCheck() {
            if (jQuery.isReady) return;
            try {
                document.documentElement.doScroll("left");
            } catch (e) {
                setTimeout(doScrollCheck, 1);
                return;
            }
            jQuery.ready();
        }
        var rootjQuery, browserMatch, readyList, DOMContentLoaded, jQuery = function(selector, context) {
            return new jQuery.fn.init(selector, context, rootjQuery);
        }, _jQuery = window.jQuery, _$ = window.$, quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, rnotwhite = /\S/, trimLeft = /^\s+/, trimRight = /\s+$/, rdigit = /\d/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, rvalidchars = /^[\],:{}\s]*$/, rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rwebkit = /(webkit)[ \/]([\w.]+)/, ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/, rmsie = /(msie) ([\w.]+)/, rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/, rdashAlpha = /-([a-z]|[0-9])/gi, rmsPrefix = /^-ms-/, fcamelCase = function(all, letter) {
            return (letter + "").toUpperCase();
        }, userAgent = navigator.userAgent, toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf, class2type = {};
        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function(selector, context, rootjQuery) {
                var match, elem, ret, doc;
                if (!selector) return this;
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }
                if ("body" === selector && !context && document.body) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }
                if ("string" == typeof selector) {
                    match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [ null, selector, null ] : quickExpr.exec(selector);
                    if (!match || !match[1] && context) return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        doc = context ? context.ownerDocument || context : document;
                        ret = rsingleTag.exec(selector);
                        if (ret) if (jQuery.isPlainObject(context)) {
                            selector = [ document.createElement(ret[1]) ];
                            jQuery.fn.attr.call(selector, context, true);
                        } else selector = [ doc.createElement(ret[1]) ]; else {
                            ret = jQuery.buildFragment([ match[1] ], [ doc ]);
                            selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                        }
                        return jQuery.merge(this, selector);
                    }
                    elem = document.getElementById(match[2]);
                    if (elem && elem.parentNode) {
                        if (elem.id !== match[2]) return rootjQuery.find(selector);
                        this.length = 1;
                        this[0] = elem;
                    }
                    this.context = document;
                    this.selector = selector;
                    return this;
                }
                if (jQuery.isFunction(selector)) return rootjQuery.ready(selector);
                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }
                return jQuery.makeArray(selector, this);
            },
            selector: "",
            jquery: "1.6.4",
            length: 0,
            size: function() {
                return this.length;
            },
            toArray: function() {
                return slice.call(this, 0);
            },
            get: function(num) {
                return null == num ? this.toArray() : 0 > num ? this[this.length + num] : this[num];
            },
            pushStack: function(elems, name, selector) {
                var ret = this.constructor();
                jQuery.isArray(elems) ? push.apply(ret, elems) : jQuery.merge(ret, elems);
                ret.prevObject = this;
                ret.context = this.context;
                "find" === name ? ret.selector = this.selector + (this.selector ? " " : "") + selector : name && (ret.selector = this.selector + "." + name + "(" + selector + ")");
                return ret;
            },
            each: function(callback, args) {
                return jQuery.each(this, callback, args);
            },
            ready: function(fn) {
                jQuery.bindReady();
                readyList.done(fn);
                return this;
            },
            eq: function(i) {
                return -1 === i ? this.slice(i) : this.slice(i, +i + 1);
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            slice: function() {
                return this.pushStack(slice.apply(this, arguments), "slice", slice.call(arguments).join(","));
            },
            map: function(callback) {
                return this.pushStack(jQuery.map(this, function(elem, i) {
                    return callback.call(elem, i, elem);
                }));
            },
            end: function() {
                return this.prevObject || this.constructor(null);
            },
            push: push,
            sort: [].sort,
            splice: [].splice
        };
        jQuery.fn.init.prototype = jQuery.fn;
        jQuery.extend = jQuery.fn.extend = function() {
            var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
            if ("boolean" == typeof target) {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            "object" == typeof target || jQuery.isFunction(target) || (target = {});
            if (length === i) {
                target = this;
                --i;
            }
            for (;length > i; i++) if (null != (options = arguments[i])) for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) continue;
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];
                    } else clone = src && jQuery.isPlainObject(src) ? src : {};
                    target[name] = jQuery.extend(deep, clone, copy);
                } else copy !== undefined && (target[name] = copy);
            }
            return target;
        };
        jQuery.extend({
            noConflict: function(deep) {
                window.$ === jQuery && (window.$ = _$);
                deep && window.jQuery === jQuery && (window.jQuery = _jQuery);
                return jQuery;
            },
            isReady: false,
            readyWait: 1,
            holdReady: function(hold) {
                hold ? jQuery.readyWait++ : jQuery.ready(true);
            },
            ready: function(wait) {
                if (true === wait && !--jQuery.readyWait || true !== wait && !jQuery.isReady) {
                    if (!document.body) return setTimeout(jQuery.ready, 1);
                    jQuery.isReady = true;
                    if (true !== wait && --jQuery.readyWait > 0) return;
                    readyList.resolveWith(document, [ jQuery ]);
                    jQuery.fn.trigger && jQuery(document).trigger("ready").unbind("ready");
                }
            },
            bindReady: function() {
                if (readyList) return;
                readyList = jQuery._Deferred();
                if ("complete" === document.readyState) return setTimeout(jQuery.ready, 1);
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    window.addEventListener("load", jQuery.ready, false);
                } else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange", DOMContentLoaded);
                    window.attachEvent("onload", jQuery.ready);
                    var toplevel = false;
                    try {
                        toplevel = null == window.frameElement;
                    } catch (e) {}
                    document.documentElement.doScroll && toplevel && doScrollCheck();
                }
            },
            isFunction: function(obj) {
                return "function" === jQuery.type(obj);
            },
            isArray: Array.isArray || function(obj) {
                return "array" === jQuery.type(obj);
            },
            isWindow: function(obj) {
                return obj && "object" == typeof obj && "setInterval" in obj;
            },
            isNaN: function(obj) {
                return null == obj || !rdigit.test(obj) || isNaN(obj);
            },
            type: function(obj) {
                return null == obj ? String(obj) : class2type[toString.call(obj)] || "object";
            },
            isPlainObject: function(obj) {
                if (!obj || "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj)) return false;
                try {
                    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) return false;
                } catch (e) {
                    return false;
                }
                var key;
                for (key in obj) ;
                return key === undefined || hasOwn.call(obj, key);
            },
            isEmptyObject: function(obj) {
                for (var name in obj) return false;
                return true;
            },
            error: function(msg) {
                throw msg;
            },
            parseJSON: function(data) {
                if ("string" != typeof data || !data) return null;
                data = jQuery.trim(data);
                if (window.JSON && window.JSON.parse) return window.JSON.parse(data);
                if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) return new Function("return " + data)();
                jQuery.error("Invalid JSON: " + data);
            },
            parseXML: function(data) {
                var xml, tmp;
                try {
                    if (window.DOMParser) {
                        tmp = new DOMParser();
                        xml = tmp.parseFromString(data, "text/xml");
                    } else {
                        xml = new ActiveXObject("Microsoft.XMLDOM");
                        xml.async = "false";
                        xml.loadXML(data);
                    }
                } catch (e) {
                    xml = undefined;
                }
                xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data);
                return xml;
            },
            noop: function() {},
            globalEval: function(data) {
                data && rnotwhite.test(data) && (window.execScript || function(data) {
                    window["eval"].call(window, data);
                })(data);
            },
            camelCase: function(string) {
                return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
            },
            nodeName: function(elem, name) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },
            each: function(object, callback, args) {
                var name, i = 0, length = object.length, isObj = length === undefined || jQuery.isFunction(object);
                if (args) {
                    if (isObj) {
                        for (name in object) if (false === callback.apply(object[name], args)) break;
                    } else for (;length > i; ) if (false === callback.apply(object[i++], args)) break;
                } else if (isObj) {
                    for (name in object) if (false === callback.call(object[name], name, object[name])) break;
                } else for (;length > i; ) if (false === callback.call(object[i], i, object[i++])) break;
                return object;
            },
            trim: trim ? function(text) {
                return null == text ? "" : trim.call(text);
            } : function(text) {
                return null == text ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
            },
            makeArray: function(array, results) {
                var ret = results || [];
                if (null != array) {
                    var type = jQuery.type(array);
                    null == array.length || "string" === type || "function" === type || "regexp" === type || jQuery.isWindow(array) ? push.call(ret, array) : jQuery.merge(ret, array);
                }
                return ret;
            },
            inArray: function(elem, array) {
                if (!array) return -1;
                if (indexOf) return indexOf.call(array, elem);
                for (var i = 0, length = array.length; length > i; i++) if (array[i] === elem) return i;
                return -1;
            },
            merge: function(first, second) {
                var i = first.length, j = 0;
                if ("number" == typeof second.length) for (var l = second.length; l > j; j++) first[i++] = second[j]; else while (second[j] !== undefined) first[i++] = second[j++];
                first.length = i;
                return first;
            },
            grep: function(elems, callback, inv) {
                var retVal, ret = [];
                inv = !!inv;
                for (var i = 0, length = elems.length; length > i; i++) {
                    retVal = !!callback(elems[i], i);
                    inv !== retVal && ret.push(elems[i]);
                }
                return ret;
            },
            map: function(elems, callback, arg) {
                var value, key, ret = [], i = 0, length = elems.length, isArray = elems instanceof jQuery || length !== undefined && "number" == typeof length && (length > 0 && elems[0] && elems[length - 1] || 0 === length || jQuery.isArray(elems));
                if (isArray) for (;length > i; i++) {
                    value = callback(elems[i], i, arg);
                    null != value && (ret[ret.length] = value);
                } else for (key in elems) {
                    value = callback(elems[key], key, arg);
                    null != value && (ret[ret.length] = value);
                }
                return ret.concat.apply([], ret);
            },
            guid: 1,
            proxy: function(fn, context) {
                if ("string" == typeof context) {
                    var tmp = fn[context];
                    context = fn;
                    fn = tmp;
                }
                if (!jQuery.isFunction(fn)) return undefined;
                var args = slice.call(arguments, 2), proxy = function() {
                    return fn.apply(context, args.concat(slice.call(arguments)));
                };
                proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
                return proxy;
            },
            access: function(elems, key, value, exec, fn, pass) {
                var length = elems.length;
                if ("object" == typeof key) {
                    for (var k in key) jQuery.access(elems, k, key[k], exec, fn, value);
                    return elems;
                }
                if (value !== undefined) {
                    exec = !pass && exec && jQuery.isFunction(value);
                    for (var i = 0; length > i; i++) fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    return elems;
                }
                return length ? fn(elems[0], key) : undefined;
            },
            now: function() {
                return new Date().getTime();
            },
            uaMatch: function(ua) {
                ua = ua.toLowerCase();
                var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || 0 > ua.indexOf("compatible") && rmozilla.exec(ua) || [];
                return {
                    browser: match[1] || "",
                    version: match[2] || "0"
                };
            },
            sub: function() {
                function jQuerySub(selector, context) {
                    return new jQuerySub.fn.init(selector, context);
                }
                jQuery.extend(true, jQuerySub, this);
                jQuerySub.superclass = this;
                jQuerySub.fn = jQuerySub.prototype = this();
                jQuerySub.fn.constructor = jQuerySub;
                jQuerySub.sub = this.sub;
                jQuerySub.fn.init = function(selector, context) {
                    context && context instanceof jQuery && !(context instanceof jQuerySub) && (context = jQuerySub(context));
                    return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
                };
                jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub;
            },
            browser: {}
        });
        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });
        browserMatch = jQuery.uaMatch(userAgent);
        if (browserMatch.browser) {
            jQuery.browser[browserMatch.browser] = true;
            jQuery.browser.version = browserMatch.version;
        }
        jQuery.browser.webkit && (jQuery.browser.safari = true);
        if (rnotwhite.test(" ")) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }
        rootjQuery = jQuery(document);
        document.addEventListener ? DOMContentLoaded = function() {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            jQuery.ready();
        } : document.attachEvent && (DOMContentLoaded = function() {
            if ("complete" === document.readyState) {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                jQuery.ready();
            }
        });
        return jQuery;
    }();
    var promiseMethods = "done fail isResolved isRejected promise then always pipe".split(" "), sliceDeferred = [].slice;
    jQuery.extend({
        _Deferred: function() {
            var fired, firing, cancelled, callbacks = [], deferred = {
                done: function() {
                    if (!cancelled) {
                        var i, length, elem, type, _fired, args = arguments;
                        if (fired) {
                            _fired = fired;
                            fired = 0;
                        }
                        for (i = 0, length = args.length; length > i; i++) {
                            elem = args[i];
                            type = jQuery.type(elem);
                            "array" === type ? deferred.done.apply(deferred, elem) : "function" === type && callbacks.push(elem);
                        }
                        _fired && deferred.resolveWith(_fired[0], _fired[1]);
                    }
                    return this;
                },
                resolveWith: function(context, args) {
                    if (!cancelled && !fired && !firing) {
                        args = args || [];
                        firing = 1;
                        try {
                            while (callbacks[0]) callbacks.shift().apply(context, args);
                        } finally {
                            fired = [ context, args ];
                            firing = 0;
                        }
                    }
                    return this;
                },
                resolve: function() {
                    deferred.resolveWith(this, arguments);
                    return this;
                },
                isResolved: function() {
                    return !!(firing || fired);
                },
                cancel: function() {
                    cancelled = 1;
                    callbacks = [];
                    return this;
                }
            };
            return deferred;
        },
        Deferred: function(func) {
            var promise, deferred = jQuery._Deferred(), failDeferred = jQuery._Deferred();
            jQuery.extend(deferred, {
                then: function(doneCallbacks, failCallbacks) {
                    deferred.done(doneCallbacks).fail(failCallbacks);
                    return this;
                },
                always: function() {
                    return deferred.done.apply(deferred, arguments).fail.apply(this, arguments);
                },
                fail: failDeferred.done,
                rejectWith: failDeferred.resolveWith,
                reject: failDeferred.resolve,
                isRejected: failDeferred.isResolved,
                pipe: function(fnDone, fnFail) {
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each({
                            done: [ fnDone, "resolve" ],
                            fail: [ fnFail, "reject" ]
                        }, function(handler, data) {
                            var returned, fn = data[0], action = data[1];
                            jQuery.isFunction(fn) ? deferred[handler](function() {
                                returned = fn.apply(this, arguments);
                                returned && jQuery.isFunction(returned.promise) ? returned.promise().then(newDefer.resolve, newDefer.reject) : newDefer[action + "With"](this === deferred ? newDefer : this, [ returned ]);
                            }) : deferred[handler](newDefer[action]);
                        });
                    }).promise();
                },
                promise: function(obj) {
                    if (null == obj) {
                        if (promise) return promise;
                        promise = obj = {};
                    }
                    var i = promiseMethods.length;
                    while (i--) obj[promiseMethods[i]] = deferred[promiseMethods[i]];
                    return obj;
                }
            });
            deferred.done(failDeferred.cancel).fail(deferred.cancel);
            delete deferred.cancel;
            func && func.call(deferred, deferred);
            return deferred;
        },
        when: function(firstParam) {
            function resolveFunc(i) {
                return function(value) {
                    args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                    --count || deferred.resolveWith(deferred, sliceDeferred.call(args, 0));
                };
            }
            var args = arguments, i = 0, length = args.length, count = length, deferred = 1 >= length && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred();
            if (length > 1) {
                for (;length > i; i++) args[i] && jQuery.isFunction(args[i].promise) ? args[i].promise().then(resolveFunc(i), deferred.reject) : --count;
                count || deferred.resolveWith(deferred, args);
            } else deferred !== firstParam && deferred.resolveWith(deferred, length ? [ firstParam ] : []);
            return deferred.promise();
        }
    });
    jQuery.support = function() {
        var all, a, select, opt, input, marginDiv, support, fragment, body, testElementParent, testElement, testElementStyle, tds, eventName, i, isSupported, div = document.createElement("div"), documentElement = document.documentElement;
        div.setAttribute("className", "t");
        div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[0];
        if (!all || !all.length || !a) return {};
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];
        support = {
            leadingWhitespace: 3 === div.firstChild.nodeType,
            tbody: !div.getElementsByTagName("tbody").length,
            htmlSerialize: !!div.getElementsByTagName("link").length,
            style: /top/.test(a.getAttribute("style")),
            hrefNormalized: "/a" === a.getAttribute("href"),
            opacity: /^0.55$/.test(a.style.opacity),
            cssFloat: !!a.style.cssFloat,
            checkOn: "on" === input.value,
            optSelected: opt.selected,
            getSetAttribute: "t" !== div.className,
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true
        };
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }
        if (!div.addEventListener && div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", function() {
                support.noCloneEvent = false;
            });
            div.cloneNode(true).fireEvent("onclick");
        }
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = "t" === input.value;
        input.setAttribute("checked", "checked");
        div.appendChild(input);
        fragment = document.createDocumentFragment();
        fragment.appendChild(div.firstChild);
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "";
        div.style.width = div.style.paddingLeft = "1px";
        body = document.getElementsByTagName("body")[0];
        testElement = document.createElement(body ? "div" : "body");
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        body && jQuery.extend(testElementStyle, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
        for (i in testElementStyle) testElement.style[i] = testElementStyle[i];
        testElement.appendChild(div);
        testElementParent = body || documentElement;
        testElementParent.insertBefore(testElement, testElementParent.firstChild);
        support.appendChecked = input.checked;
        support.boxModel = 2 === div.offsetWidth;
        if ("zoom" in div.style) {
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = 2 === div.offsetWidth;
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = 2 !== div.offsetWidth;
        }
        div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName("td");
        isSupported = 0 === tds[0].offsetHeight;
        tds[0].style.display = "";
        tds[1].style.display = "none";
        support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight;
        div.innerHTML = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            marginDiv = document.createElement("div");
            marginDiv.style.width = "0";
            marginDiv.style.marginRight = "0";
            div.appendChild(marginDiv);
            support.reliableMarginRight = 0 === (parseInt((document.defaultView.getComputedStyle(marginDiv, null) || {
                marginRight: 0
            }).marginRight, 10) || 0);
        }
        testElement.innerHTML = "";
        testElementParent.removeChild(testElement);
        if (div.attachEvent) for (i in {
            submit: 1,
            change: 1,
            focusin: 1
        }) {
            eventName = "on" + i;
            isSupported = eventName in div;
            if (!isSupported) {
                div.setAttribute(eventName, "return;");
                isSupported = "function" == typeof div[eventName];
            }
            support[i + "Bubbles"] = isSupported;
        }
        testElement = fragment = select = opt = body = marginDiv = div = input = null;
        return support;
    }();
    jQuery.boxModel = jQuery.support.boxModel;
    var rbrace = /^(?:\{.*\}|\[.*\])$/, rmultiDash = /([A-Z])/g;
    jQuery.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: true,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: true
        },
        hasData: function(elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        data: function(elem, name, data, pvt) {
            if (!jQuery.acceptData(elem)) return;
            var thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : elem[jQuery.expando] && jQuery.expando;
            if ((!id || pvt && id && cache[id] && !cache[id][internalKey]) && getByName && data === undefined) return;
            id || (isNode ? elem[jQuery.expando] = id = ++jQuery.uuid : id = jQuery.expando);
            if (!cache[id]) {
                cache[id] = {};
                isNode || (cache[id].toJSON = jQuery.noop);
            }
            ("object" == typeof name || "function" == typeof name) && (pvt ? cache[id][internalKey] = jQuery.extend(cache[id][internalKey], name) : cache[id] = jQuery.extend(cache[id], name));
            thisCache = cache[id];
            if (pvt) {
                thisCache[internalKey] || (thisCache[internalKey] = {});
                thisCache = thisCache[internalKey];
            }
            data !== undefined && (thisCache[jQuery.camelCase(name)] = data);
            if ("events" === name && !thisCache[name]) return thisCache[internalKey] && thisCache[internalKey].events;
            if (getByName) {
                ret = thisCache[name];
                null == ret && (ret = thisCache[jQuery.camelCase(name)]);
            } else ret = thisCache;
            return ret;
        },
        removeData: function(elem, name, pvt) {
            if (!jQuery.acceptData(elem)) return;
            var thisCache, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
            if (!cache[id]) return;
            if (name) {
                thisCache = pvt ? cache[id][internalKey] : cache[id];
                if (thisCache) {
                    thisCache[name] || (name = jQuery.camelCase(name));
                    delete thisCache[name];
                    if (!isEmptyDataObject(thisCache)) return;
                }
            }
            if (pvt) {
                delete cache[id][internalKey];
                if (!isEmptyDataObject(cache[id])) return;
            }
            var internalCache = cache[id][internalKey];
            jQuery.support.deleteExpando || !cache.setInterval ? delete cache[id] : cache[id] = null;
            if (internalCache) {
                cache[id] = {};
                isNode || (cache[id].toJSON = jQuery.noop);
                cache[id][internalKey] = internalCache;
            } else isNode && (jQuery.support.deleteExpando ? delete elem[jQuery.expando] : elem.removeAttribute ? elem.removeAttribute(jQuery.expando) : elem[jQuery.expando] = null);
        },
        _data: function(elem, name, data) {
            return jQuery.data(elem, name, data, true);
        },
        acceptData: function(elem) {
            if (elem.nodeName) {
                var match = jQuery.noData[elem.nodeName.toLowerCase()];
                if (match) return !(true === match || elem.getAttribute("classid") !== match);
            }
            return true;
        }
    });
    jQuery.fn.extend({
        data: function(key, value) {
            var data = null;
            if ("undefined" == typeof key) {
                if (this.length) {
                    data = jQuery.data(this[0]);
                    if (1 === this[0].nodeType) {
                        var name, attr = this[0].attributes;
                        for (var i = 0, l = attr.length; l > i; i++) {
                            name = attr[i].name;
                            if (0 === name.indexOf("data-")) {
                                name = jQuery.camelCase(name.substring(5));
                                dataAttr(this[0], name, data[name]);
                            }
                        }
                    }
                }
                return data;
            }
            if ("object" == typeof key) return this.each(function() {
                jQuery.data(this, key);
            });
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";
            if (value === undefined) {
                data = this.triggerHandler("getData" + parts[1] + "!", [ parts[0] ]);
                if (data === undefined && this.length) {
                    data = jQuery.data(this[0], key);
                    data = dataAttr(this[0], key, data);
                }
                return data === undefined && parts[1] ? this.data(parts[0]) : data;
            }
            return this.each(function() {
                var $this = jQuery(this), args = [ parts[0], value ];
                $this.triggerHandler("setData" + parts[1] + "!", args);
                jQuery.data(this, key, value);
                $this.triggerHandler("changeData" + parts[1] + "!", args);
            });
        },
        removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key);
            });
        }
    });
    jQuery.extend({
        _mark: function(elem, type) {
            if (elem) {
                type = (type || "fx") + "mark";
                jQuery.data(elem, type, (jQuery.data(elem, type, undefined, true) || 0) + 1, true);
            }
        },
        _unmark: function(force, elem, type) {
            if (true !== force) {
                type = elem;
                elem = force;
                force = false;
            }
            if (elem) {
                type = type || "fx";
                var key = type + "mark", count = force ? 0 : (jQuery.data(elem, key, undefined, true) || 1) - 1;
                if (count) jQuery.data(elem, key, count, true); else {
                    jQuery.removeData(elem, key, true);
                    handleQueueMarkDefer(elem, type, "mark");
                }
            }
        },
        queue: function(elem, type, data) {
            if (elem) {
                type = (type || "fx") + "queue";
                var q = jQuery.data(elem, type, undefined, true);
                data && (!q || jQuery.isArray(data) ? q = jQuery.data(elem, type, jQuery.makeArray(data), true) : q.push(data));
                return q || [];
            }
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), fn = queue.shift();
            "inprogress" === fn && (fn = queue.shift());
            if (fn) {
                "fx" === type && queue.unshift("inprogress");
                fn.call(elem, function() {
                    jQuery.dequeue(elem, type);
                });
            }
            if (!queue.length) {
                jQuery.removeData(elem, type + "queue", true);
                handleQueueMarkDefer(elem, type, "queue");
            }
        }
    });
    jQuery.fn.extend({
        queue: function(type, data) {
            if ("string" != typeof type) {
                data = type;
                type = "fx";
            }
            if (data === undefined) return jQuery.queue(this[0], type);
            return this.each(function() {
                var queue = jQuery.queue(this, type, data);
                "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        delay: function(time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";
            return this.queue(type, function() {
                var elem = this;
                setTimeout(function() {
                    jQuery.dequeue(elem, type);
                }, time);
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        promise: function(type, object) {
            function resolve() {
                --count || defer.resolveWith(elements, [ elements ]);
            }
            if ("string" != typeof type) {
                object = type;
                type = undefined;
            }
            type = type || "fx";
            var tmp, defer = jQuery.Deferred(), elements = this, i = elements.length, count = 1, deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark";
            while (i--) if (tmp = jQuery.data(elements[i], deferDataKey, undefined, true) || (jQuery.data(elements[i], queueDataKey, undefined, true) || jQuery.data(elements[i], markDataKey, undefined, true)) && jQuery.data(elements[i], deferDataKey, jQuery._Deferred(), true)) {
                count++;
                tmp.done(resolve);
            }
            resolve();
            return defer.promise();
        }
    });
    var nodeHook, boolHook, rclass = /[\n\t\r]/g, rspace = /\s+/, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea)?$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;
    jQuery.fn.extend({
        attr: function(name, value) {
            return jQuery.access(this, name, value, true, jQuery.attr);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        },
        prop: function(name, value) {
            return jQuery.access(this, name, value, true, jQuery.prop);
        },
        removeProp: function(name) {
            name = jQuery.propFix[name] || name;
            return this.each(function() {
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) {}
            });
        },
        addClass: function(value) {
            var classNames, i, l, elem, setClass, c, cl;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, this.className));
            });
            if (value && "string" == typeof value) {
                classNames = value.split(rspace);
                for (i = 0, l = this.length; l > i; i++) {
                    elem = this[i];
                    if (1 === elem.nodeType) if (elem.className || 1 !== classNames.length) {
                        setClass = " " + elem.className + " ";
                        for (c = 0, cl = classNames.length; cl > c; c++) ~setClass.indexOf(" " + classNames[c] + " ") || (setClass += classNames[c] + " ");
                        elem.className = jQuery.trim(setClass);
                    } else elem.className = value;
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classNames, i, l, elem, className, c, cl;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, this.className));
            });
            if (value && "string" == typeof value || value === undefined) {
                classNames = (value || "").split(rspace);
                for (i = 0, l = this.length; l > i; i++) {
                    elem = this[i];
                    if (1 === elem.nodeType && elem.className) if (value) {
                        className = (" " + elem.className + " ").replace(rclass, " ");
                        for (c = 0, cl = classNames.length; cl > c; c++) className = className.replace(" " + classNames[c] + " ", " ");
                        elem.className = jQuery.trim(className);
                    } else elem.className = "";
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value, isBool = "boolean" == typeof stateVal;
            if (jQuery.isFunction(value)) return this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            });
            return this.each(function() {
                if ("string" === type) {
                    var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(rspace);
                    while (className = classNames[i++]) {
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }
                } else if ("undefined" === type || "boolean" === type) {
                    this.className && jQuery._data(this, "__className__", this.className);
                    this.className = this.className || false === value ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },
        hasClass: function(selector) {
            var className = " " + selector + " ";
            for (var i = 0, l = this.length; l > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) return true;
            return false;
        },
        val: function(value) {
            var hooks, ret, elem = this[0];
            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) return ret;
                    ret = elem.value;
                    return "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret;
                }
                return undefined;
            }
            var isFunction = jQuery.isFunction(value);
            return this.each(function(i) {
                var val, self = jQuery(this);
                if (1 !== this.nodeType) return;
                val = isFunction ? value.call(this, i, self.val()) : value;
                null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                    return null == value ? "" : value + "";
                }));
                hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];
                hooks && "set" in hooks && hooks.set(this, val, "value") !== undefined || (this.value = val);
            });
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function(elem) {
                    var value, index = elem.selectedIndex, values = [], options = elem.options, one = "select-one" === elem.type;
                    if (0 > index) return null;
                    for (var i = one ? index : 0, max = one ? index + 1 : options.length; max > i; i++) {
                        var option = options[i];
                        if (!(!option.selected || (jQuery.support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup"))) {
                            value = jQuery(option).val();
                            if (one) return value;
                            values.push(value);
                        }
                    }
                    if (one && !values.length && options.length) return jQuery(options[index]).val();
                    return values;
                },
                set: function(elem, value) {
                    var values = jQuery.makeArray(value);
                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });
                    values.length || (elem.selectedIndex = -1);
                    return values;
                }
            }
        },
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },
        attrFix: {
            tabindex: "tabIndex"
        },
        attr: function(elem, name, value, pass) {
            var nType = elem.nodeType;
            if (!elem || 3 === nType || 8 === nType || 2 === nType) return undefined;
            if (pass && name in jQuery.attrFn) return jQuery(elem)[name](value);
            if (!("getAttribute" in elem)) return jQuery.prop(elem, name, value);
            var ret, hooks, notxml = 1 !== nType || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.attrFix[name] || name;
                hooks = jQuery.attrHooks[name];
                hooks || (rboolean.test(name) ? hooks = boolHook : nodeHook && (hooks = nodeHook));
            }
            if (value !== undefined) {
                if (null === value) {
                    jQuery.removeAttr(elem, name);
                    return undefined;
                }
                if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined) return ret;
                elem.setAttribute(name, "" + value);
                return value;
            }
            if (hooks && "get" in hooks && notxml && null !== (ret = hooks.get(elem, name))) return ret;
            ret = elem.getAttribute(name);
            return null === ret ? undefined : ret;
        },
        removeAttr: function(elem, name) {
            var propName;
            if (1 === elem.nodeType) {
                name = jQuery.attrFix[name] || name;
                jQuery.attr(elem, name, "");
                elem.removeAttribute(name);
                rboolean.test(name) && (propName = jQuery.propFix[name] || name) in elem && (elem[propName] = false);
            }
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (rtype.test(elem.nodeName) && elem.parentNode) jQuery.error("type property can't be changed"); else if (!jQuery.support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        val && (elem.value = val);
                        return value;
                    }
                }
            },
            value: {
                get: function(elem, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) return nodeHook.get(elem, name);
                    return name in elem ? elem.value : null;
                },
                set: function(elem, value, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button")) return nodeHook.set(elem, value, name);
                    elem.value = value;
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(elem, name, value) {
            var nType = elem.nodeType;
            if (!elem || 3 === nType || 8 === nType || 2 === nType) return undefined;
            var ret, hooks, notxml = 1 !== nType || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            return value !== undefined ? hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    var attributeNode = elem.getAttributeNode("tabindex");
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    });
    jQuery.attrHooks.tabIndex = jQuery.propHooks.tabIndex;
    boolHook = {
        get: function(elem, name) {
            var attrNode;
            return true === jQuery.prop(elem, name) || (attrNode = elem.getAttributeNode(name)) && false !== attrNode.nodeValue ? name.toLowerCase() : undefined;
        },
        set: function(elem, value, name) {
            var propName;
            if (false === value) jQuery.removeAttr(elem, name); else {
                propName = jQuery.propFix[name] || name;
                propName in elem && (elem[propName] = true);
                elem.setAttribute(name, name.toLowerCase());
            }
            return name;
        }
    };
    if (!jQuery.support.getSetAttribute) {
        nodeHook = jQuery.valHooks.button = {
            get: function(elem, name) {
                var ret;
                ret = elem.getAttributeNode(name);
                return ret && "" !== ret.nodeValue ? ret.nodeValue : undefined;
            },
            set: function(elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    ret = document.createAttribute(name);
                    elem.setAttributeNode(ret);
                }
                return ret.nodeValue = value + "";
            }
        };
        jQuery.each([ "width", "height" ], function(i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                set: function(elem, value) {
                    if ("" === value) {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            });
        });
    }
    jQuery.support.hrefNormalized || jQuery.each([ "href", "src", "width", "height" ], function(i, name) {
        jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
            get: function(elem) {
                var ret = elem.getAttribute(name, 2);
                return null === ret ? undefined : ret;
            }
        });
    });
    jQuery.support.style || (jQuery.attrHooks.style = {
        get: function(elem) {
            return elem.style.cssText.toLowerCase() || undefined;
        },
        set: function(elem, value) {
            return elem.style.cssText = "" + value;
        }
    });
    jQuery.support.optSelected || (jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
        get: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
                parent.selectedIndex;
                parent.parentNode && parent.parentNode.selectedIndex;
            }
            return null;
        }
    }));
    jQuery.support.checkOn || jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[this] = {
            get: function(elem) {
                return null === elem.getAttribute("value") ? "on" : elem.value;
            }
        };
    });
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function(elem, value) {
                if (jQuery.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
            }
        });
    });
    var rnamespaces = /\.(.*)$/, rformElems = /^(?:textarea|input|select)$/i, rperiod = /\./g, rspaces = / /g, rescape = /[^\w\s.|`]/g, fcleanup = function(nm) {
        return nm.replace(rescape, "\\$&");
    };
    jQuery.event = {
        add: function(elem, types, handler, data) {
            if (3 === elem.nodeType || 8 === elem.nodeType) return;
            if (false === handler) handler = returnFalse; else if (!handler) return;
            var handleObjIn, handleObj;
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }
            handler.guid || (handler.guid = jQuery.guid++);
            var elemData = jQuery._data(elem);
            if (!elemData) return;
            var events = elemData.events, eventHandle = elemData.handle;
            events || (elemData.events = events = {});
            eventHandle || (elemData.handle = eventHandle = function(e) {
                return "undefined" == typeof jQuery || e && jQuery.event.triggered === e.type ? undefined : jQuery.event.handle.apply(eventHandle.elem, arguments);
            });
            eventHandle.elem = elem;
            types = types.split(" ");
            var type, namespaces, i = 0;
            while (type = types[i++]) {
                handleObj = handleObjIn ? jQuery.extend({}, handleObjIn) : {
                    handler: handler,
                    data: data
                };
                if (type.indexOf(".") > -1) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    handleObj.namespace = namespaces.slice(0).sort().join(".");
                } else {
                    namespaces = [];
                    handleObj.namespace = "";
                }
                handleObj.type = type;
                handleObj.guid || (handleObj.guid = handler.guid);
                var handlers = events[type], special = jQuery.event.special[type] || {};
                if (!handlers) {
                    handlers = events[type] = [];
                    special.setup && false !== special.setup.call(elem, data, namespaces, eventHandle) || (elem.addEventListener ? elem.addEventListener(type, eventHandle, false) : elem.attachEvent && elem.attachEvent("on" + type, eventHandle));
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    handleObj.handler.guid || (handleObj.handler.guid = handler.guid);
                }
                handlers.push(handleObj);
                jQuery.event.global[type] = true;
            }
            elem = null;
        },
        global: {},
        remove: function(elem, types, handler, pos) {
            if (3 === elem.nodeType || 8 === elem.nodeType) return;
            false === handler && (handler = returnFalse);
            var ret, type, j, all, namespaces, namespace, special, eventType, handleObj, origType, i = 0, elemData = jQuery.hasData(elem) && jQuery._data(elem), events = elemData && elemData.events;
            if (!elemData || !events) return;
            if (types && types.type) {
                handler = types.handler;
                types = types.type;
            }
            if (!types || "string" == typeof types && "." === types.charAt(0)) {
                types = types || "";
                for (type in events) jQuery.event.remove(elem, type + types);
                return;
            }
            types = types.split(" ");
            while (type = types[i++]) {
                origType = type;
                handleObj = null;
                all = 0 > type.indexOf(".");
                namespaces = [];
                if (!all) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    namespace = new RegExp("(^|\\.)" + jQuery.map(namespaces.slice(0).sort(), fcleanup).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }
                eventType = events[type];
                if (!eventType) continue;
                if (!handler) {
                    for (j = 0; eventType.length > j; j++) {
                        handleObj = eventType[j];
                        if (all || namespace.test(handleObj.namespace)) {
                            jQuery.event.remove(elem, origType, handleObj.handler, j);
                            eventType.splice(j--, 1);
                        }
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                for (j = pos || 0; eventType.length > j; j++) {
                    handleObj = eventType[j];
                    if (handler.guid === handleObj.guid) {
                        if (all || namespace.test(handleObj.namespace)) {
                            null == pos && eventType.splice(j--, 1);
                            special.remove && special.remove.call(elem, handleObj);
                        }
                        if (null != pos) break;
                    }
                }
                if (0 === eventType.length || null != pos && 1 === eventType.length) {
                    special.teardown && false !== special.teardown.call(elem, namespaces) || jQuery.removeEvent(elem, type, elemData.handle);
                    ret = null;
                    delete events[type];
                }
            }
            if (jQuery.isEmptyObject(events)) {
                var handle = elemData.handle;
                handle && (handle.elem = null);
                delete elemData.events;
                delete elemData.handle;
                jQuery.isEmptyObject(elemData) && jQuery.removeData(elem, undefined, true);
            }
        },
        customEvent: {
            getData: true,
            setData: true,
            changeData: true
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var exclusive, type = event.type || event, namespaces = [];
            if (type.indexOf("!") >= 0) {
                type = type.slice(0, -1);
                exclusive = true;
            }
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) return;
            event = "object" == typeof event ? event[jQuery.expando] ? event : new jQuery.Event(type, event) : new jQuery.Event(type);
            event.type = type;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
            if (onlyHandlers || !elem) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (!elem) {
                jQuery.each(jQuery.cache, function() {
                    var internalKey = jQuery.expando, internalCache = this[internalKey];
                    internalCache && internalCache.events && internalCache.events[type] && jQuery.event.trigger(event, data, internalCache.handle.elem);
                });
                return;
            }
            if (3 === elem.nodeType || 8 === elem.nodeType) return;
            event.result = undefined;
            event.target = elem;
            data = null != data ? jQuery.makeArray(data) : [];
            data.unshift(event);
            var cur = elem, ontype = 0 > type.indexOf(":") ? "on" + type : "";
            do {
                var handle = jQuery._data(cur, "handle");
                event.currentTarget = cur;
                handle && handle.apply(cur, data);
                if (ontype && jQuery.acceptData(cur) && cur[ontype] && false === cur[ontype].apply(cur, data)) {
                    event.result = false;
                    event.preventDefault();
                }
                cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
            } while (cur && !event.isPropagationStopped());
            if (!event.isDefaultPrevented()) {
                var old, special = jQuery.event.special[type] || {};
                if (!(special._default && false !== special._default.call(elem.ownerDocument, event) || "click" === type && jQuery.nodeName(elem, "a") || !jQuery.acceptData(elem))) {
                    try {
                        if (ontype && elem[type]) {
                            old = elem[ontype];
                            old && (elem[ontype] = null);
                            jQuery.event.triggered = type;
                            elem[type]();
                        }
                    } catch (ieError) {}
                    old && (elem[ontype] = old);
                    jQuery.event.triggered = undefined;
                }
            }
            return event.result;
        },
        handle: function(event) {
            event = jQuery.event.fix(event || window.event);
            var handlers = ((jQuery._data(this, "events") || {})[event.type] || []).slice(0), run_all = !event.exclusive && !event.namespace, args = Array.prototype.slice.call(arguments, 0);
            args[0] = event;
            event.currentTarget = this;
            for (var j = 0, l = handlers.length; l > j; j++) {
                var handleObj = handlers[j];
                if (run_all || event.namespace_re.test(handleObj.namespace)) {
                    event.handler = handleObj.handler;
                    event.data = handleObj.data;
                    event.handleObj = handleObj;
                    var ret = handleObj.handler.apply(this, args);
                    if (ret !== undefined) {
                        event.result = ret;
                        if (false === ret) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                    if (event.isImmediatePropagationStopped()) break;
                }
            }
            return event.result;
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function(event) {
            if (event[jQuery.expando]) return event;
            var originalEvent = event;
            event = jQuery.Event(originalEvent);
            for (var prop, i = this.props.length; i; ) {
                prop = this.props[--i];
                event[prop] = originalEvent[prop];
            }
            event.target || (event.target = event.srcElement || document);
            3 === event.target.nodeType && (event.target = event.target.parentNode);
            !event.relatedTarget && event.fromElement && (event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement);
            if (null == event.pageX && null != event.clientX) {
                var eventDocument = event.target.ownerDocument || document, doc = eventDocument.documentElement, body = eventDocument.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            null != event.which || null == event.charCode && null == event.keyCode || (event.which = null != event.charCode ? event.charCode : event.keyCode);
            !event.metaKey && event.ctrlKey && (event.metaKey = event.ctrlKey);
            event.which || event.button === undefined || (event.which = 1 & event.button ? 1 : 2 & event.button ? 3 : 4 & event.button ? 2 : 0);
            return event;
        },
        guid: 1e8,
        proxy: jQuery.proxy,
        special: {
            ready: {
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },
            live: {
                add: function(handleObj) {
                    jQuery.event.add(this, liveConvert(handleObj.origType, handleObj.selector), jQuery.extend({}, handleObj, {
                        handler: liveHandler,
                        guid: handleObj.handler.guid
                    }));
                },
                remove: function(handleObj) {
                    jQuery.event.remove(this, liveConvert(handleObj.origType, handleObj.selector), handleObj);
                }
            },
            beforeunload: {
                setup: function(data, namespaces, eventHandle) {
                    jQuery.isWindow(this) && (this.onbeforeunload = eventHandle);
                },
                teardown: function(namespaces, eventHandle) {
                    this.onbeforeunload === eventHandle && (this.onbeforeunload = null);
                }
            }
        }
    };
    jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
        elem.removeEventListener && elem.removeEventListener(type, handle, false);
    } : function(elem, type, handle) {
        elem.detachEvent && elem.detachEvent("on" + type, handle);
    };
    jQuery.Event = function(src, props) {
        if (!this.preventDefault) return new jQuery.Event(src, props);
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || false === src.returnValue || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse;
        } else this.type = src;
        props && jQuery.extend(this, props);
        this.timeStamp = jQuery.now();
        this[jQuery.expando] = true;
    };
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (!e) return;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if (!e) return;
            e.stopPropagation && e.stopPropagation();
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };
    var withinElement = function(event) {
        var related = event.relatedTarget, inside = false, eventType = event.type;
        event.type = event.data;
        if (related !== this) {
            related && (inside = jQuery.contains(this, related));
            if (!inside) {
                jQuery.event.handle.apply(this, arguments);
                event.type = eventType;
            }
        }
    }, delegate = function(event) {
        event.type = event.data;
        jQuery.event.handle.apply(this, arguments);
    };
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            setup: function(data) {
                jQuery.event.add(this, fix, data && data.selector ? delegate : withinElement, orig);
            },
            teardown: function(data) {
                jQuery.event.remove(this, fix, data && data.selector ? delegate : withinElement);
            }
        };
    });
    jQuery.support.submitBubbles || (jQuery.event.special.submit = {
        setup: function() {
            if (jQuery.nodeName(this, "form")) return false;
            jQuery.event.add(this, "click.specialSubmit", function(e) {
                var elem = e.target, type = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.type : "";
                "submit" !== type && "image" !== type || !jQuery(elem).closest("form").length || trigger("submit", this, arguments);
            });
            jQuery.event.add(this, "keypress.specialSubmit", function(e) {
                var elem = e.target, type = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.type : "";
                "text" !== type && "password" !== type || !jQuery(elem).closest("form").length || 13 !== e.keyCode || trigger("submit", this, arguments);
            });
        },
        teardown: function() {
            jQuery.event.remove(this, ".specialSubmit");
        }
    });
    if (!jQuery.support.changeBubbles) {
        var changeFilters, getVal = function(elem) {
            var type = jQuery.nodeName(elem, "input") ? elem.type : "", val = elem.value;
            "radio" === type || "checkbox" === type ? val = elem.checked : "select-multiple" === type ? val = elem.selectedIndex > -1 ? jQuery.map(elem.options, function(elem) {
                return elem.selected;
            }).join("-") : "" : jQuery.nodeName(elem, "select") && (val = elem.selectedIndex);
            return val;
        }, testChange = function testChange(e) {
            var data, val, elem = e.target;
            if (!rformElems.test(elem.nodeName) || elem.readOnly) return;
            data = jQuery._data(elem, "_change_data");
            val = getVal(elem);
            ("focusout" !== e.type || "radio" !== elem.type) && jQuery._data(elem, "_change_data", val);
            if (data === undefined || val === data) return;
            if (null != data || val) {
                e.type = "change";
                e.liveFired = undefined;
                jQuery.event.trigger(e, arguments[1], elem);
            }
        };
        jQuery.event.special.change = {
            filters: {
                focusout: testChange,
                beforedeactivate: testChange,
                click: function(e) {
                    var elem = e.target, type = jQuery.nodeName(elem, "input") ? elem.type : "";
                    ("radio" === type || "checkbox" === type || jQuery.nodeName(elem, "select")) && testChange.call(this, e);
                },
                keydown: function(e) {
                    var elem = e.target, type = jQuery.nodeName(elem, "input") ? elem.type : "";
                    (13 === e.keyCode && !jQuery.nodeName(elem, "textarea") || 32 === e.keyCode && ("checkbox" === type || "radio" === type) || "select-multiple" === type) && testChange.call(this, e);
                },
                beforeactivate: function(e) {
                    var elem = e.target;
                    jQuery._data(elem, "_change_data", getVal(elem));
                }
            },
            setup: function() {
                if ("file" === this.type) return false;
                for (var type in changeFilters) jQuery.event.add(this, type + ".specialChange", changeFilters[type]);
                return rformElems.test(this.nodeName);
            },
            teardown: function() {
                jQuery.event.remove(this, ".specialChange");
                return rformElems.test(this.nodeName);
            }
        };
        changeFilters = jQuery.event.special.change.filters;
        changeFilters.focus = changeFilters.beforeactivate;
    }
    jQuery.support.focusinBubbles || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        function handler(donor) {
            var e = jQuery.event.fix(donor);
            e.type = fix;
            e.originalEvent = {};
            jQuery.event.trigger(e, null, e.target);
            e.isDefaultPrevented() && donor.preventDefault();
        }
        var attaches = 0;
        jQuery.event.special[fix] = {
            setup: function() {
                0 === attaches++ && document.addEventListener(orig, handler, true);
            },
            teardown: function() {
                0 === --attaches && document.removeEventListener(orig, handler, true);
            }
        };
    });
    jQuery.each([ "bind", "one" ], function(i, name) {
        jQuery.fn[name] = function(type, data, fn) {
            var handler;
            if ("object" == typeof type) {
                for (var key in type) this[name](key, data, type[key], fn);
                return this;
            }
            if (2 === arguments.length || false === data) {
                fn = data;
                data = undefined;
            }
            if ("one" === name) {
                handler = function(event) {
                    jQuery(this).unbind(event, handler);
                    return fn.apply(this, arguments);
                };
                handler.guid = fn.guid || jQuery.guid++;
            } else handler = fn;
            if ("unload" === type && "one" !== name) this.one(type, data, fn); else for (var i = 0, l = this.length; l > i; i++) jQuery.event.add(this[i], type, handler, data);
            return this;
        };
    });
    jQuery.fn.extend({
        unbind: function(type, fn) {
            if ("object" != typeof type || type.preventDefault) for (var i = 0, l = this.length; l > i; i++) jQuery.event.remove(this[i], type, fn); else for (var key in type) this.unbind(key, type[key]);
            return this;
        },
        delegate: function(selector, types, data, fn) {
            return this.live(types, data, fn, selector);
        },
        undelegate: function(selector, types, fn) {
            return 0 === arguments.length ? this.unbind("live") : this.die(types, null, fn, selector);
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            if (this[0]) return jQuery.event.trigger(type, data, this[0], true);
        },
        toggle: function(fn) {
            var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function(event) {
                var lastToggle = (jQuery.data(this, "lastToggle" + fn.guid) || 0) % i;
                jQuery.data(this, "lastToggle" + fn.guid, lastToggle + 1);
                event.preventDefault();
                return args[lastToggle].apply(this, arguments) || false;
            };
            toggler.guid = guid;
            while (args.length > i) args[i++].guid = guid;
            return this.click(toggler);
        },
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });
    var liveMap = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    jQuery.each([ "live", "die" ], function(i, name) {
        jQuery.fn[name] = function(types, data, fn, origSelector) {
            var type, match, namespaces, preType, i = 0, selector = origSelector || this.selector, context = origSelector ? this : jQuery(this.context);
            if ("object" == typeof types && !types.preventDefault) {
                for (var key in types) context[name](key, data, types[key], selector);
                return this;
            }
            if ("die" === name && !types && origSelector && "." === origSelector.charAt(0)) {
                context.unbind(origSelector);
                return this;
            }
            if (false === data || jQuery.isFunction(data)) {
                fn = data || returnFalse;
                data = undefined;
            }
            types = (types || "").split(" ");
            while (null != (type = types[i++])) {
                match = rnamespaces.exec(type);
                namespaces = "";
                if (match) {
                    namespaces = match[0];
                    type = type.replace(rnamespaces, "");
                }
                if ("hover" === type) {
                    types.push("mouseenter" + namespaces, "mouseleave" + namespaces);
                    continue;
                }
                preType = type;
                if (liveMap[type]) {
                    types.push(liveMap[type] + namespaces);
                    type += namespaces;
                } else type = (liveMap[type] || type) + namespaces;
                if ("live" === name) for (var j = 0, l = context.length; l > j; j++) jQuery.event.add(context[j], "live." + liveConvert(type, selector), {
                    data: data,
                    selector: selector,
                    handler: fn,
                    origType: type,
                    origHandler: fn,
                    preType: preType
                }); else context.unbind("live." + liveConvert(type, selector), fn);
            }
            return this;
        };
    });
    jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function(i, name) {
        jQuery.fn[name] = function(data, fn) {
            if (null == fn) {
                fn = data;
                data = null;
            }
            return arguments.length > 0 ? this.bind(name, data, fn) : this.trigger(name);
        };
        jQuery.attrFn && (jQuery.attrFn[name] = true);
    });
    (function() {
        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; l > i; i++) {
                var elem = checkSet[i];
                if (elem) {
                    var match = false;
                    elem = elem[dir];
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }
                        if (1 === elem.nodeType && !isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break;
                        }
                        elem = elem[dir];
                    }
                    checkSet[i] = match;
                }
            }
        }
        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; l > i; i++) {
                var elem = checkSet[i];
                if (elem) {
                    var match = false;
                    elem = elem[dir];
                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }
                        if (1 === elem.nodeType) {
                            if (!isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }
                            if ("string" != typeof cur) {
                                if (elem === cur) {
                                    match = true;
                                    break;
                                }
                            } else if (Sizzle.filter(cur, [ elem ]).length > 0) {
                                match = elem;
                                break;
                            }
                        }
                        elem = elem[dir];
                    }
                    checkSet[i] = match;
                }
            }
        }
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, done = 0, toString = Object.prototype.toString, hasDuplicate = false, baseHasDuplicate = true, rBackslash = /\\/g, rNonWord = /\W/;
        [ 0, 0 ].sort(function() {
            baseHasDuplicate = false;
            return 0;
        });
        var Sizzle = function(selector, context, results, seed) {
            results = results || [];
            context = context || document;
            var origContext = context;
            if (1 !== context.nodeType && 9 !== context.nodeType) return [];
            if (!selector || "string" != typeof selector) return results;
            var m, set, checkSet, extra, ret, cur, pop, i, prune = true, contextXML = Sizzle.isXML(context), parts = [], soFar = selector;
            do {
                chunker.exec("");
                m = chunker.exec(soFar);
                if (m) {
                    soFar = m[3];
                    parts.push(m[1]);
                    if (m[2]) {
                        extra = m[3];
                        break;
                    }
                }
            } while (m);
            if (parts.length > 1 && origPOS.exec(selector)) if (2 === parts.length && Expr.relative[parts[0]]) set = posProcess(parts[0] + parts[1], context); else {
                set = Expr.relative[parts[0]] ? [ context ] : Sizzle(parts.shift(), context);
                while (parts.length) {
                    selector = parts.shift();
                    Expr.relative[selector] && (selector += parts.shift());
                    set = posProcess(selector, set);
                }
            } else {
                if (!seed && parts.length > 1 && 9 === context.nodeType && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                }
                if (context) {
                    ret = seed ? {
                        expr: parts.pop(),
                        set: makeArray(seed)
                    } : Sizzle.find(parts.pop(), 1 !== parts.length || "~" !== parts[0] && "+" !== parts[0] || !context.parentNode ? context : context.parentNode, contextXML);
                    set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                    parts.length > 0 ? checkSet = makeArray(set) : prune = false;
                    while (parts.length) {
                        cur = parts.pop();
                        pop = cur;
                        Expr.relative[cur] ? pop = parts.pop() : cur = "";
                        null == pop && (pop = context);
                        Expr.relative[cur](checkSet, pop, contextXML);
                    }
                } else checkSet = parts = [];
            }
            checkSet || (checkSet = set);
            checkSet || Sizzle.error(cur || selector);
            if ("[object Array]" === toString.call(checkSet)) if (prune) if (context && 1 === context.nodeType) for (i = 0; null != checkSet[i]; i++) checkSet[i] && (true === checkSet[i] || 1 === checkSet[i].nodeType && Sizzle.contains(context, checkSet[i])) && results.push(set[i]); else for (i = 0; null != checkSet[i]; i++) checkSet[i] && 1 === checkSet[i].nodeType && results.push(set[i]); else results.push.apply(results, checkSet); else makeArray(checkSet, results);
            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }
            return results;
        };
        Sizzle.uniqueSort = function(results) {
            if (sortOrder) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);
                if (hasDuplicate) for (var i = 1; results.length > i; i++) results[i] === results[i - 1] && results.splice(i--, 1);
            }
            return results;
        };
        Sizzle.matches = function(expr, set) {
            return Sizzle(expr, null, null, set);
        };
        Sizzle.matchesSelector = function(node, expr) {
            return Sizzle(expr, null, null, [ node ]).length > 0;
        };
        Sizzle.find = function(expr, context, isXML) {
            var set;
            if (!expr) return [];
            for (var i = 0, l = Expr.order.length; l > i; i++) {
                var match, type = Expr.order[i];
                if (match = Expr.leftMatch[type].exec(expr)) {
                    var left = match[1];
                    match.splice(1, 1);
                    if ("\\" !== left.substr(left.length - 1)) {
                        match[1] = (match[1] || "").replace(rBackslash, "");
                        set = Expr.find[type](match, context, isXML);
                        if (null != set) {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }
            set || (set = "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName("*") : []);
            return {
                set: set,
                expr: expr
            };
        };
        Sizzle.filter = function(expr, set, inplace, not) {
            var match, anyFound, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
            while (expr && set.length) {
                for (var type in Expr.filter) if (null != (match = Expr.leftMatch[type].exec(expr)) && match[2]) {
                    var found, item, filter = Expr.filter[type], left = match[1];
                    anyFound = false;
                    match.splice(1, 1);
                    if ("\\" === left.substr(left.length - 1)) continue;
                    curLoop === result && (result = []);
                    if (Expr.preFilter[type]) {
                        match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                        if (match) {
                            if (true === match) continue;
                        } else anyFound = found = true;
                    }
                    if (match) for (var i = 0; null != (item = curLoop[i]); i++) if (item) {
                        found = filter(item, match, i, curLoop);
                        var pass = not ^ !!found;
                        if (inplace && null != found) pass ? anyFound = true : curLoop[i] = false; else if (pass) {
                            result.push(item);
                            anyFound = true;
                        }
                    }
                    if (found !== undefined) {
                        inplace || (curLoop = result);
                        expr = expr.replace(Expr.match[type], "");
                        if (!anyFound) return [];
                        break;
                    }
                }
                if (expr === old) {
                    if (null != anyFound) break;
                    Sizzle.error(expr);
                }
                old = expr;
            }
            return curLoop;
        };
        Sizzle.error = function(msg) {
            throw "Syntax error, unrecognized expression: " + msg;
        };
        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(elem) {
                    return elem.getAttribute("href");
                },
                type: function(elem) {
                    return elem.getAttribute("type");
                }
            },
            relative: {
                "+": function(checkSet, part) {
                    var isPartStr = "string" == typeof part, isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;
                    isTag && (part = part.toLowerCase());
                    for (var elem, i = 0, l = checkSet.length; l > i; i++) if (elem = checkSet[i]) {
                        while ((elem = elem.previousSibling) && 1 !== elem.nodeType) ;
                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                    }
                    isPartStrNotTag && Sizzle.filter(part, checkSet, true);
                },
                ">": function(checkSet, part) {
                    var elem, isPartStr = "string" == typeof part, i = 0, l = checkSet.length;
                    if (isPartStr && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        for (;l > i; i++) {
                            elem = checkSet[i];
                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }
                    } else {
                        for (;l > i; i++) {
                            elem = checkSet[i];
                            elem && (checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part);
                        }
                        isPartStr && Sizzle.filter(part, checkSet, true);
                    }
                },
                "": function(checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;
                    if ("string" == typeof part && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }
                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },
                "~": function(checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;
                    if ("string" == typeof part && !rNonWord.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }
                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },
            find: {
                ID: function(match, context, isXML) {
                    if ("undefined" != typeof context.getElementById && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m && m.parentNode ? [ m ] : [];
                    }
                },
                NAME: function(match, context) {
                    if ("undefined" != typeof context.getElementsByName) {
                        var ret = [], results = context.getElementsByName(match[1]);
                        for (var i = 0, l = results.length; l > i; i++) results[i].getAttribute("name") === match[1] && ret.push(results[i]);
                        return 0 === ret.length ? null : ret;
                    }
                },
                TAG: function(match, context) {
                    if ("undefined" != typeof context.getElementsByTagName) return context.getElementsByTagName(match[1]);
                }
            },
            preFilter: {
                CLASS: function(match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(rBackslash, "") + " ";
                    if (isXML) return match;
                    for (var elem, i = 0; null != (elem = curLoop[i]); i++) elem && (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ? inplace || result.push(elem) : inplace && (curLoop[i] = false));
                    return false;
                },
                ID: function(match) {
                    return match[1].replace(rBackslash, "");
                },
                TAG: function(match) {
                    return match[1].replace(rBackslash, "").toLowerCase();
                },
                CHILD: function(match) {
                    if ("nth" === match[1]) {
                        match[2] || Sizzle.error(match[0]);
                        match[2] = match[2].replace(/^\+|\s*/g, "");
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even" === match[2] && "2n" || "odd" === match[2] && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                        match[2] = test[1] + (test[2] || 1) - 0;
                        match[3] = test[3] - 0;
                    } else match[2] && Sizzle.error(match[0]);
                    match[0] = done++;
                    return match;
                },
                ATTR: function(match, curLoop, inplace, result, not, isXML) {
                    var name = match[1] = match[1].replace(rBackslash, "");
                    !isXML && Expr.attrMap[name] && (match[1] = Expr.attrMap[name]);
                    match[4] = (match[4] || match[5] || "").replace(rBackslash, "");
                    "~=" === match[2] && (match[4] = " " + match[4] + " ");
                    return match;
                },
                PSEUDO: function(match, curLoop, inplace, result, not) {
                    if ("not" === match[1]) {
                        if (!((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3]))) {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                            inplace || result.push.apply(result, ret);
                            return false;
                        }
                        match[3] = Sizzle(match[3], null, null, curLoop);
                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) return true;
                    return match;
                },
                POS: function(match) {
                    match.unshift(true);
                    return match;
                }
            },
            filters: {
                enabled: function(elem) {
                    return false === elem.disabled && "hidden" !== elem.type;
                },
                disabled: function(elem) {
                    return true === elem.disabled;
                },
                checked: function(elem) {
                    return true === elem.checked;
                },
                selected: function(elem) {
                    elem.parentNode && elem.parentNode.selectedIndex;
                    return true === elem.selected;
                },
                parent: function(elem) {
                    return !!elem.firstChild;
                },
                empty: function(elem) {
                    return !elem.firstChild;
                },
                has: function(elem, i, match) {
                    return !!Sizzle(match[3], elem).length;
                },
                header: function(elem) {
                    return /h\d/i.test(elem.nodeName);
                },
                text: function(elem) {
                    var attr = elem.getAttribute("type"), type = elem.type;
                    return "input" === elem.nodeName.toLowerCase() && "text" === type && (attr === type || null === attr);
                },
                radio: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "radio" === elem.type;
                },
                checkbox: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "checkbox" === elem.type;
                },
                file: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "file" === elem.type;
                },
                password: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "password" === elem.type;
                },
                submit: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return ("input" === name || "button" === name) && "submit" === elem.type;
                },
                image: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "image" === elem.type;
                },
                reset: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return ("input" === name || "button" === name) && "reset" === elem.type;
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name;
                },
                input: function(elem) {
                    return /input|select|textarea|button/i.test(elem.nodeName);
                },
                focus: function(elem) {
                    return elem === elem.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function(elem, i) {
                    return 0 === i;
                },
                last: function(elem, i, match, array) {
                    return i === array.length - 1;
                },
                even: function(elem, i) {
                    return 0 === i % 2;
                },
                odd: function(elem, i) {
                    return 1 === i % 2;
                },
                lt: function(elem, i, match) {
                    return match[3] - 0 > i;
                },
                gt: function(elem, i, match) {
                    return i > match[3] - 0;
                },
                nth: function(elem, i, match) {
                    return match[3] - 0 === i;
                },
                eq: function(elem, i, match) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function(elem, match, i, array) {
                    var name = match[1], filter = Expr.filters[name];
                    if (filter) return filter(elem, i, match, array);
                    if ("contains" === name) return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;
                    if ("not" === name) {
                        var not = match[3];
                        for (var j = 0, l = not.length; l > j; j++) if (not[j] === elem) return false;
                        return true;
                    }
                    Sizzle.error(name);
                },
                CHILD: function(elem, match) {
                    var type = match[1], node = elem;
                    switch (type) {
                      case "only":
                      case "first":
                        while (node = node.previousSibling) if (1 === node.nodeType) return false;
                        if ("first" === type) return true;
                        node = elem;

                      case "last":
                        while (node = node.nextSibling) if (1 === node.nodeType) return false;
                        return true;

                      case "nth":
                        var first = match[2], last = match[3];
                        if (1 === first && 0 === last) return true;
                        var doneName = match[0], parent = elem.parentNode;
                        if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                            var count = 0;
                            for (node = parent.firstChild; node; node = node.nextSibling) 1 === node.nodeType && (node.nodeIndex = ++count);
                            parent.sizcache = doneName;
                        }
                        var diff = elem.nodeIndex - last;
                        return 0 === first ? 0 === diff : 0 === diff % first && diff / first >= 0;
                    }
                },
                ID: function(elem, match) {
                    return 1 === elem.nodeType && elem.getAttribute("id") === match;
                },
                TAG: function(elem, match) {
                    return "*" === match && 1 === elem.nodeType || elem.nodeName.toLowerCase() === match;
                },
                CLASS: function(elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
                },
                ATTR: function(elem, match) {
                    var name = match[1], result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : null != elem[name] ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];
                    return null == result ? "!=" === type : "=" === type ? value === check : "*=" === type ? value.indexOf(check) >= 0 : "~=" === type ? (" " + value + " ").indexOf(check) >= 0 : check ? "!=" === type ? value !== check : "^=" === type ? 0 === value.indexOf(check) : "$=" === type ? value.substr(value.length - check.length) === check : "|=" === type ? value === check || value.substr(0, check.length + 1) === check + "-" : false : value && false !== result;
                },
                POS: function(elem, match, i, array) {
                    var name = match[2], filter = Expr.setFilters[name];
                    if (filter) return filter(elem, i, match, array);
                }
            }
        };
        var origPOS = Expr.match.POS, fescape = function(all, num) {
            return "\\" + (num - 0 + 1);
        };
        for (var type in Expr.match) {
            Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        }
        var makeArray = function(array, results) {
            array = Array.prototype.slice.call(array, 0);
            if (results) {
                results.push.apply(results, array);
                return results;
            }
            return array;
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
        } catch (e) {
            makeArray = function(array, results) {
                var i = 0, ret = results || [];
                if ("[object Array]" === toString.call(array)) Array.prototype.push.apply(ret, array); else if ("number" == typeof array.length) for (var l = array.length; l > i; i++) ret.push(array[i]); else for (;array[i]; i++) ret.push(array[i]);
                return ret;
            };
        }
        var sortOrder, siblingCheck;
        if (document.documentElement.compareDocumentPosition) sortOrder = function(a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            }
            if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
            return 4 & a.compareDocumentPosition(b) ? -1 : 1;
        }; else {
            sortOrder = function(a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;
                if (aup === bup) return siblingCheck(a, b);
                if (!aup) return -1;
                if (!bup) return 1;
                while (cur) {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }
                cur = bup;
                while (cur) {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }
                al = ap.length;
                bl = bp.length;
                for (var i = 0; al > i && bl > i; i++) if (ap[i] !== bp[i]) return siblingCheck(ap[i], bp[i]);
                return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
            };
            siblingCheck = function(a, b, ret) {
                if (a === b) return ret;
                var cur = a.nextSibling;
                while (cur) {
                    if (cur === b) return -1;
                    cur = cur.nextSibling;
                }
                return 1;
            };
        }
        Sizzle.getText = function(elems) {
            var elem, ret = "";
            for (var i = 0; elems[i]; i++) {
                elem = elems[i];
                3 === elem.nodeType || 4 === elem.nodeType ? ret += elem.nodeValue : 8 !== elem.nodeType && (ret += Sizzle.getText(elem.childNodes));
            }
            return ret;
        };
        (function() {
            var form = document.createElement("div"), id = "script" + new Date().getTime(), root = document.documentElement;
            form.innerHTML = "<a name='" + id + "'/>";
            root.insertBefore(form, root.firstChild);
            if (document.getElementById(id)) {
                Expr.find.ID = function(match, context, isXML) {
                    if ("undefined" != typeof context.getElementById && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? m.id === match[1] || "undefined" != typeof m.getAttributeNode && m.getAttributeNode("id").nodeValue === match[1] ? [ m ] : undefined : [];
                    }
                };
                Expr.filter.ID = function(elem, match) {
                    var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
                    return 1 === elem.nodeType && node && node.nodeValue === match;
                };
            }
            root.removeChild(form);
            root = form = null;
        })();
        (function() {
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));
            div.getElementsByTagName("*").length > 0 && (Expr.find.TAG = function(match, context) {
                var results = context.getElementsByTagName(match[1]);
                if ("*" === match[1]) {
                    var tmp = [];
                    for (var i = 0; results[i]; i++) 1 === results[i].nodeType && tmp.push(results[i]);
                    results = tmp;
                }
                return results;
            });
            div.innerHTML = "<a href='#'></a>";
            div.firstChild && "undefined" != typeof div.firstChild.getAttribute && "#" !== div.firstChild.getAttribute("href") && (Expr.attrHandle.href = function(elem) {
                return elem.getAttribute("href", 2);
            });
            div = null;
        })();
        document.querySelectorAll && function() {
            var oldSizzle = Sizzle, div = document.createElement("div"), id = "__sizzle__";
            div.innerHTML = "<p class='TEST'></p>";
            if (div.querySelectorAll && 0 === div.querySelectorAll(".TEST").length) return;
            Sizzle = function(query, context, extra, seed) {
                context = context || document;
                if (!seed && !Sizzle.isXML(context)) {
                    var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
                    if (match && (1 === context.nodeType || 9 === context.nodeType)) {
                        if (match[1]) return makeArray(context.getElementsByTagName(query), extra);
                        if (match[2] && Expr.find.CLASS && context.getElementsByClassName) return makeArray(context.getElementsByClassName(match[2]), extra);
                    }
                    if (9 === context.nodeType) {
                        if ("body" === query && context.body) return makeArray([ context.body ], extra);
                        if (match && match[3]) {
                            var elem = context.getElementById(match[3]);
                            if (!elem || !elem.parentNode) return makeArray([], extra);
                            if (elem.id === match[3]) return makeArray([ elem ], extra);
                        }
                        try {
                            return makeArray(context.querySelectorAll(query), extra);
                        } catch (qsaError) {}
                    } else if (1 === context.nodeType && "object" !== context.nodeName.toLowerCase()) {
                        var oldContext = context, old = context.getAttribute("id"), nid = old || id, hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(query);
                        old ? nid = nid.replace(/'/g, "\\$&") : context.setAttribute("id", nid);
                        relativeHierarchySelector && hasParent && (context = context.parentNode);
                        try {
                            if (!relativeHierarchySelector || hasParent) return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                        } catch (pseudoError) {} finally {
                            old || oldContext.removeAttribute("id");
                        }
                    }
                }
                return oldSizzle(query, context, extra, seed);
            };
            for (var prop in oldSizzle) Sizzle[prop] = oldSizzle[prop];
            div = null;
        }();
        (function() {
            var html = document.documentElement, matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
            if (matches) {
                var disconnectedMatch = !matches.call(document.createElement("div"), "div"), pseudoWorks = false;
                try {
                    matches.call(document.documentElement, "[test!='']:sizzle");
                } catch (pseudoError) {
                    pseudoWorks = true;
                }
                Sizzle.matchesSelector = function(node, expr) {
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                    if (!Sizzle.isXML(node)) try {
                        if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                            var ret = matches.call(node, expr);
                            if (ret || !disconnectedMatch || node.document && 11 !== node.document.nodeType) return ret;
                        }
                    } catch (e) {}
                    return Sizzle(expr, null, null, [ node ]).length > 0;
                };
            }
        })();
        (function() {
            var div = document.createElement("div");
            div.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!div.getElementsByClassName || 0 === div.getElementsByClassName("e").length) return;
            div.lastChild.className = "e";
            if (1 === div.getElementsByClassName("e").length) return;
            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function(match, context, isXML) {
                if ("undefined" != typeof context.getElementsByClassName && !isXML) return context.getElementsByClassName(match[1]);
            };
            div = null;
        })();
        Sizzle.contains = document.documentElement.contains ? function(a, b) {
            return a !== b && (a.contains ? a.contains(b) : true);
        } : document.documentElement.compareDocumentPosition ? function(a, b) {
            return !!(16 & a.compareDocumentPosition(b));
        } : function() {
            return false;
        };
        Sizzle.isXML = function(elem) {
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
            return documentElement ? "HTML" !== documentElement.nodeName : false;
        };
        var posProcess = function(selector, context) {
            var match, tmpSet = [], later = "", root = context.nodeType ? [ context ] : context;
            while (match = Expr.match.PSEUDO.exec(selector)) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }
            selector = Expr.relative[selector] ? selector + "*" : selector;
            for (var i = 0, l = root.length; l > i; i++) Sizzle(selector, root[i], tmpSet);
            return Sizzle.filter(later, tmpSet);
        };
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;
    })();
    var runtil = /Until$/, rparentsprev = /^(?:parents|prevUntil|prevAll)/, rmultiselector = /,/, isSimple = /^.[^:#\[\.,]*$/, slice = Array.prototype.slice, POS = jQuery.expr.match.POS, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };
    jQuery.fn.extend({
        find: function(selector) {
            var i, l, self = this;
            if ("string" != typeof selector) return jQuery(selector).filter(function() {
                for (i = 0, l = self.length; l > i; i++) if (jQuery.contains(self[i], this)) return true;
            });
            var length, n, r, ret = this.pushStack("", "find", selector);
            for (i = 0, l = this.length; l > i; i++) {
                length = ret.length;
                jQuery.find(selector, this[i], ret);
                if (i > 0) for (n = length; ret.length > n; n++) for (r = 0; length > r; r++) if (ret[r] === ret[n]) {
                    ret.splice(n--, 1);
                    break;
                }
            }
            return ret;
        },
        has: function(target) {
            var targets = jQuery(target);
            return this.filter(function() {
                for (var i = 0, l = targets.length; l > i; i++) if (jQuery.contains(this, targets[i])) return true;
            });
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },
        is: function(selector) {
            return !!selector && ("string" == typeof selector ? jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
        },
        closest: function(selectors, context) {
            var i, l, ret = [], cur = this[0];
            if (jQuery.isArray(selectors)) {
                var match, selector, matches = {}, level = 1;
                if (cur && selectors.length) {
                    for (i = 0, l = selectors.length; l > i; i++) {
                        selector = selectors[i];
                        matches[selector] || (matches[selector] = POS.test(selector) ? jQuery(selector, context || this.context) : selector);
                    }
                    while (cur && cur.ownerDocument && cur !== context) {
                        for (selector in matches) {
                            match = matches[selector];
                            (match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match)) && ret.push({
                                selector: selector,
                                elem: cur,
                                level: level
                            });
                        }
                        cur = cur.parentNode;
                        level++;
                    }
                }
                return ret;
            }
            var pos = POS.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
            for (i = 0, l = this.length; l > i; i++) {
                cur = this[i];
                while (cur) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;
                    }
                    cur = cur.parentNode;
                    if (!cur || !cur.ownerDocument || cur === context || 11 === cur.nodeType) break;
                }
            }
            ret = ret.length > 1 ? jQuery.unique(ret) : ret;
            return this.pushStack(ret, "closest", selectors);
        },
        index: function(elem) {
            if (!elem) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if ("string" == typeof elem) return jQuery.inArray(this[0], jQuery(elem));
            return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
        },
        add: function(selector, context) {
            var set = "string" == typeof selector ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [ selector ] : selector), all = jQuery.merge(this.get(), set);
            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
        },
        andSelf: function() {
            return this.add(this.prevObject);
        }
    });
    jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return jQuery.nth(elem, 2, "nextSibling");
        },
        prev: function(elem) {
            return jQuery.nth(elem, 2, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var ret = jQuery.map(this, fn, until), args = slice.call(arguments);
            runtil.test(name) || (selector = until);
            selector && "string" == typeof selector && (ret = jQuery.filter(selector, ret));
            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
            (this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name) && (ret = ret.reverse());
            return this.pushStack(ret, name, args.join(","));
        };
    });
    jQuery.extend({
        filter: function(expr, elems, not) {
            not && (expr = ":not(" + expr + ")");
            return 1 === elems.length ? jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] : jQuery.find.matches(expr, elems);
        },
        dir: function(elem, dir, until) {
            var matched = [], cur = elem[dir];
            while (cur && 9 !== cur.nodeType && (until === undefined || 1 !== cur.nodeType || !jQuery(cur).is(until))) {
                1 === cur.nodeType && matched.push(cur);
                cur = cur[dir];
            }
            return matched;
        },
        nth: function(cur, result, dir) {
            result = result || 1;
            var num = 0;
            for (;cur; cur = cur[dir]) if (1 === cur.nodeType && ++num === result) break;
            return cur;
        },
        sibling: function(n, elem) {
            var r = [];
            for (;n; n = n.nextSibling) 1 === n.nodeType && n !== elem && r.push(n);
            return r;
        }
    });
    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnocache = /<(?:script|object|embed|option|style)/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/, wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    jQuery.support.htmlSerialize || (wrapMap._default = [ 1, "div<div>", "</div>" ]);
    jQuery.fn.extend({
        text: function(text) {
            if (jQuery.isFunction(text)) return this.each(function(i) {
                var self = jQuery(this);
                self.text(text.call(this, i, self.text()));
            });
            if ("object" != typeof text && text !== undefined) return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            return jQuery.text(this);
        },
        wrapAll: function(html) {
            if (jQuery.isFunction(html)) return this.each(function(i) {
                jQuery(this).wrapAll(html.call(this, i));
            });
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                this[0].parentNode && wrap.insertBefore(this[0]);
                wrap.map(function() {
                    var elem = this;
                    while (elem.firstChild && 1 === elem.firstChild.nodeType) elem = elem.firstChild;
                    return elem;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(html) {
            if (jQuery.isFunction(html)) return this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
            });
            return this.each(function() {
                var self = jQuery(this), contents = self.contents();
                contents.length ? contents.wrapAll(html) : self.append(html);
            });
        },
        wrap: function(html) {
            return this.each(function() {
                jQuery(this).wrapAll(html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
            }).end();
        },
        append: function() {
            return this.domManip(arguments, true, function(elem) {
                1 === this.nodeType && this.appendChild(elem);
            });
        },
        prepend: function() {
            return this.domManip(arguments, true, function(elem) {
                1 === this.nodeType && this.insertBefore(elem, this.firstChild);
            });
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, false, function(elem) {
                this.parentNode.insertBefore(elem, this);
            });
            if (arguments.length) {
                var set = jQuery(arguments[0]);
                set.push.apply(set, this.toArray());
                return this.pushStack(set, "before", arguments);
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, false, function(elem) {
                this.parentNode.insertBefore(elem, this.nextSibling);
            });
            if (arguments.length) {
                var set = this.pushStack(this, "after", arguments);
                set.push.apply(set, jQuery(arguments[0]).toArray());
                return set;
            }
        },
        remove: function(selector, keepData) {
            for (var elem, i = 0; null != (elem = this[i]); i++) if (!selector || jQuery.filter(selector, [ elem ]).length) {
                if (!keepData && 1 === elem.nodeType) {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                    jQuery.cleanData([ elem ]);
                }
                elem.parentNode && elem.parentNode.removeChild(elem);
            }
            return this;
        },
        empty: function() {
            for (var elem, i = 0; null != (elem = this[i]); i++) {
                1 === elem.nodeType && jQuery.cleanData(elem.getElementsByTagName("*"));
                while (elem.firstChild) elem.removeChild(elem.firstChild);
            }
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = null == dataAndEvents ? false : dataAndEvents;
            deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            if (value === undefined) return this[0] && 1 === this[0].nodeType ? this[0].innerHTML.replace(rinlinejQuery, "") : null;
            if ("string" != typeof value || rnocache.test(value) || !jQuery.support.leadingWhitespace && rleadingWhitespace.test(value) || wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) jQuery.isFunction(value) ? this.each(function(i) {
                var self = jQuery(this);
                self.html(value.call(this, i, self.html()));
            }) : this.empty().append(value); else {
                value = value.replace(rxhtmlTag, "<$1></$2>");
                try {
                    for (var i = 0, l = this.length; l > i; i++) if (1 === this[i].nodeType) {
                        jQuery.cleanData(this[i].getElementsByTagName("*"));
                        this[i].innerHTML = value;
                    }
                } catch (e) {
                    this.empty().append(value);
                }
            }
            return this;
        },
        replaceWith: function(value) {
            if (this[0] && this[0].parentNode) {
                if (jQuery.isFunction(value)) return this.each(function(i) {
                    var self = jQuery(this), old = self.html();
                    self.replaceWith(value.call(this, i, old));
                });
                "string" != typeof value && (value = jQuery(value).detach());
                return this.each(function() {
                    var next = this.nextSibling, parent = this.parentNode;
                    jQuery(this).remove();
                    next ? jQuery(next).before(value) : jQuery(parent).append(value);
                });
            }
            return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
        },
        detach: function(selector) {
            return this.remove(selector, true);
        },
        domManip: function(args, table, callback) {
            var results, first, fragment, parent, value = args[0], scripts = [];
            if (!jQuery.support.checkClone && 3 === arguments.length && "string" == typeof value && rchecked.test(value)) return this.each(function() {
                jQuery(this).domManip(args, table, callback, true);
            });
            if (jQuery.isFunction(value)) return this.each(function(i) {
                var self = jQuery(this);
                args[0] = value.call(this, i, table ? self.html() : undefined);
                self.domManip(args, table, callback);
            });
            if (this[0]) {
                parent = value && value.parentNode;
                results = jQuery.support.parentNode && parent && 11 === parent.nodeType && parent.childNodes.length === this.length ? {
                    fragment: parent
                } : jQuery.buildFragment(args, this, scripts);
                fragment = results.fragment;
                first = 1 === fragment.childNodes.length ? fragment = fragment.firstChild : fragment.firstChild;
                if (first) {
                    table = table && jQuery.nodeName(first, "tr");
                    for (var i = 0, l = this.length, lastIndex = l - 1; l > i; i++) callback.call(table ? root(this[i], first) : this[i], results.cacheable || l > 1 && lastIndex > i ? jQuery.clone(fragment, true, true) : fragment);
                }
                scripts.length && jQuery.each(scripts, evalScript);
            }
            return this;
        }
    });
    jQuery.buildFragment = function(args, nodes, scripts) {
        var fragment, cacheable, cacheresults, doc;
        nodes && nodes[0] && (doc = nodes[0].ownerDocument || nodes[0]);
        doc.createDocumentFragment || (doc = document);
        if (1 === args.length && "string" == typeof args[0] && 512 > args[0].length && doc === document && "<" === args[0].charAt(0) && !rnocache.test(args[0]) && (jQuery.support.checkClone || !rchecked.test(args[0]))) {
            cacheable = true;
            cacheresults = jQuery.fragments[args[0]];
            cacheresults && 1 !== cacheresults && (fragment = cacheresults);
        }
        if (!fragment) {
            fragment = doc.createDocumentFragment();
            jQuery.clean(args, doc, fragment, scripts);
        }
        cacheable && (jQuery.fragments[args[0]] = cacheresults ? fragment : 1);
        return {
            fragment: fragment,
            cacheable: cacheable
        };
    };
    jQuery.fragments = {};
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            var ret = [], insert = jQuery(selector), parent = 1 === this.length && this[0].parentNode;
            if (parent && 11 === parent.nodeType && 1 === parent.childNodes.length && 1 === insert.length) {
                insert[original](this[0]);
                return this;
            }
            for (var i = 0, l = insert.length; l > i; i++) {
                var elems = (i > 0 ? this.clone(true) : this).get();
                jQuery(insert[i])[original](elems);
                ret = ret.concat(elems);
            }
            return this.pushStack(ret, name, insert.selector);
        };
    });
    jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var srcElements, destElements, i, clone = elem.cloneNode(true);
            if (!(jQuery.support.noCloneEvent && jQuery.support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem))) {
                cloneFixAttributes(elem, clone);
                srcElements = getAll(elem);
                destElements = getAll(clone);
                for (i = 0; srcElements[i]; ++i) destElements[i] && cloneFixAttributes(srcElements[i], destElements[i]);
            }
            if (dataAndEvents) {
                cloneCopyEvent(elem, clone);
                if (deepDataAndEvents) {
                    srcElements = getAll(elem);
                    destElements = getAll(clone);
                    for (i = 0; srcElements[i]; ++i) cloneCopyEvent(srcElements[i], destElements[i]);
                }
            }
            srcElements = destElements = null;
            return clone;
        },
        clean: function(elems, context, fragment, scripts) {
            var checkScriptType;
            context = context || document;
            "undefined" == typeof context.createElement && (context = context.ownerDocument || context[0] && context[0].ownerDocument || document);
            var j, ret = [];
            for (var elem, i = 0; null != (elem = elems[i]); i++) {
                "number" == typeof elem && (elem += "");
                if (!elem) continue;
                if ("string" == typeof elem) if (rhtml.test(elem)) {
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");
                    var tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, depth = wrap[0], div = context.createElement("div");
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    while (depth--) div = div.lastChild;
                    if (!jQuery.support.tbody) {
                        var hasBody = rtbody.test(elem), tbody = "table" !== tag || hasBody ? "<table>" !== wrap[1] || hasBody ? [] : div.childNodes : div.firstChild && div.firstChild.childNodes;
                        for (j = tbody.length - 1; j >= 0; --j) jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length && tbody[j].parentNode.removeChild(tbody[j]);
                    }
                    !jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                    elem = div.childNodes;
                } else elem = context.createTextNode(elem);
                var len;
                if (!jQuery.support.appendChecked) if (elem[0] && "number" == typeof (len = elem.length)) for (j = 0; len > j; j++) findInputs(elem[j]); else findInputs(elem);
                elem.nodeType ? ret.push(elem) : ret = jQuery.merge(ret, elem);
            }
            if (fragment) {
                checkScriptType = function(elem) {
                    return !elem.type || rscriptType.test(elem.type);
                };
                for (i = 0; ret[i]; i++) if (!scripts || !jQuery.nodeName(ret[i], "script") || ret[i].type && "text/javascript" !== ret[i].type.toLowerCase()) {
                    if (1 === ret[i].nodeType) {
                        var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);
                        ret.splice.apply(ret, [ i + 1, 0 ].concat(jsTags));
                    }
                    fragment.appendChild(ret[i]);
                } else scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
            }
            return ret;
        },
        cleanData: function(elems) {
            var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special, deleteExpando = jQuery.support.deleteExpando;
            for (var elem, i = 0; null != (elem = elems[i]); i++) {
                if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) continue;
                id = elem[jQuery.expando];
                if (id) {
                    data = cache[id] && cache[id][internalKey];
                    if (data && data.events) {
                        for (var type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                        data.handle && (data.handle.elem = null);
                    }
                    deleteExpando ? delete elem[jQuery.expando] : elem.removeAttribute && elem.removeAttribute(jQuery.expando);
                    delete cache[id];
                }
            }
        }
    });
    var curCSS, getComputedStyle, currentStyle, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rupper = /([A-Z]|^ms)/g, rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/, rrelNum = /^([\-+])=([\-+.\de]+)/, cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssWidth = [ "Left", "Right" ], cssHeight = [ "Top", "Bottom" ];
    jQuery.fn.css = function(name, value) {
        if (2 === arguments.length && value === undefined) return this;
        return jQuery.access(this, name, value, true, function(elem, name, value) {
            return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
        });
    };
    jQuery.extend({
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity", "opacity");
                        return "" === ret ? "1" : ret;
                    }
                    return elem.style.opacity;
                }
            }
        },
        cssNumber: {
            fillOpacity: true,
            fontWeight: true,
            lineHeight: true,
            opacity: true,
            orphans: true,
            widows: true,
            zIndex: true,
            zoom: true
        },
        cssProps: {
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(elem, name, value, extra) {
            if (!elem || 3 === elem.nodeType || 8 === elem.nodeType || !elem.style) return;
            var ret, type, origName = jQuery.camelCase(name), style = elem.style, hooks = jQuery.cssHooks[origName];
            name = jQuery.cssProps[origName] || origName;
            if (value === undefined) {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) return ret;
                return style[name];
            }
            type = typeof value;
            if ("string" === type && (ret = rrelNum.exec(value))) {
                value = +(ret[1] + 1) * +ret[2] + parseFloat(jQuery.css(elem, name));
                type = "number";
            }
            if (null == value || "number" === type && isNaN(value)) return;
            "number" !== type || jQuery.cssNumber[origName] || (value += "px");
            if (!(hooks && "set" in hooks && (value = hooks.set(elem, value)) === undefined)) try {
                style[name] = value;
            } catch (e) {}
        },
        css: function(elem, name, extra) {
            var ret, hooks;
            name = jQuery.camelCase(name);
            hooks = jQuery.cssHooks[name];
            name = jQuery.cssProps[name] || name;
            "cssFloat" === name && (name = "float");
            if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) return ret;
            if (curCSS) return curCSS(elem, name);
        },
        swap: function(elem, options, callback) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            callback.call(elem);
            for (name in options) elem.style[name] = old[name];
        }
    });
    jQuery.curCSS = jQuery.css;
    jQuery.each([ "height", "width" ], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                var val;
                if (computed) {
                    if (0 !== elem.offsetWidth) return getWH(elem, name, extra);
                    jQuery.swap(elem, cssShow, function() {
                        val = getWH(elem, name, extra);
                    });
                    return val;
                }
            },
            set: function(elem, value) {
                if (!rnumpx.test(value)) return value;
                value = parseFloat(value);
                if (value >= 0) return value + "px";
            }
        };
    });
    jQuery.support.opacity || (jQuery.cssHooks.opacity = {
        get: function(elem, computed) {
            return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : computed ? "1" : "";
        },
        set: function(elem, value) {
            var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNaN(value) ? "" : "alpha(opacity=" + 100 * value + ")", filter = currentStyle && currentStyle.filter || style.filter || "";
            style.zoom = 1;
            if (value >= 1 && "" === jQuery.trim(filter.replace(ralpha, ""))) {
                style.removeAttribute("filter");
                if (currentStyle && !currentStyle.filter) return;
            }
            style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
        }
    });
    jQuery(function() {
        jQuery.support.reliableMarginRight || (jQuery.cssHooks.marginRight = {
            get: function(elem, computed) {
                var ret;
                jQuery.swap(elem, {
                    display: "inline-block"
                }, function() {
                    ret = computed ? curCSS(elem, "margin-right", "marginRight") : elem.style.marginRight;
                });
                return ret;
            }
        });
    });
    document.defaultView && document.defaultView.getComputedStyle && (getComputedStyle = function(elem, name) {
        var ret, defaultView, computedStyle;
        name = name.replace(rupper, "-$1").toLowerCase();
        if (!(defaultView = elem.ownerDocument.defaultView)) return undefined;
        if (computedStyle = defaultView.getComputedStyle(elem, null)) {
            ret = computedStyle.getPropertyValue(name);
            "" !== ret || jQuery.contains(elem.ownerDocument.documentElement, elem) || (ret = jQuery.style(elem, name));
        }
        return ret;
    });
    document.documentElement.currentStyle && (currentStyle = function(elem, name) {
        var left, ret = elem.currentStyle && elem.currentStyle[name], rsLeft = elem.runtimeStyle && elem.runtimeStyle[name], style = elem.style;
        if (!rnumpx.test(ret) && rnum.test(ret)) {
            left = style.left;
            rsLeft && (elem.runtimeStyle.left = elem.currentStyle.left);
            style.left = "fontSize" === name ? "1em" : ret || 0;
            ret = style.pixelLeft + "px";
            style.left = left;
            rsLeft && (elem.runtimeStyle.left = rsLeft);
        }
        return "" === ret ? "auto" : ret;
    });
    curCSS = getComputedStyle || currentStyle;
    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function(elem) {
            var width = elem.offsetWidth, height = elem.offsetHeight;
            return 0 === width && 0 === height || !jQuery.support.reliableHiddenOffsets && "none" === (elem.style.display || jQuery.css(elem, "display"));
        };
        jQuery.expr.filters.visible = function(elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }
    var ajaxLocation, ajaxLocParts, r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rselectTextarea = /^(?:select|textarea)/i, rspacesAjax = /\s+/, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, _load = jQuery.fn.load, prefilters = {}, transports = {}, allTypes = [ "*/" ] + [ "*" ];
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
    jQuery.fn.extend({
        load: function(url, params, callback) {
            if ("string" != typeof url && _load) return _load.apply(this, arguments);
            if (!this.length) return this;
            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off);
            }
            var type = "GET";
            if (params) if (jQuery.isFunction(params)) {
                callback = params;
                params = undefined;
            } else if ("object" == typeof params) {
                params = jQuery.param(params, jQuery.ajaxSettings.traditional);
                type = "POST";
            }
            var self = this;
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                complete: function(jqXHR, status, responseText) {
                    responseText = jqXHR.responseText;
                    if (jqXHR.isResolved()) {
                        jqXHR.done(function(r) {
                            responseText = r;
                        });
                        self.html(selector ? jQuery("<div>").append(responseText.replace(rscript, "")).find(selector) : responseText);
                    }
                    callback && self.each(callback, [ responseText, status, jqXHR ]);
                }
            });
            return this;
        },
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    });
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
        jQuery.fn[o] = function(f) {
            return this.bind(o, f);
        };
    });
    jQuery.each([ "get", "post" ], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });
    jQuery.extend({
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        ajaxSetup: function(target, settings) {
            if (settings) ajaxExtend(target, jQuery.ajaxSettings); else {
                settings = target;
                target = jQuery.ajaxSettings;
            }
            ajaxExtend(target, settings);
            return target;
        },
        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": window.String,
                "text html": true,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {
                context: true,
                url: true
            }
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function(url, options) {
            function done(status, nativeStatusText, responses, headers) {
                if (2 === state) return;
                state = 2;
                timeoutTimer && clearTimeout(timeoutTimer);
                transport = undefined;
                responseHeadersString = headers || "";
                jqXHR.readyState = status > 0 ? 4 : 0;
                var isSuccess, success, error, lastModified, etag, statusText = nativeStatusText, response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined;
                if (status >= 200 && 300 > status || 304 === status) {
                    if (s.ifModified) {
                        (lastModified = jqXHR.getResponseHeader("Last-Modified")) && (jQuery.lastModified[ifModifiedKey] = lastModified);
                        (etag = jqXHR.getResponseHeader("Etag")) && (jQuery.etag[ifModifiedKey] = etag);
                    }
                    if (304 === status) {
                        statusText = "notmodified";
                        isSuccess = true;
                    } else try {
                        success = ajaxConvert(s, response);
                        statusText = "success";
                        isSuccess = true;
                    } catch (e) {
                        statusText = "parsererror";
                        error = e;
                    }
                } else {
                    error = statusText;
                    if (!statusText || status) {
                        statusText = "error";
                        0 > status && (status = 0);
                    }
                }
                jqXHR.status = status;
                jqXHR.statusText = "" + (nativeStatusText || statusText);
                isSuccess ? deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]) : deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]);
                jqXHR.statusCode(statusCode);
                statusCode = undefined;
                fireGlobals && globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [ jqXHR, s, isSuccess ? success : error ]);
                completeDeferred.resolveWith(callbackContext, [ jqXHR, statusText ]);
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]);
                    --jQuery.active || jQuery.event.trigger("ajaxStop");
                }
            }
            if ("object" == typeof url) {
                options = url;
                url = undefined;
            }
            options = options || {};
            var ifModifiedKey, responseHeadersString, responseHeaders, transport, timeoutTimer, parts, fireGlobals, i, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery._Deferred(), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, jqXHR = {
                readyState: 0,
                setRequestHeader: function(name, value) {
                    if (!state) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                        requestHeaders[name] = value;
                    }
                    return this;
                },
                getAllResponseHeaders: function() {
                    return 2 === state ? responseHeadersString : null;
                },
                getResponseHeader: function(key) {
                    var match;
                    if (2 === state) {
                        if (!responseHeaders) {
                            responseHeaders = {};
                            while (match = rheaders.exec(responseHeadersString)) responseHeaders[match[1].toLowerCase()] = match[2];
                        }
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return match === undefined ? null : match;
                },
                overrideMimeType: function(type) {
                    state || (s.mimeType = type);
                    return this;
                },
                abort: function(statusText) {
                    statusText = statusText || "abort";
                    transport && transport.abort(statusText);
                    done(0, statusText);
                    return this;
                }
            };
            deferred.promise(jqXHR);
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.done;
            jqXHR.statusCode = function(map) {
                if (map) {
                    var tmp;
                    if (2 > state) for (tmp in map) statusCode[tmp] = [ statusCode[tmp], map[tmp] ]; else {
                        tmp = map[jqXHR.status];
                        jqXHR.then(tmp, tmp);
                    }
                }
                return this;
            };
            s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);
            if (null == s.crossDomain) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts && (parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] || (parts[3] || ("http:" === parts[1] ? 80 : 443)) != (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? 80 : 443))));
            }
            s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional));
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (2 === state) return false;
            fireGlobals = s.global;
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            fireGlobals && 0 === jQuery.active++ && jQuery.event.trigger("ajaxStart");
            if (!s.hasContent) {
                if (s.data) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
                    delete s.data;
                }
                ifModifiedKey = s.url;
                if (false === s.cache) {
                    var ts = jQuery.now(), ret = s.url.replace(rts, "$1_=" + ts);
                    s.url = ret + (ret === s.url ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
                }
            }
            (s.data && s.hasContent && false !== s.contentType || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType);
            if (s.ifModified) {
                ifModifiedKey = ifModifiedKey || s.url;
                jQuery.lastModified[ifModifiedKey] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                jQuery.etag[ifModifiedKey] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
            if (s.beforeSend && (false === s.beforeSend.call(callbackContext, jqXHR, s) || 2 === state)) {
                jqXHR.abort();
                return false;
            }
            for (i in {
                success: 1,
                error: 1,
                complete: 1
            }) jqXHR[i](s[i]);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (transport) {
                jqXHR.readyState = 1;
                fireGlobals && globalEventContext.trigger("ajaxSend", [ jqXHR, s ]);
                s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
                    jqXHR.abort("timeout");
                }, s.timeout));
                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    2 > state ? done(-1, e) : jQuery.error(e);
                }
            } else done(-1, "No Transport");
            return jqXHR;
        },
        param: function(a, traditional) {
            var s = [], add = function(key, value) {
                value = jQuery.isFunction(value) ? value() : value;
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
            traditional === undefined && (traditional = jQuery.ajaxSettings.traditional);
            if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
                add(this.name, this.value);
            }); else for (var prefix in a) buildParams(prefix, a[prefix], traditional, add);
            return s.join("&").replace(r20, "+");
        }
    });
    jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var jsc = jQuery.now(), jsre = /(\=)\?(&|$)|\?\?/i;
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return jQuery.expando + "_" + jsc++;
        }
    });
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var inspectData = "application/x-www-form-urlencoded" === s.contentType && "string" == typeof s.data;
        if ("jsonp" === s.dataTypes[0] || false !== s.jsonp && (jsre.test(s.url) || inspectData && jsre.test(s.data))) {
            var responseContainer, jsonpCallback = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, previous = window[jsonpCallback], url = s.url, data = s.data, replace = "$1" + jsonpCallback + "$2";
            if (false !== s.jsonp) {
                url = url.replace(jsre, replace);
                if (s.url === url) {
                    inspectData && (data = data.replace(jsre, replace));
                    s.data === data && (url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback);
                }
            }
            s.url = url;
            s.data = data;
            window[jsonpCallback] = function(response) {
                responseContainer = [ response ];
            };
            jqXHR.always(function() {
                window[jsonpCallback] = previous;
                responseContainer && jQuery.isFunction(previous) && window[jsonpCallback](responseContainer[0]);
            });
            s.converters["script json"] = function() {
                responseContainer || jQuery.error(jsonpCallback + " was not called");
                return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            return "script";
        }
    });
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });
    jQuery.ajaxPrefilter("script", function(s) {
        s.cache === undefined && (s.cache = false);
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });
    jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            return {
                send: function(_, callback) {
                    script = document.createElement("script");
                    script.async = "async";
                    s.scriptCharset && (script.charset = s.scriptCharset);
                    script.src = s.url;
                    script.onload = script.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            script.onload = script.onreadystatechange = null;
                            head && script.parentNode && head.removeChild(script);
                            script = undefined;
                            isAbort || callback(200, "success");
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                },
                abort: function() {
                    script && script.onload(0, 1);
                }
            };
        }
    });
    var xhrCallbacks, xhrOnUnloadAbort = window.ActiveXObject ? function() {
        for (var key in xhrCallbacks) xhrCallbacks[key](0, 1);
    } : false, xhrId = 0;
    jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    (function(xhr) {
        jQuery.extend(jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && "withCredentials" in xhr
        });
    })(jQuery.ajaxSettings.xhr());
    jQuery.support.ajax && jQuery.ajaxTransport(function(s) {
        if (!s.crossDomain || jQuery.support.cors) {
            var callback;
            return {
                send: function(headers, complete) {
                    var handle, i, xhr = s.xhr();
                    s.username ? xhr.open(s.type, s.url, s.async, s.username, s.password) : xhr.open(s.type, s.url, s.async);
                    if (s.xhrFields) for (i in s.xhrFields) xhr[i] = s.xhrFields[i];
                    s.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(s.mimeType);
                    s.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (i in headers) xhr.setRequestHeader(i, headers[i]);
                    } catch (_) {}
                    xhr.send(s.hasContent && s.data || null);
                    callback = function(_, isAbort) {
                        var status, statusText, responseHeaders, responses, xml;
                        try {
                            if (callback && (isAbort || 4 === xhr.readyState)) {
                                callback = undefined;
                                if (handle) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    xhrOnUnloadAbort && delete xhrCallbacks[handle];
                                }
                                if (isAbort) 4 !== xhr.readyState && xhr.abort(); else {
                                    status = xhr.status;
                                    responseHeaders = xhr.getAllResponseHeaders();
                                    responses = {};
                                    xml = xhr.responseXML;
                                    xml && xml.documentElement && (responses.xml = xml);
                                    responses.text = xhr.responseText;
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        statusText = "";
                                    }
                                    status || !s.isLocal || s.crossDomain ? 1223 === status && (status = 204) : status = responses.text ? 200 : 404;
                                }
                            }
                        } catch (firefoxAccessException) {
                            isAbort || complete(-1, firefoxAccessException);
                        }
                        responses && complete(status, statusText, responses, responseHeaders);
                    };
                    if (s.async && 4 !== xhr.readyState) {
                        handle = ++xhrId;
                        if (xhrOnUnloadAbort) {
                            if (!xhrCallbacks) {
                                xhrCallbacks = {};
                                jQuery(window).unload(xhrOnUnloadAbort);
                            }
                            xhrCallbacks[handle] = callback;
                        }
                        xhr.onreadystatechange = callback;
                    } else callback();
                },
                abort: function() {
                    callback && callback(0, 1);
                }
            };
        }
    });
    var iframe, iframeDoc, timerId, fxNow, elemdisplay = {}, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, fxAttrs = [ [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ], [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ], [ "opacity" ] ];
    jQuery.fn.extend({
        show: function(speed, easing, callback) {
            var elem, display;
            if (speed || 0 === speed) return this.animate(genFx("show", 3), speed, easing, callback);
            for (var i = 0, j = this.length; j > i; i++) {
                elem = this[i];
                if (elem.style) {
                    display = elem.style.display;
                    jQuery._data(elem, "olddisplay") || "none" !== display || (display = elem.style.display = "");
                    "" === display && "none" === jQuery.css(elem, "display") && jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                }
            }
            for (i = 0; j > i; i++) {
                elem = this[i];
                if (elem.style) {
                    display = elem.style.display;
                    ("" === display || "none" === display) && (elem.style.display = jQuery._data(elem, "olddisplay") || "");
                }
            }
            return this;
        },
        hide: function(speed, easing, callback) {
            if (speed || 0 === speed) return this.animate(genFx("hide", 3), speed, easing, callback);
            for (var i = 0, j = this.length; j > i; i++) if (this[i].style) {
                var display = jQuery.css(this[i], "display");
                "none" === display || jQuery._data(this[i], "olddisplay") || jQuery._data(this[i], "olddisplay", display);
            }
            for (i = 0; j > i; i++) this[i].style && (this[i].style.display = "none");
            return this;
        },
        _toggle: jQuery.fn.toggle,
        toggle: function(fn, fn2, callback) {
            var bool = "boolean" == typeof fn;
            jQuery.isFunction(fn) && jQuery.isFunction(fn2) ? this._toggle.apply(this, arguments) : null == fn || bool ? this.each(function() {
                var state = bool ? fn : jQuery(this).is(":hidden");
                jQuery(this)[state ? "show" : "hide"]();
            }) : this.animate(genFx("toggle", 3), fn, fn2, callback);
            return this;
        },
        fadeTo: function(speed, to, easing, callback) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);
            if (jQuery.isEmptyObject(prop)) return this.each(optall.complete, [ false ]);
            prop = jQuery.extend({}, prop);
            return this[false === optall.queue ? "each" : "queue"](function() {
                false === optall.queue && jQuery._mark(this);
                var name, val, p, display, e, parts, start, end, unit, opt = jQuery.extend({}, optall), isElement = 1 === this.nodeType, hidden = isElement && jQuery(this).is(":hidden");
                opt.animatedProperties = {};
                for (p in prop) {
                    name = jQuery.camelCase(p);
                    if (p !== name) {
                        prop[name] = prop[p];
                        delete prop[p];
                    }
                    val = prop[name];
                    if (jQuery.isArray(val)) {
                        opt.animatedProperties[name] = val[1];
                        val = prop[name] = val[0];
                    } else opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || "swing";
                    if ("hide" === val && hidden || "show" === val && !hidden) return opt.complete.call(this);
                    if (isElement && ("height" === name || "width" === name)) {
                        opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];
                        if ("inline" === jQuery.css(this, "display") && "none" === jQuery.css(this, "float")) if (jQuery.support.inlineBlockNeedsLayout) {
                            display = defaultDisplay(this.nodeName);
                            if ("inline" === display) this.style.display = "inline-block"; else {
                                this.style.display = "inline";
                                this.style.zoom = 1;
                            }
                        } else this.style.display = "inline-block";
                    }
                }
                null != opt.overflow && (this.style.overflow = "hidden");
                for (p in prop) {
                    e = new jQuery.fx(this, opt, p);
                    val = prop[p];
                    if (rfxtypes.test(val)) e["toggle" === val ? hidden ? "show" : "hide" : val](); else {
                        parts = rfxnum.exec(val);
                        start = e.cur();
                        if (parts) {
                            end = parseFloat(parts[2]);
                            unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px");
                            if ("px" !== unit) {
                                jQuery.style(this, p, (end || 1) + unit);
                                start = (end || 1) / e.cur() * start;
                                jQuery.style(this, p, start + unit);
                            }
                            parts[1] && (end = ("-=" === parts[1] ? -1 : 1) * end + start);
                            e.custom(start, end, unit);
                        } else e.custom(start, val, "");
                    }
                }
                return true;
            });
        },
        stop: function(clearQueue, gotoEnd) {
            clearQueue && this.queue([]);
            this.each(function() {
                var timers = jQuery.timers, i = timers.length;
                gotoEnd || jQuery._unmark(true, this);
                while (i--) if (timers[i].elem === this) {
                    gotoEnd && timers[i](true);
                    timers.splice(i, 1);
                }
            });
            gotoEnd || this.dequeue();
            return this;
        }
    });
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });
    jQuery.extend({
        speed: function(speed, easing, fn) {
            var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };
            opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
            opt.old = opt.complete;
            opt.complete = function(noUnmark) {
                jQuery.isFunction(opt.old) && opt.old.call(this);
                false !== opt.queue ? jQuery.dequeue(this) : false !== noUnmark && jQuery._unmark(this);
            };
            return opt;
        },
        easing: {
            linear: function(p, n, firstNum, diff) {
                return firstNum + diff * p;
            },
            swing: function(p, n, firstNum, diff) {
                return (-Math.cos(p * Math.PI) / 2 + .5) * diff + firstNum;
            }
        },
        timers: [],
        fx: function(elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;
            options.orig = options.orig || {};
        }
    });
    jQuery.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this);
            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
        },
        cur: function() {
            if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop])) return this.elem[this.prop];
            var parsed, r = jQuery.css(this.elem, this.prop);
            return isNaN(parsed = parseFloat(r)) ? r && "auto" !== r ? r : 0 : parsed;
        },
        custom: function(from, to, unit) {
            function t(gotoEnd) {
                return self.step(gotoEnd);
            }
            var self = this, fx = jQuery.fx;
            this.startTime = fxNow || createFxNow();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px");
            this.now = this.start;
            this.pos = this.state = 0;
            t.elem = this.elem;
            t() && jQuery.timers.push(t) && !timerId && (timerId = setInterval(fx.tick, fx.interval));
        },
        show: function() {
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.show = true;
            this.custom("width" === this.prop || "height" === this.prop ? 1 : 0, this.cur());
            jQuery(this.elem).show();
        },
        hide: function() {
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0);
        },
        step: function(gotoEnd) {
            var i, n, t = fxNow || createFxNow(), done = true, elem = this.elem, options = this.options;
            if (gotoEnd || t >= options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                options.animatedProperties[this.prop] = true;
                for (i in options.animatedProperties) true !== options.animatedProperties[i] && (done = false);
                if (done) {
                    null == options.overflow || jQuery.support.shrinkWrapBlocks || jQuery.each([ "", "X", "Y" ], function(index, value) {
                        elem.style["overflow" + value] = options.overflow[index];
                    });
                    options.hide && jQuery(elem).hide();
                    if (options.hide || options.show) for (var p in options.animatedProperties) jQuery.style(elem, p, options.orig[p]);
                    options.complete.call(elem);
                }
                return false;
            }
            if (1/0 == options.duration) this.now = t; else {
                n = t - this.startTime;
                this.state = n / options.duration;
                this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration);
                this.now = this.start + (this.end - this.start) * this.pos;
            }
            this.update();
            return true;
        }
    };
    jQuery.extend(jQuery.fx, {
        tick: function() {
            for (var timers = jQuery.timers, i = 0; timers.length > i; ++i) timers[i]() || timers.splice(i--, 1);
            timers.length || jQuery.fx.stop();
        },
        interval: 13,
        stop: function() {
            clearInterval(timerId);
            timerId = null;
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(fx) {
                jQuery.style(fx.elem, "opacity", fx.now);
            },
            _default: function(fx) {
                fx.elem.style && null != fx.elem.style[fx.prop] ? fx.elem.style[fx.prop] = ("width" === fx.prop || "height" === fx.prop ? Math.max(0, fx.now) : fx.now) + fx.unit : fx.elem[fx.prop] = fx.now;
            }
        }
    });
    jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    });
    var rtable = /^t(?:able|d|h)$/i, rroot = /^(?:body|html)$/i;
    jQuery.fn.offset = "getBoundingClientRect" in document.documentElement ? function(options) {
        var box, elem = this[0];
        if (options) return this.each(function(i) {
            jQuery.offset.setOffset(this, options, i);
        });
        if (!elem || !elem.ownerDocument) return null;
        if (elem === elem.ownerDocument.body) return jQuery.offset.bodyOffset(elem);
        try {
            box = elem.getBoundingClientRect();
        } catch (e) {}
        var doc = elem.ownerDocument, docElem = doc.documentElement;
        if (!box || !jQuery.contains(docElem, elem)) return box ? {
            top: box.top,
            left: box.left
        } : {
            top: 0,
            left: 0
        };
        var body = doc.body, win = getWindow(doc), clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
        return {
            top: top,
            left: left
        };
    } : function(options) {
        var elem = this[0];
        if (options) return this.each(function(i) {
            jQuery.offset.setOffset(this, options, i);
        });
        if (!elem || !elem.ownerDocument) return null;
        if (elem === elem.ownerDocument.body) return jQuery.offset.bodyOffset(elem);
        jQuery.offset.initialize();
        var computedStyle, offsetParent = elem.offsetParent, prevOffsetParent = elem, doc = elem.ownerDocument, docElem = doc.documentElement, body = doc.body, defaultView = doc.defaultView, prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle, top = elem.offsetTop, left = elem.offsetLeft;
        while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
            if (jQuery.offset.supportsFixedPosition && "fixed" === prevComputedStyle.position) break;
            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top -= elem.scrollTop;
            left -= elem.scrollLeft;
            if (elem === offsetParent) {
                top += elem.offsetTop;
                left += elem.offsetLeft;
                if (jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }
                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }
            if (jQuery.offset.subtractsBorderForOverflowNotVisible && "visible" !== computedStyle.overflow) {
                top += parseFloat(computedStyle.borderTopWidth) || 0;
                left += parseFloat(computedStyle.borderLeftWidth) || 0;
            }
            prevComputedStyle = computedStyle;
        }
        if ("relative" === prevComputedStyle.position || "static" === prevComputedStyle.position) {
            top += body.offsetTop;
            left += body.offsetLeft;
        }
        if (jQuery.offset.supportsFixedPosition && "fixed" === prevComputedStyle.position) {
            top += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);
        }
        return {
            top: top,
            left: left
        };
    };
    jQuery.offset = {
        initialize: function() {
            var innerDiv, checkDiv, td, body = document.body, container = document.createElement("div"), bodyMarginTop = parseFloat(jQuery.css(body, "marginTop")) || 0, html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
            jQuery.extend(container.style, {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            });
            container.innerHTML = html;
            body.insertBefore(container, body.firstChild);
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = 5 !== checkDiv.offsetTop;
            this.doesAddBorderForTableAndCells = 5 === td.offsetTop;
            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";
            this.supportsFixedPosition = 20 === checkDiv.offsetTop || 15 === checkDiv.offsetTop;
            checkDiv.style.position = checkDiv.style.top = "";
            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = -5 === checkDiv.offsetTop;
            this.doesNotIncludeMarginInBodyOffset = body.offsetTop !== bodyMarginTop;
            body.removeChild(container);
            jQuery.offset.initialize = jQuery.noop;
        },
        bodyOffset: function(body) {
            var top = body.offsetTop, left = body.offsetLeft;
            jQuery.offset.initialize();
            if (jQuery.offset.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }
            return {
                top: top,
                left: left
            };
        },
        setOffset: function(elem, options, i) {
            var position = jQuery.css(elem, "position");
            "static" === position && (elem.style.position = "relative");
            var curTop, curLeft, curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [ curCSSTop, curCSSLeft ]) > -1, props = {}, curPosition = {};
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }
            jQuery.isFunction(options) && (options = options.call(elem, i, curOffset));
            null != options.top && (props.top = options.top - curOffset.top + curTop);
            null != options.left && (props.left = options.left - curOffset.left + curLeft);
            "using" in options ? options.using.call(elem, props) : curElem.css(props);
        }
    };
    jQuery.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {
                top: 0,
                left: 0
            } : offsetParent.offset();
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while (offsetParent && !rroot.test(offsetParent.nodeName) && "static" === jQuery.css(offsetParent, "position")) offsetParent = offsetParent.offsetParent;
                return offsetParent;
            });
        }
    });
    jQuery.each([ "Left", "Top" ], function(i, name) {
        var method = "scroll" + name;
        jQuery.fn[method] = function(val) {
            var elem, win;
            if (val === undefined) {
                elem = this[0];
                if (!elem) return null;
                win = getWindow(elem);
                return win ? "pageXOffset" in win ? win[i ? "pageYOffset" : "pageXOffset"] : jQuery.support.boxModel && win.document.documentElement[method] || win.document.body[method] : elem[method];
            }
            return this.each(function() {
                win = getWindow(this);
                win ? win.scrollTo(i ? jQuery(win).scrollLeft() : val, i ? val : jQuery(win).scrollTop()) : this[method] = val;
            });
        };
    });
    jQuery.each([ "Height", "Width" ], function(i, name) {
        var type = name.toLowerCase();
        jQuery.fn["inner" + name] = function() {
            var elem = this[0];
            return elem && elem.style ? parseFloat(jQuery.css(elem, type, "padding")) : null;
        };
        jQuery.fn["outer" + name] = function(margin) {
            var elem = this[0];
            return elem && elem.style ? parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) : null;
        };
        jQuery.fn[type] = function(size) {
            var elem = this[0];
            if (!elem) return null == size ? null : this;
            if (jQuery.isFunction(size)) return this.each(function(i) {
                var self = jQuery(this);
                self[type](size.call(this, i, self[type]()));
            });
            if (jQuery.isWindow(elem)) {
                var docElemProp = elem.document.documentElement["client" + name], body = elem.document.body;
                return "CSS1Compat" === elem.document.compatMode && docElemProp || body && body["client" + name] || docElemProp;
            }
            if (9 === elem.nodeType) return Math.max(elem.documentElement["client" + name], elem.body["scroll" + name], elem.documentElement["scroll" + name], elem.body["offset" + name], elem.documentElement["offset" + name]);
            if (size === undefined) {
                var orig = jQuery.css(elem, type), ret = parseFloat(orig);
                return jQuery.isNaN(ret) ? orig : ret;
            }
            return this.css(type, "string" == typeof size ? size : size + "px");
        };
    });
    window.jQuery = window.$ = jQuery;
})(window);